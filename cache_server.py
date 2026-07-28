"""
本地缓存 / 路径转换服务 (RPC + HTTP)
- WebSocket RPC (xuri-rpc-websocket) :8081  接收 upload / list 调用
- HTTP 文件服务 (aiohttp)                :8080  提供缓存文件 GET
- 哈希相同但大小不同 → 文件名递增序号
- 基于哈希的文件锁处理并发
"""

import asyncio
import hashlib
import mimetypes
import threading
from pathlib import Path
from typing import Any, Optional

from aiohttp import web
from xuri_rpc_websocket import createServer

# ---------------------------------------------------------------------------
# 缓存核心逻辑
# ---------------------------------------------------------------------------

CACHE_DIR = Path(__file__).parent / "cache_data"
CACHE_DIR.mkdir(exist_ok=True)

# 哈希 → 文件锁
_locks: dict[str, threading.Lock] = {}
_locks_lock = threading.Lock()

# 数据行: name -> {hash, size, mime, filename}
_registry: dict[str, dict] = {}
_registry_lock = threading.Lock()

RPC_HOST = "0.0.0.0"
RPC_PORT = 8081
HTTP_HOST = "0.0.0.0"
HTTP_PORT = 8080


def _get_hash_lock(hash_hex: str) -> threading.Lock:
    with _locks_lock:
        if hash_hex not in _locks:
            _locks[hash_hex] = threading.Lock()
        return _locks[hash_hex]


def _compute_hash(data: bytes) -> str:
    return hashlib.sha256(data).hexdigest()


def _resolve_filename(hash_hex: str, size: int) -> str:
    """
    检查哈希对应的文件是否存在且大小一致。
    如果存在且大小一致 → 返回已有文件名
    如果存在但大小不同 → 递增序号: {hash}_1, {hash}_2, ...
    如果不存在 → 返回 {hash}
    """
    base = hash_hex
    candidate = base
    idx = 0
    while True:
        found = list(CACHE_DIR.glob(f"{candidate}.*"))
        if not found:
            return candidate
        for f in found:
            if f.is_file() and f.stat().st_size == size:
                return f.stem
        idx += 1
        candidate = f"{hash_hex}_{idx}"


def _mime_to_ext(mime: str) -> str:
    """简单的 MIME → 扩展名映射"""
    mapping = {
        "image/png": "png",
        "image/jpeg": "jpg",
        "image/gif": "gif",
        "image/webp": "webp",
        "image/svg+xml": "svg",
        "text/html": "html",
        "text/css": "css",
        "text/plain": "txt",
        "application/javascript": "js",
        "application/json": "json",
        "application/pdf": "pdf",
        "application/zip": "zip",
        "application/octet-stream": "bin",
        "audio/mpeg": "mp3",
        "video/mp4": "mp4",
        "font/woff": "woff",
        "font/woff2": "woff2",
    }
    return mapping.get(mime, "bin")


# ---------------------------------------------------------------------------
# RPC 接口 (由 receiver.setObject('rpc', ...) 注册)
# ---------------------------------------------------------------------------
class RemoteFileno:
    """前端传入的远程文件代理对象，提供 read() 方法分块读取数据。"""
    async def read(self) -> Optional[bytes]:
        ...

