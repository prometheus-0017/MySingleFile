/*
 * pushFile utility - uploads resources to local cache server via WebSocket RPC
 * Uses @xuri-rpc/websocket-sender to communicate with cache_server.py
 * RPC server runs on ws://localhost:8081/
 * HTTP file server runs on http://cache.stellar:8080/
 */

import { createMain } from "@xuri-rpc/websocket-sender";

const RPC_HOST = "localhost";
const RPC_PORT = 8081;
const RPC_PATH = "/";
const HOST_ID = "singlefile-cache-client";

export { pushFile };

let _rpcClient = null;
let _rpc = null;
let _rpcReady = false;

/**
 * Lazily initialize the RPC connection to the cache server.
 * Reconnects automatically if the connection is lost.
 */
async function ensureRpc() {
	if (_rpcReady && _rpc) {
		return _rpc;
	}
	const [client, main] = await createMain(HOST_ID, RPC_HOST, RPC_PORT, RPC_PATH);
	_rpcClient = client;
	_rpc = await client.getObject("rpc");
	_rpcReady = true;
	return _rpc;
}

/**
 * Upload a blob to the cache server and return the cache.stellar URL.
 * @param {Blob} blob - The resource content as a Blob
 * @param {Object} meta - Metadata about the resource
 * @param {string} [meta.originalURL] - The original URL of the resource
 * @param {string} [meta.contentType] - The MIME type of the resource
 * @param {string} [meta.expectedType] - Expected resource type (image, script, etc.)
 * @returns {Promise<string>} The cache.stellar URL for the uploaded resource
 */
const CHUNK_SIZE = 100 * 1024; // 100KB per chunk

async function pushFile(blob, { originalURL, contentType, expectedType } = {}) {
	const rpc = await ensureRpc();
	const name = generateName(originalURL, expectedType);
	const mime = contentType || blob.type || "application/octet-stream";

	// Convert Blob to Uint8Array for chunked RPC transport
	const arrayBuffer = await blob.arrayBuffer();
	const data = new Uint8Array(arrayBuffer);
	let offset = 0;

	const remoteFile = {
		read() {
			if (offset >= data.length) {
				return new Uint8Array(0);
			}
			const end = Math.min(offset + CHUNK_SIZE, data.length);
			const chunk = data.slice(offset, end);
			offset = end;
			return chunk;
		},
	};

	const result = await rpc.uploadV2(remoteFile, name, mime);
	if (result.error) {
		throw new Error(`pushFile: ${result.error}`);
	}
	return result.url;
}

/**
 * Generate a cache name from the original URL and resource type.
 */
function generateName(originalURL, expectedType) {
	if (!originalURL) {
		return `resource_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
	}
	try {
		const parsedURL = new URL(originalURL);
		const pathname = parsedURL.pathname.replace(/[^a-zA-Z0-9._-]/g, "_");
		const hostname = parsedURL.hostname.replace(/[^a-zA-Z0-9.-]/g, "_");
		return `${hostname}${pathname}`;
	} catch {
		return originalURL.replace(/[^a-zA-Z0-9._-]/g, "_").slice(0, 200);
	}
}
