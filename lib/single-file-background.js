(function () {
	'use strict';

	/*
	 * Copyright 2010-2020 Gildas Lormeau
	 * contact : gildas.lormeau <at> gmail.com
	 * 
	 * This file is part of SingleFile.
	 *
	 *   The code in this file is free software: you can redistribute it and/or 
	 *   modify it under the terms of the GNU Affero General Public License 
	 *   (GNU AGPL) as published by the Free Software Foundation, either version 3
	 *   of the License, or (at your option) any later version.
	 * 
	 *   The code in this file is distributed in the hope that it will be useful, 
	 *   but WITHOUT ANY WARRANTY; without even the implied warranty of 
	 *   MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU Affero 
	 *   General Public License for more details.
	 *
	 *   As additional permission under GNU AGPL version 3 section 7, you may 
	 *   distribute UNMODIFIED VERSIONS OF THIS file without the copy of the GNU 
	 *   AGPL normally required by section 4, provided you include this license 
	 *   notice and a URL through which recipients can access the Corresponding 
	 *   Source.
	 */

	/* global window */

	if (typeof globalThis == "undefined") {
		window.globalThis = window;
	}

	(() => {

		const nativeAPI = globalThis.chrome;
		globalThis.__defineGetter__("browser", () => ({
			action: {
				onClicked: {
					addListener: listener => nativeAPI.action.onClicked.addListener(listener)
				},
				setBadgeText: options => nativeAPI.action.setBadgeText(options),
				setBadgeBackgroundColor: options => nativeAPI.action.setBadgeBackgroundColor(options),
				setTitle: options => nativeAPI.action.setTitle(options),
				setIcon: options => nativeAPI.action.setIcon(options)
			},
			bookmarks: {
				get: id => nativeAPI.bookmarks.get(id),
				onCreated: {
					addListener: listener => nativeAPI.bookmarks.onCreated.addListener(listener),
					removeListener: listener => nativeAPI.bookmarks.onCreated.removeListener(listener)
				},
				onChanged: {
					addListener: listener => nativeAPI.bookmarks.onChanged.addListener(listener),
					removeListener: listener => nativeAPI.bookmarks.onChanged.removeListener(listener)
				},
				onMoved: {
					addListener: listener => nativeAPI.bookmarks.onMoved.addListener(listener),
					removeListener: listener => nativeAPI.bookmarks.onMoved.removeListener(listener)
				},
				update: (id, changes) => nativeAPI.bookmarks.update(id, changes)
			},
			commands: {
				onCommand: {
					addListener: listener => nativeAPI.commands.onCommand.addListener(listener)
				}
			},
			downloads: {
				download: options => nativeAPI.downloads.download(options),
				onChanged: {
					addListener: listener => nativeAPI.downloads.onChanged.addListener(listener),
					removeListener: listener => nativeAPI.downloads.onChanged.removeListener(listener)
				},
				search: query => nativeAPI.downloads.search(query)
			},
			i18n: {
				getUILanguage: () => nativeAPI.i18n.getUILanguage(),
				getMessage: (messageName, substitutions) => nativeAPI.i18n.getMessage(messageName, substitutions)
			},
			identity: {
				getRedirectURL: () => nativeAPI.identity.getRedirectURL(),
				getAuthToken: details => nativeAPI.identity.getAuthToken(details),
				launchWebAuthFlow: details => nativeAPI.identity.launchWebAuthFlow(details),
				removeCachedAuthToken: details => nativeAPI.identity.removeCachedAuthToken(details)
			},
			contextMenus: {
				onClicked: {
					addListener: listener => nativeAPI.contextMenus.onClicked.addListener(listener)
				},
				create: options => nativeAPI.contextMenus.create(options),
				update: (menuItemId, options) => nativeAPI.contextMenus.update(menuItemId, options),
				removeAll: () => nativeAPI.contextMenus.removeAll()
			},
			permissions: {
				request: permissions => nativeAPI.permissions.request(permissions),
				remove: permissions => nativeAPI.permissions.remove(permissions)
			},
			runtime: {
				id: nativeAPI.runtime.id,
				sendNativeMessage: (application, message) => new Promise((resolve, reject) => {
					nativeAPI.runtime.sendNativeMessage(application, message, result => {
						if (nativeAPI.runtime.lastError) {
							reject(nativeAPI.runtime.lastError);
						} else {
							resolve(result);
						}
					});
				}),
				getManifest: () => nativeAPI.runtime.getManifest(),
				onMessage: {
					addListener: listener => nativeAPI.runtime.onMessage.addListener((message, sender, sendResponse) => {
						const response = listener(message, sender);
						if (response && typeof response.then == "function") {
							response
								.then(response => {
									if (response !== undefined) {
										try {
											sendResponse(response);
											// eslint-disable-next-line no-unused-vars
										} catch (error) {
											// ignored
										}
									}
								});
							return true;
						}
					}),
					removeListener: listener => nativeAPI.runtime.onMessage.removeListener(listener)
				},
				onMessageExternal: {
					addListener: listener => nativeAPI.runtime.onMessageExternal.addListener((message, sender, sendResponse) => {
						const response = listener(message, sender);
						if (response && typeof response.then == "function") {
							response
								.then(response => {
									if (response !== undefined) {
										try {
											sendResponse(response);
											// eslint-disable-next-line no-unused-vars
										} catch (error) {
											// ignored
										}
									}
								});
							return true;
						}
					})
				},
				sendMessage: message => new Promise((resolve, reject) => {
					nativeAPI.runtime.sendMessage(message, response => {
						if (nativeAPI.runtime.lastError) {
							reject(nativeAPI.runtime.lastError);
						} else {
							resolve(response);
						}
					});
					if (nativeAPI.runtime.lastError) {
						reject(nativeAPI.runtime.lastError);
					}
				}),
				getURL: (path) => nativeAPI.runtime.getURL(path),
				getContexts: (filter) => nativeAPI.runtime.getContexts(filter),
				get lastError() {
					return nativeAPI.runtime.lastError;
				}
			},
			scripting: {
				executeScript: injection => nativeAPI.scripting.executeScript(injection)
			},
			storage: {
				local: {
					set: value => nativeAPI.storage.local.set(value),
					get: keys => nativeAPI.storage.local.get(keys),
					clear: () => nativeAPI.storage.local.clear(),
					remove: keys => nativeAPI.storage.local.remove(keys)
				},
				sync: {
					set: value => nativeAPI.storage.sync.set(value),
					get: keys => nativeAPI.storage.sync.get(keys),
					clear: () => nativeAPI.storage.sync.clear(),
					remove: keys => nativeAPI.storage.sync.remove(keys)
				}
			},
			tabs: {
				onCreated: {
					addListener: listener => nativeAPI.tabs.onCreated.addListener(listener)
				},
				onActivated: {
					addListener: listener => nativeAPI.tabs.onActivated.addListener(listener)
				},
				onUpdated: {
					addListener: listener => nativeAPI.tabs.onUpdated.addListener(listener),
					removeListener: listener => nativeAPI.tabs.onUpdated.removeListener(listener)
				},
				onRemoved: {
					addListener: listener => nativeAPI.tabs.onRemoved.addListener(listener),
					removeListener: listener => nativeAPI.tabs.onRemoved.removeListener(listener)
				},
				onReplaced: {
					addListener: listener => nativeAPI.tabs.onReplaced.addListener(listener),
					removeListener: listener => nativeAPI.tabs.onReplaced.removeListener(listener)
				},
				captureVisibleTab: (windowId, options) => nativeAPI.tabs.captureVisibleTab(windowId, options),
				sendMessage: (tabId, message, options = {}) => new Promise((resolve, reject) => {
					nativeAPI.tabs.sendMessage(tabId, message, options, response => {
						if (nativeAPI.runtime.lastError) {
							reject(nativeAPI.runtime.lastError);
						} else {
							resolve(response);
						}
					});
					if (nativeAPI.runtime.lastError) {
						reject(nativeAPI.runtime.lastError);
					}
				}),
				query: options => nativeAPI.tabs.query(options),
				create: createProperties => nativeAPI.tabs.create(createProperties),
				get: options => nativeAPI.tabs.get(options),
				remove: tabId => nativeAPI.tabs.remove(tabId),
				update: (tabId, updateProperties) => nativeAPI.tabs.update(tabId, updateProperties)
			},
			devtools: {
				inspectedWindow: {
					onResourceContentCommitted: {
						addListener: listener => nativeAPI.devtools.inspectedWindow.onResourceContentCommitted.addListener(listener)
					},
					get tabId() {
						return nativeAPI.devtools.inspectedWindow.tabId;
					}
				}
			},
			offscreen: {
				createDocument: parameters => nativeAPI.offscreen.createDocument(parameters)
			},
			declarativeNetRequest: {
				updateSessionRules: parameters => nativeAPI.declarativeNetRequest.updateSessionRules(parameters)
			}
		}));

	})();

	/*
	 * Copyright 2010-2020 Gildas Lormeau
	 * contact : gildas.lormeau <at> gmail.com
	 * 
	 * This file is part of SingleFile.
	 *
	 *   The code in this file is free software: you can redistribute it and/or 
	 *   modify it under the terms of the GNU Affero General Public License 
	 *   (GNU AGPL) as published by the Free Software Foundation, either version 3
	 *   of the License, or (at your option) any later version.
	 * 
	 *   The code in this file is distributed in the hope that it will be useful, 
	 *   but WITHOUT ANY WARRANTY; without even the implied warranty of 
	 *   MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU Affero 
	 *   General Public License for more details.
	 *
	 *   As additional permission under GNU AGPL version 3 section 7, you may 
	 *   distribute UNMODIFIED VERSIONS OF THIS file without the copy of the GNU 
	 *   AGPL normally required by section 4, provided you include this license 
	 *   notice and a URL through which recipients can access the Corresponding 
	 *   Source.
	 */

	/* global browser, fetch, setTimeout */

	const MAX_CONTENT_SIZE = 8 * (1024 * 1024);
	const REQUEST_WAIT_DELAY = 1000;

	let requestId = 1;

	browser.runtime.onMessage.addListener((message, sender) => {
		if (message.method && message.method.startsWith("singlefile.fetch")) {
			return new Promise(resolve => {
				onRequest(message, sender)
					.then(resolve)
					.catch(error => resolve({ error: error && (error.message || error.toString()) }));
			});
		}
	});

	async function onRequest(message, sender) {
		if (message.method == "singlefile.fetch") {
			try {
				const response = await fetchResource(message.url, { referrer: message.referrer, headers: message.headers });
				return sendResponse(sender.tab.id, message.requestId, response);
			} catch (error) {
				return sendResponse(sender.tab.id, message.requestId, { error: error.message, array: [] });
			}
		} else if (message.method == "singlefile.fetchFrame") {
			return browser.tabs.sendMessage(sender.tab.id, message);
		}
	}

	async function sendResponse(tabId, requestId, response) {
		for (let blockIndex = 0; blockIndex * MAX_CONTENT_SIZE <= response.array.length; blockIndex++) {
			const message = {
				method: "singlefile.fetchResponse",
				requestId,
				headers: response.headers,
				status: response.status,
				error: response.error
			};
			message.truncated = response.array.length > MAX_CONTENT_SIZE;
			if (message.truncated) {
				message.finished = (blockIndex + 1) * MAX_CONTENT_SIZE > response.array.length;
				message.array = response.array.slice(blockIndex * MAX_CONTENT_SIZE, (blockIndex + 1) * MAX_CONTENT_SIZE);
			} else {
				message.array = response.array;
			}
			await browser.tabs.sendMessage(tabId, message);
		}
		return {};
	}

	async function fetchResource(url, options = {}) {
		options.cache = "no-store";
		const response = await fetch(url, options);
		if (options.referrer && (response.status == 401 || response.status == 403 || response.status == 404)) {
			const requestId = await enableReferrerOnError(url, options.referrer);
			await new Promise(resolve => setTimeout(resolve, REQUEST_WAIT_DELAY));
			try {
				const response = await fetch(url, options);
				const array = Array.from(new Uint8Array(await response.arrayBuffer()));
				const headers = { "content-type": response.headers.get("content-type") };
				const status = response.status;
				return {
					array,
					headers,
					status
				};
			} finally {
				await disableReferrerOnError(requestId);
			}
		}

		const array = Array.from(new Uint8Array(await response.arrayBuffer()));
		const headers = { "content-type": response.headers.get("content-type") };
		const status = response.status;
		return {
			array,
			headers,
			status
		};
	}

	async function enableReferrerOnError(url, referrer) {
		const id = requestId++;
		await browser.declarativeNetRequest.updateSessionRules({
			addRules: [{
				action: {
					type: "modifyHeaders",
					requestHeaders: [
						{
							header: "Referer",
							operation: "set",
							value: referrer
						}
					]
				},
				condition: {
					initiatorDomains: [browser.runtime.id],
					urlFilter: url,
					resourceTypes: ["xmlhttprequest"]
				},
				id
			}]
		});
		return id;
	}

	async function disableReferrerOnError(requestId) {
		await browser.declarativeNetRequest.updateSessionRules({
			removeRuleIds: [requestId]
		});
	}

	/*
	 * Copyright 2010-2020 Gildas Lormeau
	 * contact : gildas.lormeau <at> gmail.com
	 * 
	 * This file is part of SingleFile.
	 *
	 *   The code in this file is free software: you can redistribute it and/or 
	 *   modify it under the terms of the GNU Affero General Public License 
	 *   (GNU AGPL) as published by the Free Software Foundation, either version 3
	 *   of the License, or (at your option) any later version.
	 * 
	 *   The code in this file is distributed in the hope that it will be useful, 
	 *   but WITHOUT ANY WARRANTY; without even the implied warranty of 
	 *   MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU Affero 
	 *   General Public License for more details.
	 *
	 *   As additional permission under GNU AGPL version 3 section 7, you may 
	 *   distribute UNMODIFIED VERSIONS OF THIS file without the copy of the GNU 
	 *   AGPL normally required by section 4, provided you include this license 
	 *   notice and a URL through which recipients can access the Corresponding 
	 *   Source.
	 */

	/* global browser */

	browser.runtime.onMessage.addListener((message, sender) => {
		if (message.method == "singlefile.frameTree.initResponse" || message.method == "singlefile.frameTree.ackInitRequest") {
			browser.tabs.sendMessage(sender.tab.id, message, { frameId: 0 });
			return Promise.resolve({});
		}
	});

	/*
	 * Copyright 2010-2020 Gildas Lormeau
	 * contact : gildas.lormeau <at> gmail.com
	 * 
	 * This file is part of SingleFile.
	 *
	 *   The code in this file is free software: you can redistribute it and/or 
	 *   modify it under the terms of the GNU Affero General Public License 
	 *   (GNU AGPL) as published by the Free Software Foundation, either version 3
	 *   of the License, or (at your option) any later version.
	 * 
	 *   The code in this file is distributed in the hope that it will be useful, 
	 *   but WITHOUT ANY WARRANTY; without even the implied warranty of 
	 *   MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU Affero 
	 *   General Public License for more details.
	 *
	 *   As additional permission under GNU AGPL version 3 section 7, you may 
	 *   distribute UNMODIFIED VERSIONS OF THIS file without the copy of the GNU 
	 *   AGPL normally required by section 4, provided you include this license 
	 *   notice and a URL through which recipients can access the Corresponding 
	 *   Source.
	 */

	/* global browser, setTimeout, clearTimeout */

	const timeouts = new Map();

	browser.runtime.onMessage.addListener((message, sender) => {
		if (message.method == "singlefile.lazyTimeout.setTimeout") {
			let tabTimeouts = timeouts.get(sender.tab.id);
			let frameTimeouts;
			if (tabTimeouts) {
				frameTimeouts = tabTimeouts.get(sender.frameId);
				if (frameTimeouts) {
					const previousTimeoutId = frameTimeouts.get(message.type);
					if (previousTimeoutId) {
						clearTimeout(previousTimeoutId);
					}
				} else {
					frameTimeouts = new Map();
				}
			}
			const timeoutId = setTimeout(async () => {
				try {
					const tabTimeouts = timeouts.get(sender.tab.id);
					const frameTimeouts = tabTimeouts.get(sender.frameId);
					if (tabTimeouts && frameTimeouts) {
						deleteTimeout(frameTimeouts, message.type);
					}
					await browser.tabs.sendMessage(sender.tab.id, { method: "singlefile.lazyTimeout.onTimeout", type: message.type });
					// eslint-disable-next-line no-unused-vars
				} catch (error) {
					// ignored
				}
			}, message.delay);
			if (!tabTimeouts) {
				tabTimeouts = new Map();
				frameTimeouts = new Map();
				tabTimeouts.set(sender.frameId, frameTimeouts);
				timeouts.set(sender.tab.id, tabTimeouts);
			}
			frameTimeouts.set(message.type, timeoutId);
			return Promise.resolve({});
		}
		if (message.method == "singlefile.lazyTimeout.clearTimeout") {
			let tabTimeouts = timeouts.get(sender.tab.id);
			if (tabTimeouts) {
				const frameTimeouts = tabTimeouts.get(sender.frameId);
				if (frameTimeouts) {
					const timeoutId = frameTimeouts.get(message.type);
					if (timeoutId) {
						clearTimeout(timeoutId);
					}
					deleteTimeout(frameTimeouts, message.type);
				}
			}
			return Promise.resolve({});
		}
	});

	browser.tabs.onRemoved.addListener(tabId => timeouts.delete(tabId));

	function deleteTimeout(framesTimeouts, type) {
		framesTimeouts.delete(type);
	}

})();