class RpcHandler:
    """暴露给 Node.js 客户端的 RPC 方法。

    xuri-rpc 会自动将 session context 作为第一个参数注入，
    因此客户端调用 upload(data, name, mime) 对应这里的 upload(ctx, data, name, mime)。
    """

    async def uploadV2(self, ctx: Any, data: RemoteFileno, name: str, mime: str = "application/octet-stream") -> dict:
        """分块上传: 通过远程代理对象的 read() 方法循环读取数据，拼装后存储。"""
        if not name:
            return {"error": "name is required"}

        chunks = bytearray()
        while True:
            chunk = await data.read()
            if not chunk:
                break
            chunks.extend(chunk)

        full_data = bytes(chunks)
        hash_hex = _compute_hash(full_data)
        size = len(full_data)
        lock = _get_hash_lock(hash_hex)

        with lock:
            filename = _resolve_filename(hash_hex, size)
            ext = _mime_to_ext(mime)
            full_filename = f"{filename}.{ext}"
            filepath = CACHE_DIR / full_filename

            if not filepath.exists():
                filepath.write_bytes(full_data)

        with _registry_lock:
            _registry[name] = {
                "hash": hash_hex,
                "size": size,
                "mime": mime,
                "filename": full_filename,
            }

        url = f"http://cache.stellar:8080/{full_filename}"
        return {"url": url, "hash": hash_hex, "name": name}

    async def upload(self, ctx: Any, data: bytes, name: str, mime: str = "application/octet-stream") -> dict:
        """上传缓存: 接收二进制数据，存储后返回 cache.stellar URL。"""
        if not name:
            return {"error": "name is required"}

        hash_hex = _compute_hash(data)
        size = len(data)
        lock = _get_hash_lock(hash_hex)

        with lock:
            filename = _resolve_filename(hash_hex, size)
            ext = _mime_to_ext(mime)
            full_filename = f"{filename}.{ext}"
            filepath = CACHE_DIR / full_filename

            if not filepath.exists():
                filepath.write_bytes(data)

        with _registry_lock:
            _registry[name] = {
                "hash": hash_hex,
                "size": size,
                "mime": mime,
                "filename": full_filename,
            }

        url = f"http://cache.stellar:8080/{full_filename}"
        return {"url": url, "hash": hash_hex, "name": name}

    async def list_cached(self, ctx: Any) -> dict:
        """列出所有有名字的数据行及其对应 URL。"""
        with _registry_lock:
            result = {}
            for name, info in _registry.items():
                result[name] = {
                    "url": f"http://cache.stellar:8080/{info['filename']}",
                    "hash": info["hash"],
                    "size": info["size"],
                    "mime": info["mime"],
                }
        return result

    async def echo(self, ctx: Any) -> str:
        """健康检查。"""
        return "ok"


# ---------------------------------------------------------------------------
# HTTP 文件服务 (aiohttp, :8080)
# ---------------------------------------------------------------------------

async def handle_serve_cache(request: web.Request) -> web.Response:
    """根据 URL 路径获取缓存文件，返回正确 MIME。"""
    filename = request.match_info["filename"]
    filepath = CACHE_DIR / filename
    if not filepath.exists() or not filepath.is_file():
        return web.Response(status=404, text="Not Found")

    # 从注册表查找 mime，否则推断
    mime = None
    with _registry_lock:
        for info in _registry.values():
            if info["filename"] == filename:
                mime = info["mime"]
                break

    if mime is None:
        mime, _ = mimetypes.guess_type(filename)
        mime = mime or "application/octet-stream"

    data = filepath.read_bytes()
    return web.Response(body=data, status=200, content_type=mime)


# ---------------------------------------------------------------------------
# 启动入口
# ---------------------------------------------------------------------------

async def main() -> None:
    # 1) HTTP 文件服务 :8080
    http_app = web.Application()
    http_app.router.add_get("/{filename:.+}", handle_serve_cache)
    http_runner = web.AppRunner(http_app)
    await http_runner.setup()
    http_site = web.TCPSite(http_runner, HTTP_HOST, HTTP_PORT)
    await http_site.start()
    print(f"[HTTP] 文件服务已启动: http://{HTTP_HOST}:{HTTP_PORT}")

    # 2) WebSocket RPC 服务 :8081
    serve, _, receiver = await createServer("cache-server", RPC_HOST, RPC_PORT, "/")
    main_placeholder = object()
    receiver.setObject("rpc", RpcHandler(), True)
    print(f"[RPC] WebSocket RPC 已启动: ws://{RPC_HOST}:{RPC_PORT}/")

    await serve(main_placeholder)


if __name__ == "__main__":
    asyncio.run(main())
