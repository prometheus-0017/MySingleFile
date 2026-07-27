/*
 * pushFile utility - uploads resources to local cache server
 * Based on cache_server.py API:
 *   POST http://localhost:8080/cache/upload?name=<name>&mime=<mime>
 *   Returns: { url, hash, name } where url is http://cache.stellar:8080/<filename>
 */

const CACHE_SERVER_URL = "http://localhost:8080";

export { pushFile };

/**
 * Upload a blob to the cache server and return the cache.stellar URL.
 * @param {Blob} blob - The resource content as a Blob
 * @param {Object} meta - Metadata about the resource
 * @param {string} [meta.originalURL] - The original URL of the resource
 * @param {string} [meta.contentType] - The MIME type of the resource
 * @param {string} [meta.expectedType] - Expected resource type (image, script, etc.)
 * @returns {Promise<string>} The cache.stellar URL for the uploaded resource
 */
async function pushFile(blob, { originalURL, contentType, expectedType } = {}) {
	const name = generateName(originalURL, expectedType);
	const mime = contentType || blob.type || "application/octet-stream";

	const url = new URL(`${CACHE_SERVER_URL}/cache/upload`);
	url.searchParams.set("name", name);
	url.searchParams.set("mime", mime);

	const response = await fetch(url.toString(), {
		method: "POST",
		body: blob
	});

	if (!response.ok) {
		throw new Error(`pushFile: cache server returned ${response.status}`);
	}

	const result = await response.json();
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
