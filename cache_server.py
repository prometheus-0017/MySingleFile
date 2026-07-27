"""
本地缓存 / 路径转换服务
- 输入 bytes + name + mime → 计算哈希 → 本地存储 → 返回 cache.stellar URL
- 哈希相同但大小不同 → 文件名递增序号
- 基于哈希的文件锁处理并发
"""

import hashlib
import os
import threading
from pathlib import Path

from flask import Flask, Response, jsonify, request

app = Flask(__name__)


@app.after_request
def add_cors_headers(response):
    response.headers["Access-Control-Allow-Origin"] = "*"
    response.headers["Access-Control-Allow-Methods"] = "GET, POST, OPTIONS"
    response.headers["Access-Control-Allow-Headers"] = "Content-Type"
    return response

CACHE_DIR = Path(__file__).parent / "cache_data"
CACHE_DIR.mkdir(exist_ok=True)

# 哈希 → 文件锁
_locks: dict[str, threading.Lock] = {}
_locks_lock = threading.Lock()

# 数据行: name -> {hash, size, mime, filename}
_registry: dict[str, dict] = {}
_registry_lock = threading.Lock()


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
        # 尝试所有可能的扩展名（通过 glob 查找）
        found = list(CACHE_DIR.glob(f"{candidate}.*"))
        if not found:
            # 文件不存在，可以使用这个名字
            return candidate
        # 检查是否有大小匹配的文件
        for f in found:
            if f.is_file() and f.stat().st_size == size:
                return f.stem  # 匹配，返回不带扩展名的名字
        # 大小不匹配，递增序号
        idx += 1
        candidate = f"{hash_hex}_{idx}"


@app.route("/cache/upload", methods=["POST", "OPTIONS"])
def upload():
    """
    上传缓存:
    - body: 文件二进制内容
    - param name: 缓存名称
    - param mime: MIME 类型
    返回: cache.stellar URL
    """
    data = request.get_data()
    name = request.args.get("name", "")
    mime = request.args.get("mime", "application/octet-stream")

    if not name:
        return jsonify({"error": "name is required"}), 400

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

    # 注册 name -> 文件映射
    with _registry_lock:
        _registry[name] = {
            "hash": hash_hex,
            "size": size,
            "mime": mime,
            "filename": full_filename,
        }

    url = f"http://cache.stellar:8080/{full_filename}"
    return jsonify({"url": url, "hash": hash_hex, "name": name})


@app.route("/cache/list", methods=["GET"])
def list_cached():
    """列出所有有名字的数据行及其对应 URL"""
    with _registry_lock:
        result = {}
        for name, info in _registry.items():
            result[name] = {
                "url": f"http://cache.stellar:8080/{info['filename']}",
                "hash": info["hash"],
                "size": info["size"],
                "mime": info["mime"],
            }
    return jsonify(result)


@app.route("/<path:filename>", methods=["GET"])
def serve_cache(filename: str):
    """根据 URL 路径获取缓存文件，返回正确 MIME"""
    filepath = CACHE_DIR / filename
    if not filepath.exists() or not filepath.is_file():
        return Response("Not Found", status=404)

    # 从注册表查找 mime，否则推断
    mime = None
    with _registry_lock:
        for info in _registry.values():
            if info["filename"] == filename:
                mime = info["mime"]
                break

    if mime is None:
        import mimetypes
        mime, _ = mimetypes.guess_type(filename)
        mime = mime or "application/octet-stream"

    data = filepath.read_bytes()
    return Response(data, status=200, mimetype=mime)


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


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=8080, threaded=True)
