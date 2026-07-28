(function () {
	'use strict';

	(function () {

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

	})();

	/* global TextEncoder, TextDecoder */

	const TYPE_REFERENCE = 0;
	const SPECIAL_TYPES = [TYPE_REFERENCE];
	const EMPTY_SLOT_VALUE = Symbol();

	const textEncoder$1 = new TextEncoder();
	const textDecoder = new TextDecoder();
	const types = new Array(256);
	let typeIndex = 0;

	registerType(serializeCircularReference, parseCircularReference, testCircularReference, TYPE_REFERENCE);
	registerType(null, parseObject, testObject);
	registerType(serializeArray, parseArray, testArray);
	registerType(serializeString, parseString, testString);
	registerType(serializeTypedArray, parseFloat64Array, testFloat64Array);
	registerType(serializeTypedArray, parseFloat32Array, testFloat32Array);
	registerType(serializeTypedArray, parseUint32Array, testUint32Array);
	registerType(serializeTypedArray, parseInt32Array, testInt32Array);
	registerType(serializeTypedArray, parseUint16Array, testUint16Array);
	registerType(serializeTypedArray, parseInt16Array, testInt16Array);
	registerType(serializeTypedArray, parseUint8ClampedArray, testUint8ClampedArray);
	registerType(serializeTypedArray, parseUint8Array, testUint8Array);
	registerType(serializeTypedArray, parseInt8Array, testInt8Array);
	registerType(serializeArrayBuffer, parseArrayBuffer, testArrayBuffer);
	registerType(serializeNumber, parseNumber, testNumber);
	registerType(serializeUint32, parseUint32, testUint32);
	registerType(serializeInt32, parseInt32, testInt32);
	registerType(serializeUint16, parseUint16, testUint16);
	registerType(serializeInt16, parseInt16, testInt16);
	registerType(serializeUint8, parseUint8, testUint8);
	registerType(serializeInt8, parseInt8, testInt8);
	registerType(null, parseUndefined, testUndefined);
	registerType(null, parseNull, testNull);
	registerType(null, parseNaN, testNaN);
	registerType(serializeBoolean, parseBoolean, testBoolean);
	registerType(serializeSymbol, parseSymbol, testSymbol);
	registerType(null, parseEmptySlot, testEmptySlot);
	registerType(serializeMap, parseMap, testMap);
	registerType(serializeSet, parseSet, testSet);
	registerType(serializeDate, parseDate, testDate);
	registerType(serializeError, parseError, testError);
	registerType(serializeRegExp, parseRegExp, testRegExp);
	registerType(serializeStringObject, parseStringObject, testStringObject);
	registerType(serializeNumberObject, parseNumberObject, testNumberObject);
	registerType(serializeBooleanObject, parseBooleanObject, testBooleanObject);

	function registerType(serialize, parse, test, type) {
		if (type === undefined) {
			typeIndex++;
			if (types.length - typeIndex >= SPECIAL_TYPES.length) {
				types[types.length - typeIndex] = { serialize, parse, test };
			} else {
				throw new Error("Reached maximum number of custom types");
			}
		} else {
			types[type] = { serialize, parse, test };
		}
	}

	async function serializeValue(data, value) {
		const type = types.findIndex(({ test } = {}) => test && test(value, data));
		data.addObject(value);
		await data.append(new Uint8Array([type]));
		const serialize = types[type].serialize;
		if (serialize) {
			await serialize(data, value);
		}
		if (type != TYPE_REFERENCE && testObject(value)) {
			await serializeSymbols(data, value);
			await serializeOwnProperties(data, value);
		}
	}

	async function serializeSymbols(data, value) {
		const ownPropertySymbols = Object.getOwnPropertySymbols(value);
		const symbols = ownPropertySymbols.map(propertySymbol => [propertySymbol, value[propertySymbol]]);
		await serializeArray(data, symbols);
	}

	async function serializeOwnProperties(data, value) {
		if (!ArrayBuffer.isView(value)) {
			let entries = Object.entries(value);
			if (testArray(value)) {
				entries = entries.filter(([key]) => !testInteger(Number(key)));
			}
			await serializeValue(data, entries.length);
			for (const [key, value] of entries) {
				await serializeString(data, key);
				await serializeValue(data, value);
			}
		} else {
			await serializeValue(data, 0);
		}
	}

	async function serializeCircularReference(data, value) {
		const index = data.objects.indexOf(value);
		await serializeValue(data, index);
	}

	async function serializeArray(data, array) {
		await serializeValue(data, array.length);
		const notEmptyIndexes = Object.keys(array).filter(key => testInteger(Number(key))).map(key => Number(key));
		let indexNotEmptyIndexes = 0, currentNotEmptyIndex = notEmptyIndexes[indexNotEmptyIndexes];
		for (const [indexArray, value] of array.entries()) {
			if (currentNotEmptyIndex == indexArray) {
				currentNotEmptyIndex = notEmptyIndexes[++indexNotEmptyIndexes];
				await serializeValue(data, value);
			} else {
				await serializeValue(data, EMPTY_SLOT_VALUE);
			}
		}
	}

	async function serializeString(data, string) {
		const encodedString = textEncoder$1.encode(string);
		await serializeValue(data, encodedString.length);
		await data.append(encodedString);
	}

	async function serializeTypedArray(data, array) {
		await serializeValue(data, array.length);
		await data.append(array.constructor.name == "Uint8Array" ? array : new Uint8Array(array.buffer));
	}

	async function serializeArrayBuffer(data, arrayBuffer) {
		await serializeValue(data, arrayBuffer.byteLength);
		await data.append(new Uint8Array(arrayBuffer));
	}

	async function serializeNumber(data, number) {
		const serializedNumber = new Uint8Array(new Float64Array([number]).buffer);
		await data.append(serializedNumber);
	}

	async function serializeUint32(data, number) {
		const serializedNumber = new Uint8Array(new Uint32Array([number]).buffer);
		await data.append(serializedNumber);
	}

	async function serializeInt32(data, number) {
		const serializedNumber = new Uint8Array(new Int32Array([number]).buffer);
		await data.append(serializedNumber);
	}

	async function serializeUint16(data, number) {
		const serializedNumber = new Uint8Array(new Uint16Array([number]).buffer);
		await data.append(serializedNumber);
	}

	async function serializeInt16(data, number) {
		const serializedNumber = new Uint8Array(new Int16Array([number]).buffer);
		await data.append(serializedNumber);
	}

	async function serializeUint8(data, number) {
		const serializedNumber = new Uint8Array([number]);
		await data.append(serializedNumber);
	}

	async function serializeInt8(data, number) {
		const serializedNumber = new Uint8Array(new Int8Array([number]).buffer);
		await data.append(serializedNumber);
	}

	async function serializeBoolean(data, boolean) {
		const serializedBoolean = new Uint8Array([Number(boolean)]);
		await data.append(serializedBoolean);
	}

	async function serializeMap(data, map) {
		const entries = map.entries();
		await serializeValue(data, map.size);
		for (const [key, value] of entries) {
			await serializeValue(data, key);
			await serializeValue(data, value);
		}
	}

	async function serializeSet(data, set) {
		await serializeValue(data, set.size);
		for (const value of set) {
			await serializeValue(data, value);
		}
	}

	async function serializeDate(data, date) {
		await serializeNumber(data, date.getTime());
	}

	async function serializeError(data, error) {
		await serializeString(data, error.message);
		await serializeString(data, error.stack);
	}

	async function serializeRegExp(data, regExp) {
		await serializeString(data, regExp.source);
		await serializeString(data, regExp.flags);
	}

	async function serializeStringObject(data, string) {
		await serializeString(data, string.valueOf());
	}

	async function serializeNumberObject(data, number) {
		await serializeNumber(data, number.valueOf());
	}

	async function serializeBooleanObject(data, boolean) {
		await serializeBoolean(data, boolean.valueOf());
	}

	async function serializeSymbol(data, symbol) {
		await serializeString(data, symbol.description);
	}

	class Reference {
		constructor(index, data) {
			this.index = index;
			this.data = data;
		}

		getObject() {
			return this.data.objects[this.index];
		}
	}

	class ParserData {
		constructor(consumeData) {
			this.stream = new ReadStream(consumeData);
			this.objects = [];
			this.setters = [];
		}

		consume(size) {
			return this.stream.consume(size);
		}

		getObjectId() {
			const objectIndex = this.objects.length;
			this.objects.push(undefined);
			return objectIndex;
		}

		resolveObject(objectId, value) {
			if (testReferenceable(value) && !testReference(value)) {
				this.objects[objectId] = value;
			}
		}

		setObject(functionArguments, setterFunction) {
			this.setters.push({ functionArguments, setterFunction });
		}

		executeSetters() {
			this.setters.forEach(({ functionArguments, setterFunction }) => {
				const resolvedArguments = functionArguments.map(argument => testReference(argument) ? argument.getObject() : argument);
				setterFunction(...resolvedArguments);
			});
		}
	}

	class ReadStream {
		constructor(consumeData) {
			this.offset = 0;
			this.value = new Uint8Array(0);
			this.consumeData = consumeData;
		}

		async consume(size) {
			if (this.offset + size > this.value.length) {
				const pending = new Uint8Array(this.value).subarray(this.offset, this.value.length);
				const value = await this.consumeData();
				if (pending.length + value.length != this.value.length) {
					this.value = new Uint8Array(pending.length + value.length);
				}
				this.value.set(pending);
				this.value.set(value, pending.length);
				this.offset = 0;
				return this.consume(size);
			} else {
				const result = this.value.slice(this.offset, this.offset + size);
				this.offset += result.length;
				return result;
			}
		}
	}

	function getParser() {
		let parserData, input, setInput, value, previousData, resolvePreviousData;
		return {
			async next(input) {
				return input ? getResult(input) : { value: await value, done: true };
			},
			return() {
				return { done: true };
			}
		};

		async function getResult(input) {
			if (previousData) {
				await previousData;
			} else {
				initParserData().catch(() => { /* ignored */ });
			}
			initPreviousData();
			setInput(input);
			return { done: false };
		}

		async function initParserData() {
			let setValue;
			value = new Promise(resolve => setValue = resolve);
			parserData = new ParserData(consumeData);
			initChunk();
			const data = await parseValue(parserData);
			parserData.executeSetters();
			setValue(data);
		}

		function initChunk() {
			input = new Promise(resolve => setInput = resolve);
		}

		function initPreviousData() {
			previousData = new Promise(resolve => resolvePreviousData = resolve);
		}

		async function consumeData() {
			const data = await input;
			initChunk();
			if (resolvePreviousData) {
				resolvePreviousData();
			}
			return data;
		}
	}

	async function parseValue(data) {
		const array = await data.consume(1);
		const parserType = array[0];
		const parse = types[parserType].parse;
		const valueId = data.getObjectId();
		const result = await parse(data);
		if (parserType != TYPE_REFERENCE && testObject(result)) {
			await parseSymbols(data, result);
			await parseOwnProperties(data, result);
		}
		data.resolveObject(valueId, result);
		return result;
	}

	async function parseSymbols(data, value) {
		const symbols = await parseArray(data);
		data.setObject([symbols], symbols => symbols.forEach(([symbol, propertyValue]) => value[symbol] = propertyValue));
	}

	async function parseOwnProperties(data, object) {
		const size = await parseValue(data);
		if (size) {
			await parseNextProperty();
		}

		async function parseNextProperty(indexKey = 0) {
			const key = await parseString(data);
			const value = await parseValue(data);
			data.setObject([value], value => object[key] = value);
			if (indexKey < size - 1) {
				await parseNextProperty(indexKey + 1);
			}
		}
	}

	async function parseCircularReference(data) {
		const index = await parseValue(data);
		const result = new Reference(index, data);
		return result;
	}

	function parseObject() {
		return {};
	}

	async function parseArray(data) {
		const length = await parseValue(data);
		const array = new Array(length);
		if (length) {
			await parseNextSlot();
		}
		return array;

		async function parseNextSlot(indexArray = 0) {
			const value = await parseValue(data);
			if (!testEmptySlot(value)) {
				data.setObject([value], value => array[indexArray] = value);
			}
			if (indexArray < length - 1) {
				await parseNextSlot(indexArray + 1);
			}
		}
	}

	function parseEmptySlot() {
		return EMPTY_SLOT_VALUE;
	}

	async function parseString(data) {
		const size = await parseValue(data);
		const array = await data.consume(size);
		return textDecoder.decode(array);
	}

	async function parseFloat64Array(data) {
		const length = await parseValue(data);
		const array = await data.consume(length * 8);
		return new Float64Array(array.buffer);
	}

	async function parseFloat32Array(data) {
		const length = await parseValue(data);
		const array = await data.consume(length * 4);
		return new Float32Array(array.buffer);
	}

	async function parseUint32Array(data) {
		const length = await parseValue(data);
		const array = await data.consume(length * 4);
		return new Uint32Array(array.buffer);
	}

	async function parseInt32Array(data) {
		const length = await parseValue(data);
		const array = await data.consume(length * 4);
		return new Int32Array(array.buffer);
	}

	async function parseUint16Array(data) {
		const length = await parseValue(data);
		const array = await data.consume(length * 2);
		return new Uint16Array(array.buffer);
	}

	async function parseInt16Array(data) {
		const length = await parseValue(data);
		const array = await data.consume(length * 2);
		return new Int16Array(array.buffer);
	}

	async function parseUint8ClampedArray(data) {
		const length = await parseValue(data);
		const array = await data.consume(length);
		return new Uint8ClampedArray(array.buffer);
	}

	async function parseUint8Array(data) {
		const length = await parseValue(data);
		const array = await data.consume(length);
		return array;
	}

	async function parseInt8Array(data) {
		const length = await parseValue(data);
		const array = await data.consume(length);
		return new Int8Array(array.buffer);
	}

	async function parseArrayBuffer(data) {
		const length = await parseValue(data);
		const array = await data.consume(length);
		return array.buffer;
	}

	async function parseNumber(data) {
		const array = await data.consume(8);
		return new Float64Array(array.buffer)[0];
	}

	async function parseUint32(data) {
		const array = await data.consume(4);
		return new Uint32Array(array.buffer)[0];
	}

	async function parseInt32(data) {
		const array = await data.consume(4);
		return new Int32Array(array.buffer)[0];
	}

	async function parseUint16(data) {
		const array = await data.consume(2);
		return new Uint16Array(array.buffer)[0];
	}

	async function parseInt16(data) {
		const array = await data.consume(2);
		return new Int16Array(array.buffer)[0];
	}

	async function parseUint8(data) {
		const array = await data.consume(1);
		return new Uint8Array(array.buffer)[0];
	}

	async function parseInt8(data) {
		const array = await data.consume(1);
		return new Int8Array(array.buffer)[0];
	}

	function parseUndefined() {
		return undefined;
	}

	function parseNull() {
		return null;
	}

	function parseNaN() {
		return NaN;
	}

	async function parseBoolean(data) {
		const array = await data.consume(1);
		return Boolean(array[0]);
	}

	async function parseMap(data) {
		const size = await parseValue(data);
		const map = new Map();
		if (size) {
			await parseNextEntry();
		}
		return map;

		async function parseNextEntry(indexKey = 0) {
			const key = await parseValue(data);
			const value = await parseValue(data);
			data.setObject([key, value], (key, value) => map.set(key, value));
			if (indexKey < size - 1) {
				await parseNextEntry(indexKey + 1);
			}
		}
	}

	async function parseSet(data) {
		const size = await parseValue(data);
		const set = new Set();
		if (size) {
			await parseNextEntry();
		}
		return set;

		async function parseNextEntry(indexKey = 0) {
			const value = await parseValue(data);
			data.setObject([value], value => set.add(value));
			if (indexKey < size - 1) {
				await parseNextEntry(indexKey + 1);
			}
		}
	}

	async function parseDate(data) {
		const milliseconds = await parseNumber(data);
		return new Date(milliseconds);
	}

	async function parseError(data) {
		const message = await parseString(data);
		const stack = await parseString(data);
		const error = new Error(message);
		error.stack = stack;
		return error;
	}

	async function parseRegExp(data) {
		const source = await parseString(data);
		const flags = await parseString(data);
		return new RegExp(source, flags);
	}

	async function parseStringObject(data) {
		return new String(await parseString(data));
	}

	async function parseNumberObject(data) {
		return new Number(await parseNumber(data));
	}

	async function parseBooleanObject(data) {
		return new Boolean(await parseBoolean(data));
	}

	async function parseSymbol(data) {
		const description = await parseString(data);
		return Symbol(description);
	}

	function testCircularReference(value, data) {
		return testObject(value) && data.objects.includes(value);
	}

	function testReference(value) {
		return value instanceof Reference;
	}

	function testObject(value) {
		return value === Object(value);
	}

	function testArray(value) {
		return typeof value.length == "number";
	}

	function testEmptySlot(value) {
		return value === EMPTY_SLOT_VALUE;
	}

	function testString(value) {
		return typeof value == "string";
	}

	function testFloat64Array(value) {
		return value.constructor.name == "Float64Array";
	}

	function testUint32Array(value) {
		return value.constructor.name == "Uint32Array";
	}

	function testInt32Array(value) {
		return value.constructor.name == "Int32Array";
	}

	function testUint16Array(value) {
		return value.constructor.name == "Uint16Array";
	}

	function testFloat32Array(value) {
		return value.constructor.name == "Float32Array";
	}

	function testInt16Array(value) {
		return value.constructor.name == "Int16Array";
	}

	function testUint8ClampedArray(value) {
		return value.constructor.name == "Uint8ClampedArray";
	}

	function testUint8Array(value) {
		return value.constructor.name == "Uint8Array";
	}

	function testInt8Array(value) {
		return value.constructor.name == "Int8Array";
	}

	function testArrayBuffer(value) {
		return value.constructor.name == "ArrayBuffer";
	}

	function testNumber(value) {
		return typeof value == "number";
	}

	function testUint32(value) {
		return testInteger(value) && value >= 0 && value <= 4294967295;
	}

	function testInt32(value) {
		return testInteger(value) && value >= -2147483648 && value <= 2147483647;
	}

	function testUint16(value) {
		return testInteger(value) && value >= 0 && value <= 65535;
	}

	function testInt16(value) {
		return testInteger(value) && value >= -32768 && value <= 32767;
	}

	function testUint8(value) {
		return testInteger(value) && value >= 0 && value <= 255;
	}

	function testInt8(value) {
		return testInteger(value) && value >= -128 && value <= 127;
	}

	function testInteger(value) {
		return testNumber(value) && Number.isInteger(value);
	}

	function testUndefined(value) {
		return value === undefined;
	}

	function testNull(value) {
		return value === null;
	}

	function testNaN(value) {
		return Number.isNaN(value);
	}

	function testBoolean(value) {
		return typeof value == "boolean";
	}

	function testMap(value) {
		return value instanceof Map;
	}

	function testSet(value) {
		return value instanceof Set;
	}

	function testDate(value) {
		return value instanceof Date;
	}

	function testError(value) {
		return value instanceof Error;
	}

	function testRegExp(value) {
		return value instanceof RegExp;
	}

	function testStringObject(value) {
		return value instanceof String;
	}

	function testNumberObject(value) {
		return value instanceof Number;
	}

	function testBooleanObject(value) {
		return value instanceof Boolean;
	}

	function testSymbol(value) {
		return typeof value == "symbol";
	}

	function testReferenceable(value) {
		return testObject(value) || testSymbol(value);
	}

	class PreArgObj {
	    constructor(type, data) {
	        this.type = type;
	        this.data = data;
	    }
	}
	let debugFlag = false;
	let hostId = null;
	class RemoteProxyManager {
	    constructor() {
	        this.map = new Map();
	        this.clientMap = new Map();
	    }
	    set(id, proxy, client) {
	        var _a;
	        this.map.set(id, new WeakRef(proxy));
	        if (this.clientMap.get(client) == null) {
	            this.clientMap.set(client, new Set());
	        }
	        (_a = this.clientMap.get(client)) === null || _a === void 0 ? void 0 : _a.add(id);
	    }
	    get(id) {
	        var _a;
	        if (!this.map.has(id)) {
	            return null;
	        }
	        let result = (_a = this.map.get(id)) === null || _a === void 0 ? void 0 : _a.deref();
	        if (result == null) {
	            this.map.delete(id);
	            return null;
	        }
	        return result;
	    }
	}
	// let runnableProxyManager=new RunnableProxyManager()
	class ProxyObjectHandlerForManager {
	    constructor(id, target) {
	        this.lastRegistered = 0;
	        this.id = id;
	        this.target = target;
	        this.lastRegistered = Date.now();
	    }
	}
	class ObjectOfProxyManager {
	    constructor() {
	        this.proxyMap = new Map();
	        this.reverseProxyMap = new Map();
	    }
	    set(obj, id) {
	        this.proxyMap.set(obj, id);
	        this.reverseProxyMap.set(id, new ProxyObjectHandlerForManager(id, obj));
	    }
	    reRegister(id) {
	        let handler = this.reverseProxyMap.get(id);
	        if (handler) {
	            handler.lastRegistered = Date.now();
	        }
	    }
	    getById(id) {
	        var _a;
	        return (_a = this.reverseProxyMap.get(id)) === null || _a === void 0 ? void 0 : _a.target;
	    }
	    get(obj) {
	        return this.proxyMap.get(obj);
	    }
	    has(obj) {
	        return this.proxyMap.has(obj);
	    }
	    deleteById(id) {
	        var _a;
	        let obj = (_a = this.reverseProxyMap.get(id)) === null || _a === void 0 ? void 0 : _a.target;
	        this.proxyMap.delete(obj);
	        this.reverseProxyMap.delete(id);
	    }
	    delete(obj) {
	        this.reverseProxyMap.delete(this.proxyMap.get(obj));
	        this.proxyMap.delete(obj);
	    }
	}
	function getOrGenerateObjectId(obj, hostIdFrom) {
	    const proxyManager = getOrCreateOption(hostIdFrom).objectOfProxyManager;
	    if (hostIdFrom == null) {
	        throw new Error("hostId is null");
	    }
	    if (!proxyManager.has(obj)) {
	        let id = getId(hostIdFrom);
	        proxyManager.set(obj, id);
	    }
	    let id = proxyManager.get(obj);
	    return id;
	}
	function createProxyForObject(proxyId, obj, hostId) {
	    let proxy = null;
	    // if obj is a function
	    if (typeof obj == 'function') {
	        proxy = {
	            id: proxyId,
	            hostId: hostId,
	            members: [{ type: 'function', name: '__call__' }]
	        };
	    }
	    else {
	        if (obj == null) {
	            proxy = null;
	        }
	        else {
	            function getAllProperties(obj) {
	                const props = new Set();
	                let current = obj;
	                while (current !== null) {
	                    Object.getOwnPropertyNames(current).forEach(prop => props.add(prop));
	                    current = Object.getPrototypeOf(current);
	                }
	                return Array.from(props);
	            }
	            proxy = {
	                id: proxyId,
	                hostId: hostId,
	                members: getAllProperties(obj)
	                    .filter(k => ((typeof obj[k]) == 'function'))
	                    .filter(k => !k.startsWith('__'))
	                    .map(k => ({ name: k, type: 'function' }))
	            };
	        }
	    }
	    return proxy;
	}
	//目前必须有hostId，哪怕pool可以公用，你proxy总得说明是那个hostId啊
	function asProxy(obj, hostIdFrom) {
	    const hostId = getOrCreateOption(hostIdFrom).hostId;
	    let id = getOrGenerateObjectId(obj, hostId);
	    let proxy = createProxyForObject(id, obj, hostId);
	    return new PreArgObj('proxy', proxy);
	}
	function generateErrorReply(message, errorText, status = 500, hostIdParam) {
	    let reply = {
	        id: getId(hostIdParam),
	        idFor: message.id,
	        meta: {},
	        trace: errorText,
	        status,
	    };
	    return reply;
	}
	class NotImplementSender {
	    send(message) {
	        throw new Error('Not implement');
	    }
	}
	function isDict(obj) {
	    if (obj === null || obj === undefined)
	        return false;
	    return Object.getPrototypeOf(obj) === Object.prototype;
	}
	function isString(value) {
	    return typeof value === 'string';
	}
	function isNumber(value) {
	    return typeof value === 'number';
	}
	function isBoolean(value) {
	    return typeof value === 'boolean';
	}
	function isNull(value) {
	    return value === null;
	}
	function isBytes(value) {
	    return value instanceof Uint8Array;
	}
	function isSimpleObject(obj) {
	    return isBytes(obj) || isString(obj) || isNumber(obj) || isBoolean(obj) || isNull(obj);
	}
	class ArgTranslator {
	    constructor() {
	        this.typeIndicator = '__is_rpc_proxy__';
	        this.customTranslators = [];
	    }
	    setTypeIndecator(typeIndecator) {
	        this.typeIndicator = typeIndecator;
	    }
	    toArgObj(target, asProxyLocal) {
	        if (target == null) {
	            return null;
	        }
	        const handlePreArgObj = (obj) => {
	            obj.data[this.typeIndicator] = this.typeIndicator;
	            return obj.data;
	        };
	        if (target instanceof PreArgObj) {
	            if (target.type == 'proxy') {
	                return handlePreArgObj(target);
	            }
	            else if (target.type == 'data') {
	                return target.data;
	            }
	            else {
	                throw 'not implemented';
	            }
	        }
	        if (isSimpleObject(target)) {
	            return target;
	        }
	        // 2. 列表 (Array) - 递归处理每一项
	        if (Array.isArray(target)) {
	            return target.map(item => this.toArgObj(item, asProxyLocal));
	        }
	        // 3. 字典 - 递归处理每个属性
	        if (isDict(target)) {
	            const result = {};
	            for (const key in target) {
	                if (Object.prototype.hasOwnProperty.call(target, key)) {
	                    result[key] = this.toArgObj(target[key], asProxyLocal);
	                }
	            }
	            return result;
	        }
	        // 5. 自定义类型 - 递归处理属性
	        for (let customTranslator of this.customTranslators) {
	            if (customTranslator.match(target)) {
	                return customTranslator.translate(target);
	            }
	        }
	        // 4. 其它对象 (Date, RegExp, Map, Set, Class实例等) - 调用 asProxy
	        let preObj = asProxyLocal(target);
	        return handlePreArgObj(preObj);
	    }
	    reverseToArgObj(target, client) {
	        if (isDict(target) && (target === null || target === void 0 ? void 0 : target.hasOwnProperty(this.typeIndicator))) {
	            let data = target;
	            let result = client.createRemoteProxy(data);
	            client.getRunnableProxyManager().set(data.id, result, client);
	            return result;
	        }
	        for (let customTranslator of this.customTranslators) {
	            if (customTranslator.match(target.data)) {
	                return customTranslator.reverseTranslate(target.data);
	            }
	        }
	        // 2. 列表 (Array) - 递归处理每一项
	        if (Array.isArray(target)) {
	            return target.map(item => this.reverseToArgObj(item, client));
	        }
	        // 3. 字典 - 递归处理每个属性
	        if (isDict(target)) {
	            const result = {};
	            for (let key of Object.keys(target)) {
	                if (Object.prototype.hasOwnProperty.call(target, key)) {
	                    result[key] = this.reverseToArgObj(target[key], client);
	                }
	            }
	            return result;
	        }
	        return target;
	    }
	}
	class Client {
	    setArgsAutoWrapper(autoWrapper) {
	        this.argsAutoWrapper = autoWrapper;
	    }
	    constructor(hostId) {
	        this._useSender = () => new NotImplementSender();
	        this.argTranslator = new ArgTranslator();
	        this.argsAutoWrapper = shallowAutoWrapper;
	        this.hostId = hostId;
	    }
	    setSender(useSender) {
	        this._useSender = useSender;
	    }
	    useSender() {
	        return this._useSender();
	    }
	    getReqPending() {
	        return getOrCreateOption(this.hostId).requestPendingDict;
	    }
	    putAwait(id, resolve, reject, request) {
	        getOrCreateOption(this.hostId).requestPendingDict[id] = { resolve, reject, request, sendTime: Date.now() };
	    }
	    async waitForRequest(request) {
	        const sender = this.useSender();
	        return new Promise((resolve, reject) => {
	            if (sender == null) {
	                throw new Error('sender not set');
	            }
	            this.putAwait(request.id, resolve, reject, request);
	            let senderPromise = async () => {
	                try {
	                    await sender.send(request);
	                }
	                catch (e) {
	                    reject(e);
	                }
	            };
	            senderPromise();
	        });
	    }
	    //preargobj仍然需要保留，浙江针对于可序列化对象的远程操作，那怎么区分到地方了以后的普通对象和代理对象？所有对象前面加个符号。
	    //应当存在一种更广泛的设计考虑，而不是是在这里。走一步看一步。
	    //我觉得你像使用本地对象一样使用远程对象这个事情在一开始就不是很现实。你必须得要包装一次别人做的对象，不然就可能出现别人用的是同步对象，但是远程对象都是异步的。而且还有一个问题是如果你对对象进行了一次包装，那。如果这个对象此前没有考虑这种远程调用的情况，中间产生的无数对象都要被包装成这种代理。这个成本很高。你需要一种顺序来确保集合的范围。我觉得这也不是什么大问题啊你再做一个同步版本不就完了？那***底层Thunder的是同步的然后应该有一个地方可以选是同步还是异步。
	    toArgObj(obj) {
	        return this.argTranslator.toArgObj(obj, (obj) => asProxy(obj, this.getHostId()));
	    }
	    getHostId() {
	        if (this.hostId == null) {
	            return getOrCreateOption(null).hostId;
	        }
	        else {
	            return this.hostId;
	        }
	    }
	    getProxyManager() {
	        return getOrCreateOption(this.hostId).objectOfProxyManager;
	    }
	    getRunnableProxyManager() {
	        return getOrCreateOption(this.hostId).runnableProxyManager;
	    }
	    createRemoteProxy(data) {
	        let result = {};
	        if (data.hostId == this.hostId) {
	            return this.getProxyManager().getById(data.id);
	        }
	        let object = this.getRunnableProxyManager().get(data.id);
	        if (object != null) {
	            return object;
	        }
	        for (let member of data.members) {
	            const key = member.type;
	            if (key == 'property') {
	                console.warn('not implemented');
	            }
	            else if (key == 'function') {
	                result[member.name] = async (...args) => {
	                    let argsTransformed = args.map(x => this.argsAutoWrapper(x)).map(arg => {
	                        return this.toArgObj(arg);
	                    });
	                    let request = {
	                        objectId: data.id,
	                        meta: {},
	                        id: getId(this.hostId),
	                        method: member.name,
	                        args: argsTransformed
	                    };
	                    let res;
	                    res = await this.waitForRequest(request);
	                    return res;
	                };
	            }
	            else {
	                throw new Error('no such function');
	            }
	        }
	        //一段补丁，对于函数，hack掉原来的对象，直接上函数
	        if (result['__call__']) {
	            const func = async (...args) => {
	                return await result['__call__'](...args);
	            };
	            Object.assign(func, result);
	            result = func;
	        }
	        return result;
	    } //支持byte和支持date是两码事 byte是底层的，date是转换的,你要是用字符来表示byte那太恶心了 非要用拿sender里弄去
	    transformArg(argObj, clazz) {
	        if (argObj.type == 'data') {
	            return argObj.data;
	        }
	        let data = argObj.data;
	        let result = this.createRemoteProxy(data);
	        this.getRunnableProxyManager().set(data.id, result, this);
	        return result;
	    }
	    reverseToArgObj(argObj) {
	        return this.argTranslator.reverseToArgObj(argObj, this);
	    }
	    async getObject(objectId) {
	        let request = {
	            meta: {},
	            id: getId(this.hostId),
	            objectId: 'main0',
	            method: 'getMain',
	            args: [this.toArgObj(objectId)]
	        };
	        let res = await this.waitForRequest(request);
	        return res;
	    }
	    async getMain() {
	        return await this.getObject('main');
	    }
	}
	const shallowAutoWrapper = (obj) => {
	    return obj;
	};
	let options = {};
	let defaultHost = Symbol('defaultHost');
	function getOrCreateOption(id) {
	    if (id == null) {
	        id = defaultHost;
	    }
	    if (id === hostId) {
	        id = defaultHost;
	    }
	    if (typeof id == 'string' || id === defaultHost) ;
	    else {
	        throw '你他妈传什么呢';
	    }
	    if (!options[id]) {
	        options[id] = {
	            objectOfProxyManager: new ObjectOfProxyManager(),
	            runnableProxyManager: new RemoteProxyManager(),
	            hostId: (id === defaultHost ? null : id),
	            requestPendingDict: {}
	        };
	    }
	    return options[id];
	}
	class MessageReceiver {
	    setResultAutoWrapper(autoWrapper) {
	        this.resultAutoWrapper = autoWrapper;
	    }
	    async withContext(message, client, args, func) {
	        let constThis = this;
	        let result = {};
	        const context = {
	            setContext: (_result) => {
	                result.value = _result;
	            }
	        };
	        function generateInteceptorExecutor(indexOfInteceptor) {
	            if (indexOfInteceptor < constThis.interceptors.length) {
	                async function executeThisInteceptor() {
	                    let interceptor = await constThis.interceptors[indexOfInteceptor];
	                    const generateAndExecuteNext = async () => {
	                        const executor = generateInteceptorExecutor(indexOfInteceptor + 1);
	                        await executor();
	                    };
	                    await interceptor(context, message, client, () => generateAndExecuteNext());
	                }
	                return executeThisInteceptor;
	            }
	            else {
	                const executeThisInteceptor = async () => {
	                    result.value = await func(context, ...args);
	                };
	                return executeThisInteceptor;
	            }
	        }
	        let firstInteceptorExecetor = generateInteceptorExecutor(0);
	        await firstInteceptorExecetor();
	        return result.value;
	    }
	    getProxyManager() {
	        return getOrCreateOption(this.hostId).objectOfProxyManager;
	    }
	    getRunnableProxyManager() {
	        return getOrCreateOption(this.hostId).runnableProxyManager;
	    }
	    getHostId() {
	        return getOrCreateOption(this.hostId).hostId;
	    }
	    getReqPending() {
	        return getOrCreateOption(this.hostId).requestPendingDict;
	    }
	    constructor(hostId) {
	        this.interceptors = [];
	        this.objectWithContext = new Set();
	        this.resultAutoWrapper = shallowAutoWrapper;
	        this.hostId = hostId;
	        this.objectWithContext = new Set();
	        let hostIdToSend = this.getHostId();
	        this.getProxyManager().set({
	            'getMain': (objectId) => {
	                if (objectId == null) {
	                    objectId = 'main';
	                }
	                return asProxy(this.getProxyManager().getById(objectId), hostIdToSend);
	            },
	            'reRegister': (list) => {
	                for (let item of list) {
	                    const objectId = item[0];
	                    this.getProxyManager().reRegister(objectId);
	                }
	            }
	        }, 'main0');
	    }
	    setMain(obj) {
	        this.rpcServer = obj;
	        this.setObject('main', this.rpcServer, false);
	    }
	    setObject(id, obj, withContext) {
	        this.getProxyManager().set(obj, id);
	        if (withContext) {
	            this.objectWithContext.add(id);
	        }
	    }
	    addInterceptor(interceptor) {
	        this.interceptors.push(interceptor);
	    }
	    putAwait(id, resolve, reject, request) {
	        this.getReqPending()[id] = { resolve, reject, request, sendTime: Date.now() };
	    }
	    currentWaitingCount() {
	        return Object.keys(this.getReqPending()).length;
	    }
	    async onReceiveMessage(messageRecv, clientForCallBack) {
	        var _a;
	        if (clientForCallBack == null) {
	            throw new Error("clientForCallBack must not null");
	        }
	        if ((clientForCallBack instanceof Client) == false) {
	            throw new Error("clientForCallBack must be a Client");
	        }
	        //is request, not reply
	        if (!isResponse(messageRecv)) {
	            const message = messageRecv;
	            try {
	                let object = this.getProxyManager().getById(message.objectId);
	                if (object == null) {
	                    clientForCallBack.useSender().send(generateErrorReply(message, 'object not found', 100, this.getHostId()));
	                    return;
	                }
	                let args = message.args.map(x => clientForCallBack.reverseToArgObj(x));
	                let result = null;
	                const shouldWithContext = this.objectWithContext.has(message.objectId);
	                if (message.method == '__call__') {
	                    if (shouldWithContext) {
	                        result = await this.withContext(message, clientForCallBack, args, object);
	                    }
	                    else {
	                        result = object(...args);
	                    }
	                }
	                else {
	                    if (shouldWithContext) {
	                        result = await this.withContext(message, clientForCallBack, args, object[message.method]);
	                    }
	                    else {
	                        result = object[message.method](...args);
	                    }
	                }
	                result = this.resultAutoWrapper(result);
	                result = await result;
	                let wrappedResult = clientForCallBack.toArgObj(result);
	                if (debugFlag) ;
	                clientForCallBack.useSender().send({
	                    id: getId(this.getHostId()),
	                    objectId: '',
	                    method: '',
	                    args: [],
	                    meta: {},
	                    idFor: message.id,
	                    data: wrappedResult,
	                    status: 200
	                });
	            }
	            catch (e) {
	                let exception = e;
	                let trace = exception.stack;
	                let traceStr = trace === null || trace === void 0 ? void 0 : trace.split('\n').map(x => x.trim()).join('\n');
	                (_a = clientForCallBack.useSender()) === null || _a === void 0 ? void 0 : _a.send({
	                    id: getId(this.getHostId()),
	                    objectId: '',
	                    method: '',
	                    args: [],
	                    meta: {},
	                    idFor: message.id,
	                    data: { type: 'data', data: null },
	                    trace: traceStr,
	                    status: -1
	                });
	                console.error(e);
	            }
	        }
	        else {
	            let id_for = messageRecv.idFor;
	            const message = messageRecv;
	            const reqPending = this.getReqPending();
	            if (reqPending[id_for] == undefined) {
	                console.warn(`[${this.getHostId()}] no pending request for id ${id_for}`, message);
	                return;
	            }
	            let req = reqPending[id_for];
	            delete reqPending[id_for];
	            if (message.status == 200) {
	                req.resolve(clientForCallBack.reverseToArgObj(message.data));
	            }
	            else {
	                req.reject(message);
	            }
	        }
	    }
	}
	function isResponse(message) {
	    return message.idFor != undefined;
	}
	let idCOunt = 0;
	function getId(hostIdParam) {
	    const hid = hostIdParam !== undefined ? hostIdParam : hostId;
	    return hid + '' + (idCOunt++);
	}
	function isSerializableDeep(obj, seen = new WeakSet()) {
	    // 处理 null (typeof null 是 "object", 需要单独处理)
	    if (obj === null) {
	        return true;
	    }
	    const type = typeof obj;
	    // 基本类型检查
	    if (type === "string" || type === "number" || type === "boolean" || type === "undefined") {
	        // undefined 在对象属性中会被忽略，但作为根值时 stringify 会返回 undefined
	        return true;
	    }
	    if (obj instanceof ArrayBuffer || obj instanceof Date || obj instanceof BigInt) {
	        {
	            return true;
	        }
	    }
	    if (type === "symbol") {
	        return false; // Symbol 无法被 JSON 序列化
	    }
	    if (type === "function") {
	        return false; // 函数无法被 JSON 序列化
	    }
	    // 如果是对象或数组
	    if (type === "object") {
	        if (Object.getPrototypeOf(obj) !== Object.prototype) {
	            return false;
	        }
	        // 检查循环引用
	        if (seen.has(obj)) {
	            return false;
	        }
	        seen.add(obj);
	        // 检查数组
	        if (Array.isArray(obj)) {
	            for (let item of obj) {
	                if (!isSerializableDeep(item, seen)) {
	                    return false;
	                }
	            }
	            return true;
	        }
	        // 检查普通对象
	        for (let key in obj) {
	            if (Object.prototype.hasOwnProperty.call(obj, key)) {
	                // 检查键名 (JSON 键名必须是字符串)
	                // (虽然 JavaScript 对象键名会自动转为字符串，但 Symbol 键需要排除)
	                if (typeof key === "symbol") {
	                    return false;
	                }
	                // 检查属性值
	                if (!isSerializableDeep(obj[key], seen)) {
	                    return false;
	                }
	            }
	        }
	        return true;
	    }
	    // 其他类型 (如 "object" 但不是 null、数组或普通对象，例如 Date)
	    // 注意：Date 对象会被转换为字符串，所以是可序列化的
	    return true;
	}

	/*! *****************************************************************************
	Copyright (c) Microsoft Corporation. All rights reserved.
	Licensed under the Apache License, Version 2.0 (the "License"); you may not use
	this file except in compliance with the License. You may obtain a copy of the
	License at http://www.apache.org/licenses/LICENSE-2.0

	THIS CODE IS PROVIDED ON AN *AS IS* BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
	KIND, EITHER EXPRESS OR IMPLIED, INCLUDING WITHOUT LIMITATION ANY IMPLIED
	WARRANTIES OR CONDITIONS OF TITLE, FITNESS FOR A PARTICULAR PURPOSE,
	MERCHANTABLITY OR NON-INFRINGEMENT.

	See the Apache Version 2.0 License for specific language governing permissions
	and limitations under the License.
	***************************************************************************** */
	/* global Reflect, Promise */

	var extendStatics = function(d, b) {
	    extendStatics = Object.setPrototypeOf ||
	        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
	        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
	    return extendStatics(d, b);
	};

	function __extends(d, b) {
	    extendStatics(d, b);
	    function __() { this.constructor = d; }
	    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
	}

	function __values(o) {
	    var m = typeof Symbol === "function" && o[Symbol.iterator], i = 0;
	    if (m) return m.call(o);
	    return {
	        next: function () {
	            if (o && i >= o.length) o = void 0;
	            return { value: o && o[i++], done: !o };
	        }
	    };
	}

	function __read(o, n) {
	    var m = typeof Symbol === "function" && o[Symbol.iterator];
	    if (!m) return o;
	    var i = m.call(o), r, ar = [], e;
	    try {
	        while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
	    }
	    catch (error) { e = { error: error }; }
	    finally {
	        try {
	            if (r && !r.done && (m = i["return"])) m.call(i);
	        }
	        finally { if (e) throw e.error; }
	    }
	    return ar;
	}

	function __spread() {
	    for (var ar = [], i = 0; i < arguments.length; i++)
	        ar = ar.concat(__read(arguments[i]));
	    return ar;
	}

	var Event = /** @class */ (function () {
	    function Event(type, target) {
	        this.target = target;
	        this.type = type;
	    }
	    return Event;
	}());
	var ErrorEvent = /** @class */ (function (_super) {
	    __extends(ErrorEvent, _super);
	    function ErrorEvent(error, target) {
	        var _this = _super.call(this, 'error', target) || this;
	        _this.message = error.message;
	        _this.error = error;
	        return _this;
	    }
	    return ErrorEvent;
	}(Event));
	var CloseEvent = /** @class */ (function (_super) {
	    __extends(CloseEvent, _super);
	    function CloseEvent(code, reason, target) {
	        if (code === void 0) { code = 1000; }
	        if (reason === void 0) { reason = ''; }
	        var _this = _super.call(this, 'close', target) || this;
	        _this.wasClean = true;
	        _this.code = code;
	        _this.reason = reason;
	        return _this;
	    }
	    return CloseEvent;
	}(Event));

	/*!
	 * Reconnecting WebSocket
	 * by Pedro Ladaria <pedro.ladaria@gmail.com>
	 * https://github.com/pladaria/reconnecting-websocket
	 * License MIT
	 */
	var getGlobalWebSocket = function () {
	    if (typeof WebSocket !== 'undefined') {
	        // @ts-ignore
	        return WebSocket;
	    }
	};
	/**
	 * Returns true if given argument looks like a WebSocket class
	 */
	var isWebSocket = function (w) { return typeof w !== 'undefined' && !!w && w.CLOSING === 2; };
	var DEFAULT = {
	    maxReconnectionDelay: 10000,
	    minReconnectionDelay: 1000 + Math.random() * 4000,
	    minUptime: 5000,
	    reconnectionDelayGrowFactor: 1.3,
	    connectionTimeout: 4000,
	    maxRetries: Infinity,
	    maxEnqueuedMessages: Infinity};
	var ReconnectingWebSocket = /** @class */ (function () {
	    function ReconnectingWebSocket(url, protocols, options) {
	        var _this = this;
	        if (options === void 0) { options = {}; }
	        this._listeners = {
	            error: [],
	            message: [],
	            open: [],
	            close: [],
	        };
	        this._retryCount = -1;
	        this._shouldReconnect = true;
	        this._connectLock = false;
	        this._binaryType = 'blob';
	        this._closeCalled = false;
	        this._messageQueue = [];
	        /**
	         * An event listener to be called when the WebSocket connection's readyState changes to CLOSED
	         */
	        this.onclose = null;
	        /**
	         * An event listener to be called when an error occurs
	         */
	        this.onerror = null;
	        /**
	         * An event listener to be called when a message is received from the server
	         */
	        this.onmessage = null;
	        /**
	         * An event listener to be called when the WebSocket connection's readyState changes to OPEN;
	         * this indicates that the connection is ready to send and receive data
	         */
	        this.onopen = null;
	        this._handleOpen = function (event) {
	            _this._debug('open event');
	            var _a = _this._options.minUptime, minUptime = _a === void 0 ? DEFAULT.minUptime : _a;
	            clearTimeout(_this._connectTimeout);
	            _this._uptimeTimeout = setTimeout(function () { return _this._acceptOpen(); }, minUptime);
	            _this._ws.binaryType = _this._binaryType;
	            // send enqueued messages (messages sent before websocket open event)
	            _this._messageQueue.forEach(function (message) { return _this._ws.send(message); });
	            _this._messageQueue = [];
	            if (_this.onopen) {
	                _this.onopen(event);
	            }
	            _this._listeners.open.forEach(function (listener) { return _this._callEventListener(event, listener); });
	        };
	        this._handleMessage = function (event) {
	            _this._debug('message event');
	            if (_this.onmessage) {
	                _this.onmessage(event);
	            }
	            _this._listeners.message.forEach(function (listener) { return _this._callEventListener(event, listener); });
	        };
	        this._handleError = function (event) {
	            _this._debug('error event', event.message);
	            _this._disconnect(undefined, event.message === 'TIMEOUT' ? 'timeout' : undefined);
	            if (_this.onerror) {
	                _this.onerror(event);
	            }
	            _this._debug('exec error listeners');
	            _this._listeners.error.forEach(function (listener) { return _this._callEventListener(event, listener); });
	            _this._connect();
	        };
	        this._handleClose = function (event) {
	            _this._debug('close event');
	            _this._clearTimeouts();
	            if (_this._shouldReconnect) {
	                _this._connect();
	            }
	            if (_this.onclose) {
	                _this.onclose(event);
	            }
	            _this._listeners.close.forEach(function (listener) { return _this._callEventListener(event, listener); });
	        };
	        this._url = url;
	        this._protocols = protocols;
	        this._options = options;
	        if (this._options.startClosed) {
	            this._shouldReconnect = false;
	        }
	        this._connect();
	    }
	    Object.defineProperty(ReconnectingWebSocket, "CONNECTING", {
	        get: function () {
	            return 0;
	        },
	        enumerable: true,
	        configurable: true
	    });
	    Object.defineProperty(ReconnectingWebSocket, "OPEN", {
	        get: function () {
	            return 1;
	        },
	        enumerable: true,
	        configurable: true
	    });
	    Object.defineProperty(ReconnectingWebSocket, "CLOSING", {
	        get: function () {
	            return 2;
	        },
	        enumerable: true,
	        configurable: true
	    });
	    Object.defineProperty(ReconnectingWebSocket, "CLOSED", {
	        get: function () {
	            return 3;
	        },
	        enumerable: true,
	        configurable: true
	    });
	    Object.defineProperty(ReconnectingWebSocket.prototype, "CONNECTING", {
	        get: function () {
	            return ReconnectingWebSocket.CONNECTING;
	        },
	        enumerable: true,
	        configurable: true
	    });
	    Object.defineProperty(ReconnectingWebSocket.prototype, "OPEN", {
	        get: function () {
	            return ReconnectingWebSocket.OPEN;
	        },
	        enumerable: true,
	        configurable: true
	    });
	    Object.defineProperty(ReconnectingWebSocket.prototype, "CLOSING", {
	        get: function () {
	            return ReconnectingWebSocket.CLOSING;
	        },
	        enumerable: true,
	        configurable: true
	    });
	    Object.defineProperty(ReconnectingWebSocket.prototype, "CLOSED", {
	        get: function () {
	            return ReconnectingWebSocket.CLOSED;
	        },
	        enumerable: true,
	        configurable: true
	    });
	    Object.defineProperty(ReconnectingWebSocket.prototype, "binaryType", {
	        get: function () {
	            return this._ws ? this._ws.binaryType : this._binaryType;
	        },
	        set: function (value) {
	            this._binaryType = value;
	            if (this._ws) {
	                this._ws.binaryType = value;
	            }
	        },
	        enumerable: true,
	        configurable: true
	    });
	    Object.defineProperty(ReconnectingWebSocket.prototype, "retryCount", {
	        /**
	         * Returns the number or connection retries
	         */
	        get: function () {
	            return Math.max(this._retryCount, 0);
	        },
	        enumerable: true,
	        configurable: true
	    });
	    Object.defineProperty(ReconnectingWebSocket.prototype, "bufferedAmount", {
	        /**
	         * The number of bytes of data that have been queued using calls to send() but not yet
	         * transmitted to the network. This value resets to zero once all queued data has been sent.
	         * This value does not reset to zero when the connection is closed; if you keep calling send(),
	         * this will continue to climb. Read only
	         */
	        get: function () {
	            var bytes = this._messageQueue.reduce(function (acc, message) {
	                if (typeof message === 'string') {
	                    acc += message.length; // not byte size
	                }
	                else if (message instanceof Blob) {
	                    acc += message.size;
	                }
	                else {
	                    acc += message.byteLength;
	                }
	                return acc;
	            }, 0);
	            return bytes + (this._ws ? this._ws.bufferedAmount : 0);
	        },
	        enumerable: true,
	        configurable: true
	    });
	    Object.defineProperty(ReconnectingWebSocket.prototype, "extensions", {
	        /**
	         * The extensions selected by the server. This is currently only the empty string or a list of
	         * extensions as negotiated by the connection
	         */
	        get: function () {
	            return this._ws ? this._ws.extensions : '';
	        },
	        enumerable: true,
	        configurable: true
	    });
	    Object.defineProperty(ReconnectingWebSocket.prototype, "protocol", {
	        /**
	         * A string indicating the name of the sub-protocol the server selected;
	         * this will be one of the strings specified in the protocols parameter when creating the
	         * WebSocket object
	         */
	        get: function () {
	            return this._ws ? this._ws.protocol : '';
	        },
	        enumerable: true,
	        configurable: true
	    });
	    Object.defineProperty(ReconnectingWebSocket.prototype, "readyState", {
	        /**
	         * The current state of the connection; this is one of the Ready state constants
	         */
	        get: function () {
	            if (this._ws) {
	                return this._ws.readyState;
	            }
	            return this._options.startClosed
	                ? ReconnectingWebSocket.CLOSED
	                : ReconnectingWebSocket.CONNECTING;
	        },
	        enumerable: true,
	        configurable: true
	    });
	    Object.defineProperty(ReconnectingWebSocket.prototype, "url", {
	        /**
	         * The URL as resolved by the constructor
	         */
	        get: function () {
	            return this._ws ? this._ws.url : '';
	        },
	        enumerable: true,
	        configurable: true
	    });
	    /**
	     * Closes the WebSocket connection or connection attempt, if any. If the connection is already
	     * CLOSED, this method does nothing
	     */
	    ReconnectingWebSocket.prototype.close = function (code, reason) {
	        if (code === void 0) { code = 1000; }
	        this._closeCalled = true;
	        this._shouldReconnect = false;
	        this._clearTimeouts();
	        if (!this._ws) {
	            this._debug('close enqueued: no ws instance');
	            return;
	        }
	        if (this._ws.readyState === this.CLOSED) {
	            this._debug('close: already closed');
	            return;
	        }
	        this._ws.close(code, reason);
	    };
	    /**
	     * Closes the WebSocket connection or connection attempt and connects again.
	     * Resets retry counter;
	     */
	    ReconnectingWebSocket.prototype.reconnect = function (code, reason) {
	        this._shouldReconnect = true;
	        this._closeCalled = false;
	        this._retryCount = -1;
	        if (!this._ws || this._ws.readyState === this.CLOSED) {
	            this._connect();
	        }
	        else {
	            this._disconnect(code, reason);
	            this._connect();
	        }
	    };
	    /**
	     * Enqueue specified data to be transmitted to the server over the WebSocket connection
	     */
	    ReconnectingWebSocket.prototype.send = function (data) {
	        if (this._ws && this._ws.readyState === this.OPEN) {
	            this._debug('send', data);
	            this._ws.send(data);
	        }
	        else {
	            var _a = this._options.maxEnqueuedMessages, maxEnqueuedMessages = _a === void 0 ? DEFAULT.maxEnqueuedMessages : _a;
	            if (this._messageQueue.length < maxEnqueuedMessages) {
	                this._debug('enqueue', data);
	                this._messageQueue.push(data);
	            }
	        }
	    };
	    /**
	     * Register an event handler of a specific event type
	     */
	    ReconnectingWebSocket.prototype.addEventListener = function (type, listener) {
	        if (this._listeners[type]) {
	            // @ts-ignore
	            this._listeners[type].push(listener);
	        }
	    };
	    ReconnectingWebSocket.prototype.dispatchEvent = function (event) {
	        var e_1, _a;
	        var listeners = this._listeners[event.type];
	        if (listeners) {
	            try {
	                for (var listeners_1 = __values(listeners), listeners_1_1 = listeners_1.next(); !listeners_1_1.done; listeners_1_1 = listeners_1.next()) {
	                    var listener = listeners_1_1.value;
	                    this._callEventListener(event, listener);
	                }
	            }
	            catch (e_1_1) { e_1 = { error: e_1_1 }; }
	            finally {
	                try {
	                    if (listeners_1_1 && !listeners_1_1.done && (_a = listeners_1.return)) _a.call(listeners_1);
	                }
	                finally { if (e_1) throw e_1.error; }
	            }
	        }
	        return true;
	    };
	    /**
	     * Removes an event listener
	     */
	    ReconnectingWebSocket.prototype.removeEventListener = function (type, listener) {
	        if (this._listeners[type]) {
	            // @ts-ignore
	            this._listeners[type] = this._listeners[type].filter(function (l) { return l !== listener; });
	        }
	    };
	    ReconnectingWebSocket.prototype._debug = function () {
	        var args = [];
	        for (var _i = 0; _i < arguments.length; _i++) {
	            args[_i] = arguments[_i];
	        }
	        if (this._options.debug) {
	            // not using spread because compiled version uses Symbols
	            // tslint:disable-next-line
	            console.log.apply(console, __spread(['RWS>'], args));
	        }
	    };
	    ReconnectingWebSocket.prototype._getNextDelay = function () {
	        var _a = this._options, _b = _a.reconnectionDelayGrowFactor, reconnectionDelayGrowFactor = _b === void 0 ? DEFAULT.reconnectionDelayGrowFactor : _b, _c = _a.minReconnectionDelay, minReconnectionDelay = _c === void 0 ? DEFAULT.minReconnectionDelay : _c, _d = _a.maxReconnectionDelay, maxReconnectionDelay = _d === void 0 ? DEFAULT.maxReconnectionDelay : _d;
	        var delay = 0;
	        if (this._retryCount > 0) {
	            delay =
	                minReconnectionDelay * Math.pow(reconnectionDelayGrowFactor, this._retryCount - 1);
	            if (delay > maxReconnectionDelay) {
	                delay = maxReconnectionDelay;
	            }
	        }
	        this._debug('next delay', delay);
	        return delay;
	    };
	    ReconnectingWebSocket.prototype._wait = function () {
	        var _this = this;
	        return new Promise(function (resolve) {
	            setTimeout(resolve, _this._getNextDelay());
	        });
	    };
	    ReconnectingWebSocket.prototype._getNextUrl = function (urlProvider) {
	        if (typeof urlProvider === 'string') {
	            return Promise.resolve(urlProvider);
	        }
	        if (typeof urlProvider === 'function') {
	            var url = urlProvider();
	            if (typeof url === 'string') {
	                return Promise.resolve(url);
	            }
	            if (!!url.then) {
	                return url;
	            }
	        }
	        throw Error('Invalid URL');
	    };
	    ReconnectingWebSocket.prototype._connect = function () {
	        var _this = this;
	        if (this._connectLock || !this._shouldReconnect) {
	            return;
	        }
	        this._connectLock = true;
	        var _a = this._options, _b = _a.maxRetries, maxRetries = _b === void 0 ? DEFAULT.maxRetries : _b, _c = _a.connectionTimeout, connectionTimeout = _c === void 0 ? DEFAULT.connectionTimeout : _c, _d = _a.WebSocket, WebSocket = _d === void 0 ? getGlobalWebSocket() : _d;
	        if (this._retryCount >= maxRetries) {
	            this._debug('max retries reached', this._retryCount, '>=', maxRetries);
	            return;
	        }
	        this._retryCount++;
	        this._debug('connect', this._retryCount);
	        this._removeListeners();
	        if (!isWebSocket(WebSocket)) {
	            throw Error('No valid WebSocket class provided');
	        }
	        this._wait()
	            .then(function () { return _this._getNextUrl(_this._url); })
	            .then(function (url) {
	            // close could be called before creating the ws
	            if (_this._closeCalled) {
	                return;
	            }
	            _this._debug('connect', { url: url, protocols: _this._protocols });
	            _this._ws = _this._protocols
	                ? new WebSocket(url, _this._protocols)
	                : new WebSocket(url);
	            _this._ws.binaryType = _this._binaryType;
	            _this._connectLock = false;
	            _this._addListeners();
	            _this._connectTimeout = setTimeout(function () { return _this._handleTimeout(); }, connectionTimeout);
	        });
	    };
	    ReconnectingWebSocket.prototype._handleTimeout = function () {
	        this._debug('timeout event');
	        this._handleError(new ErrorEvent(Error('TIMEOUT'), this));
	    };
	    ReconnectingWebSocket.prototype._disconnect = function (code, reason) {
	        if (code === void 0) { code = 1000; }
	        this._clearTimeouts();
	        if (!this._ws) {
	            return;
	        }
	        this._removeListeners();
	        try {
	            this._ws.close(code, reason);
	            this._handleClose(new CloseEvent(code, reason, this));
	        }
	        catch (error) {
	            // ignore
	        }
	    };
	    ReconnectingWebSocket.prototype._acceptOpen = function () {
	        this._debug('accept open');
	        this._retryCount = 0;
	    };
	    ReconnectingWebSocket.prototype._callEventListener = function (event, listener) {
	        if ('handleEvent' in listener) {
	            // @ts-ignore
	            listener.handleEvent(event);
	        }
	        else {
	            // @ts-ignore
	            listener(event);
	        }
	    };
	    ReconnectingWebSocket.prototype._removeListeners = function () {
	        if (!this._ws) {
	            return;
	        }
	        this._debug('removeListeners');
	        this._ws.removeEventListener('open', this._handleOpen);
	        this._ws.removeEventListener('close', this._handleClose);
	        this._ws.removeEventListener('message', this._handleMessage);
	        // @ts-ignore
	        this._ws.removeEventListener('error', this._handleError);
	    };
	    ReconnectingWebSocket.prototype._addListeners = function () {
	        if (!this._ws) {
	            return;
	        }
	        this._debug('addListeners');
	        this._ws.addEventListener('open', this._handleOpen);
	        this._ws.addEventListener('close', this._handleClose);
	        this._ws.addEventListener('message', this._handleMessage);
	        // @ts-ignore
	        this._ws.addEventListener('error', this._handleError);
	    };
	    ReconnectingWebSocket.prototype._clearTimeouts = function () {
	        clearTimeout(this._connectTimeout);
	        clearTimeout(this._uptimeTimeout);
	    };
	    return ReconnectingWebSocket;
	}());

	let decoder;
	try {
		decoder = new TextDecoder();
	} catch(error) {}
	let src;
	let srcEnd;
	let position$1 = 0;
	const LEGACY_RECORD_INLINE_ID = 105;
	const RECORD_DEFINITIONS_ID = 0xdffe;
	const RECORD_INLINE_ID = 0xdfff; // temporary first-come first-serve tag // proposed tag: 0x7265 // 're'
	const BUNDLED_STRINGS_ID = 0xdff9;
	const PACKED_REFERENCE_TAG_ID = 6;
	const STOP_CODE = {};
	let maxArraySize = 112810000; // This is the maximum array size in V8. We would potentially detect and set it higher
	// for JSC, but this is pretty large and should be sufficient for most use cases
	let maxMapSize = 16810000; // JavaScript has a fixed maximum map size of about 16710000, but JS itself enforces this,
	let currentDecoder = {};
	let currentStructures;
	let srcString;
	let srcStringStart = 0;
	let srcStringEnd = 0;
	let bundledStrings$1;
	let referenceMap;
	let currentExtensions = [];
	let currentExtensionRanges = [];
	let packedValues;
	let dataView;
	let restoreMapsAsObject;
	let defaultOptions = {
		useRecords: false,
		mapsAsObjects: true
	};
	let sequentialMode = false;
	let inlineObjectReadThreshold = 2;
	// no-eval build
	try {
		new Function('');
	} catch(error) {
		// if eval variants are not supported, do not create inline object readers ever
		inlineObjectReadThreshold = Infinity;
	}



	class Decoder {
		constructor(options) {
			if (options) {
				if ((options.keyMap || options._keyMap) && !options.useRecords) {
					options.useRecords = false;
					options.mapsAsObjects = true;
				}
				if (options.useRecords === false && options.mapsAsObjects === undefined)
					options.mapsAsObjects = true;
				if (options.getStructures)
					options.getShared = options.getStructures;
				if (options.getShared && !options.structures)
					(options.structures = []).uninitialized = true; // this is what we use to denote an uninitialized structures
				if (options.keyMap) {
					this.mapKey = new Map();
					for (let [k,v] of Object.entries(options.keyMap)) this.mapKey.set(v,k);
				}
			}
			Object.assign(this, options);
		}
		/*
		decodeKey(key) {
			return this.keyMap
				? Object.keys(this.keyMap)[Object.values(this.keyMap).indexOf(key)] || key
				: key
		}
		*/
		decodeKey(key) {
			return this.keyMap ? this.mapKey.get(key) || key : key
		}
		
		encodeKey(key) {
			return this.keyMap && this.keyMap.hasOwnProperty(key) ? this.keyMap[key] : key
		}

		encodeKeys(rec) {
			if (!this._keyMap) return rec
			let map = new Map();
			for (let [k,v] of Object.entries(rec)) map.set((this._keyMap.hasOwnProperty(k) ? this._keyMap[k] : k), v);
			return map
		}

		decodeKeys(map) {
			if (!this._keyMap || map.constructor.name != 'Map') return map
			if (!this._mapKey) {
				this._mapKey = new Map();
				for (let [k,v] of Object.entries(this._keyMap)) this._mapKey.set(v,k);
			}
			let res = {};
			//map.forEach((v,k) => res[Object.keys(this._keyMap)[Object.values(this._keyMap).indexOf(k)] || k] = v)
			map.forEach((v,k) => res[safeKey(this._mapKey.has(k) ? this._mapKey.get(k) : k)] =  v);
			return res
		}
		
		mapDecode(source, end) {
		
			let res = this.decode(source);
			if (this._keyMap) { 
				//Experiemntal support for Optimised KeyMap  decoding 
				switch (res.constructor.name) {
					case 'Array': return res.map(r => this.decodeKeys(r))
					//case 'Map': return this.decodeKeys(res)
				}
			}
			return res
		}

		decode(source, end) {
			if (src) {
				// re-entrant execution, save the state and restore it after we do this decode
				return saveState(() => {
					clearSource();
					return this ? this.decode(source, end) : Decoder.prototype.decode.call(defaultOptions, source, end)
				})
			}
			srcEnd = end > -1 ? end : source.length;
			position$1 = 0;
			srcStringEnd = 0;
			srcString = null;
			bundledStrings$1 = null;
			src = source;
			// this provides cached access to the data view for a buffer if it is getting reused, which is a recommend
			// technique for getting data from a database where it can be copied into an existing buffer instead of creating
			// new ones
			try {
				dataView = source.dataView || (source.dataView = new DataView(source.buffer, source.byteOffset, source.byteLength));
			} catch(error) {
				// if it doesn't have a buffer, maybe it is the wrong type of object
				src = null;
				if (source instanceof Uint8Array)
					throw error
				throw new Error('Source must be a Uint8Array or Buffer but was a ' + ((source && typeof source == 'object') ? source.constructor.name : typeof source))
			}
			if (this instanceof Decoder) {
				currentDecoder = this;
				packedValues = this.sharedValues &&
					(this.pack ? new Array(this.maxPrivatePackedValues || 16).concat(this.sharedValues) :
					this.sharedValues);
				if (this.structures) {
					currentStructures = this.structures;
					return checkedRead()
				} else if (!currentStructures || currentStructures.length > 0) {
					currentStructures = [];
				}
			} else {
				currentDecoder = defaultOptions;
				if (!currentStructures || currentStructures.length > 0)
					currentStructures = [];
				packedValues = null;
			}
			return checkedRead()
		}
		decodeMultiple(source, forEach) {
			let values, lastPosition = 0;
			try {
				let size = source.length;
				sequentialMode = true;
				let value = this ? this.decode(source, size) : defaultDecoder.decode(source, size);
				if (forEach) {
					if (forEach(value) === false) {
						return
					}
					while(position$1 < size) {
						lastPosition = position$1;
						if (forEach(checkedRead()) === false) {
							return
						}
					}
				}
				else {
					values = [ value ];
					while(position$1 < size) {
						lastPosition = position$1;
						values.push(checkedRead());
					}
					return values
				}
			} catch(error) {
				error.lastPosition = lastPosition;
				error.values = values;
				throw error
			} finally {
				sequentialMode = false;
				clearSource();
			}
		}
	}
	function checkedRead() {
		try {
			let result = read();
			if (bundledStrings$1) {
				if (position$1 >= bundledStrings$1.postBundlePosition) {
					let error = new Error('Unexpected bundle position');
					error.incomplete = true;
					throw error
				}
				// bundled strings to skip past
				position$1 = bundledStrings$1.postBundlePosition;
				bundledStrings$1 = null;
			}

			if (position$1 == srcEnd) {
				// finished reading this source, cleanup references
				currentStructures = null;
				src = null;
				if (referenceMap)
					referenceMap = null;
			} else if (position$1 > srcEnd) {
				// over read
				let error = new Error('Unexpected end of CBOR data');
				error.incomplete = true;
				throw error
			} else if (!sequentialMode) {
				throw new Error('Data read, but end of buffer not reached')
			}
			// else more to read, but we are reading sequentially, so don't clear source yet
			return result
		} catch(error) {
			clearSource();
			if (error instanceof RangeError || error.message.startsWith('Unexpected end of buffer')) {
				error.incomplete = true;
			}
			throw error
		}
	}

	function read() {
		let token = src[position$1++];
		let majorType = token >> 5;
		token = token & 0x1f;
		if (token > 0x17) {
			switch (token) {
				case 0x18:
					token = src[position$1++];
					break
				case 0x19:
					if (majorType == 7) {
						return getFloat16()
					}
					token = dataView.getUint16(position$1);
					position$1 += 2;
					break
				case 0x1a:
					if (majorType == 7) {
						let value = dataView.getFloat32(position$1);
						if (currentDecoder.useFloat32 > 2) {
							// this does rounding of numbers that were encoded in 32-bit float to nearest significant decimal digit that could be preserved
							let multiplier = mult10[((src[position$1] & 0x7f) << 1) | (src[position$1 + 1] >> 7)];
							position$1 += 4;
							return ((multiplier * value + (value > 0 ? 0.5 : -0.5)) >> 0) / multiplier
						}
						position$1 += 4;
						return value
					}
					token = dataView.getUint32(position$1);
					position$1 += 4;
					if (majorType === 1) return -1 - token; // can't safely use negation operator here
					break
				case 0x1b:
					if (majorType == 7) {
						let value = dataView.getFloat64(position$1);
						position$1 += 8;
						return value
					}
					if (majorType > 1) {
						if (dataView.getUint32(position$1) > 0)
							throw new Error('JavaScript does not support arrays, maps, or strings with length over 4294967295')
						token = dataView.getUint32(position$1 + 4);
					} else if (currentDecoder.int64AsNumber) {
						token = dataView.getUint32(position$1) * 0x100000000;
						token += dataView.getUint32(position$1 + 4);
					} else token = dataView.getBigUint64(position$1);
					position$1 += 8;
					break
				case 0x1f: 
					// indefinite length
					switch(majorType) {
						case 2: // byte string
						case 3: // text string
							throw new Error('Indefinite length not supported for byte or text strings')
						case 4: // array
							let array = [];
							let value, i = 0;
							while ((value = read()) != STOP_CODE) {
								if (i >= maxArraySize) throw new Error(`Array length exceeds ${maxArraySize}`)
								array[i++] = value;
							}
							return majorType == 4 ? array : majorType == 3 ? array.join('') : Buffer.concat(array)
						case 5: // map
							let key;
							if (currentDecoder.mapsAsObjects) {
								let object = {};
								let i = 0;
								if (currentDecoder.keyMap) {
									while((key = read()) != STOP_CODE) {
										if (i++ >= maxMapSize) throw new Error(`Property count exceeds ${maxMapSize}`)
										object[safeKey(currentDecoder.decodeKey(key))] = read();
									}
								}
								else {
									while ((key = read()) != STOP_CODE) {
										if (i++ >= maxMapSize) throw new Error(`Property count exceeds ${maxMapSize}`)
										object[safeKey(key)] = read();
									}
								}
								return object
							} else {
								if (restoreMapsAsObject) {
									currentDecoder.mapsAsObjects = true;
									restoreMapsAsObject = false;
								}
								let map = new Map();
								if (currentDecoder.keyMap) {
									let i = 0;
									while((key = read()) != STOP_CODE) {
										if (i++ >= maxMapSize) {
											throw new Error(`Map size exceeds ${maxMapSize}`);
										}
										map.set(currentDecoder.decodeKey(key), read());
									}
								}
								else {
									let i = 0;
									while ((key = read()) != STOP_CODE) {
										if (i++ >= maxMapSize) {
											throw new Error(`Map size exceeds ${maxMapSize}`);
										}
										map.set(key, read());
									}
								}
								return map
							}
						case 7:
							return STOP_CODE
						default:
							throw new Error('Invalid major type for indefinite length ' + majorType)
					}
				default:
					throw new Error('Unknown token ' + token)
			}
		}
		switch (majorType) {
			case 0: // positive int
				return token
			case 1: // negative int
				return ~token
			case 2: // buffer
				return readBin(token)
			case 3: // string
				if (srcStringEnd >= position$1) {
					return srcString.slice(position$1 - srcStringStart, (position$1 += token) - srcStringStart)
				}
				if (srcStringEnd == 0 && srcEnd < 140 && token < 32) {
					// for small blocks, avoiding the overhead of the extract call is helpful
					let string = token < 16 ? shortStringInJS(token) : longStringInJS(token);
					if (string != null)
						return string
				}
				return readFixedString(token)
			case 4: // array
				if (token >= maxArraySize) throw new Error(`Array length exceeds ${maxArraySize}`)
				let array = new Array(token);
			  //if (currentDecoder.keyMap) for (let i = 0; i < token; i++) array[i] = currentDecoder.decodeKey(read())	
				//else 
				for (let i = 0; i < token; i++) array[i] = read();
				return array
			case 5: // map
				if (token >= maxMapSize) throw new Error(`Map size exceeds ${maxArraySize}`)
				if (currentDecoder.mapsAsObjects) {
					let object = {};
					if (currentDecoder.keyMap) for (let i = 0; i < token; i++) object[safeKey(currentDecoder.decodeKey(read()))] = read();
					else for (let i = 0; i < token; i++) object[safeKey(read())] = read();
					return object
				} else {
					if (restoreMapsAsObject) {
						currentDecoder.mapsAsObjects = true;
						restoreMapsAsObject = false;
					}
					let map = new Map();
					if (currentDecoder.keyMap) for (let i = 0; i < token; i++) map.set(currentDecoder.decodeKey(read()),read());
					else for (let i = 0; i < token; i++) map.set(read(), read());
					return map
				}
			case 6: // extension
				if (token >= BUNDLED_STRINGS_ID) {
					let structure = currentStructures[token & 0x1fff]; // check record structures first
					// At some point we may provide an option for dynamic tag assignment with a range like token >= 8 && (token < 16 || (token > 0x80 && token < 0xc0) || (token > 0x130 && token < 0x4000))
					if (structure) {
						if (!structure.read) structure.read = createStructureReader(structure);
						return structure.read()
					}
					if (token < 0x10000) {
						if (token == RECORD_INLINE_ID) { // we do a special check for this so that we can keep the
							// currentExtensions as densely stored array (v8 stores arrays densely under about 3000 elements)
							let length = readJustLength();
							let id = read();
							let structure = read();
							recordDefinition(id, structure);
							let object = {};
							if (currentDecoder.keyMap) for (let i = 2; i < length; i++) {
								let key = currentDecoder.decodeKey(structure[i - 2]);
								object[safeKey(key)] = read();
							}
							else for (let i = 2; i < length; i++) {
								let key = structure[i - 2];
								object[safeKey(key)] = read();
							}
							return object
						}
						else if (token == RECORD_DEFINITIONS_ID) {
							let length = readJustLength();
							let id = read();
							for (let i = 2; i < length; i++) {
								recordDefinition(id++, read());
							}
							return read()
						} else if (token == BUNDLED_STRINGS_ID) {
							return readBundleExt()
						}
						if (currentDecoder.getShared) {
							loadShared();
							structure = currentStructures[token & 0x1fff];
							if (structure) {
								if (!structure.read)
									structure.read = createStructureReader(structure);
								return structure.read()
							}
						}
					}
				}
				let extension = currentExtensions[token];
				if (extension) {
					if (extension.handlesRead)
						return extension(read)
					else
						return extension(read())
				} else {
					let input = read();
					for (let i = 0; i < currentExtensionRanges.length; i++) {
						let value = currentExtensionRanges[i](token, input);
						if (value !== undefined)
							return value
					}
					return new Tag(input, token)
				}
			case 7: // fixed value
				switch (token) {
					case 0x14: return false
					case 0x15: return true
					case 0x16: return null
					case 0x17: return; // undefined
					case 0x1f:
					default:
						let packedValue = (packedValues || getPackedValues())[token];
						if (packedValue !== undefined)
							return packedValue
						throw new Error('Unknown token ' + token)
				}
			default: // negative int
				if (isNaN(token)) {
					let error = new Error('Unexpected end of CBOR data');
					error.incomplete = true;
					throw error
				}
				throw new Error('Unknown CBOR token ' + token)
		}
	}
	const validName = /^[a-zA-Z_$][a-zA-Z\d_$]*$/;
	function createStructureReader(structure) {
		if (!structure) throw new Error('Structure is required in record definition');
		function readObject() {
			// get the array size from the header
			let length = src[position$1++];
			//let majorType = token >> 5
			length = length & 0x1f;
			if (length > 0x17) {
				switch (length) {
					case 0x18:
						length = src[position$1++];
						break
					case 0x19:
						length = dataView.getUint16(position$1);
						position$1 += 2;
						break
					case 0x1a:
						length = dataView.getUint32(position$1);
						position$1 += 4;
						break
					default:
						throw new Error('Expected array header, but got ' + src[position$1 - 1])
				}
			}
			// This initial function is quick to instantiate, but runs slower. After several iterations pay the cost to build the faster function
			let compiledReader = this.compiledReader; // first look to see if we have the fast compiled function
			while(compiledReader) {
				// we have a fast compiled object literal reader
				if (compiledReader.propertyCount === length)
					return compiledReader(read) // with the right length, so we use it
				compiledReader = compiledReader.next; // see if there is another reader with the right length
			}
			if (this.slowReads++ >= inlineObjectReadThreshold) { // create a fast compiled reader
				let array = this.length == length ? this : this.slice(0, length);
				compiledReader = currentDecoder.keyMap 
				? new Function('r', 'return {' + array.map(k => currentDecoder.decodeKey(k)).map(k => validName.test(k) ? safeKey(k) + ':r()' : ('[' + JSON.stringify(k) + ']:r()')).join(',') + '}')
				: new Function('r', 'return {' + array.map(key => validName.test(key) ? safeKey(key) + ':r()' : ('[' + JSON.stringify(key) + ']:r()')).join(',') + '}');
				if (this.compiledReader)
					compiledReader.next = this.compiledReader; // if there is an existing one, we store multiple readers as a linked list because it is usually pretty rare to have multiple readers (of different length) for the same structure
				compiledReader.propertyCount = length;
				this.compiledReader = compiledReader;
				return compiledReader(read)
			}
			let object = {};
			if (currentDecoder.keyMap) for (let i = 0; i < length; i++) object[safeKey(currentDecoder.decodeKey(this[i]))] = read();
			else for (let i = 0; i < length; i++) {
				object[safeKey(this[i])] = read();
			}
			return object
		}
		structure.slowReads = 0;
		return readObject
	}

	function safeKey(key) {
		// protect against prototype pollution
		if (typeof key === 'string') return key === '__proto__' ? '__proto_' : key
		if (typeof key === 'number' || typeof key === 'boolean' || typeof key === 'bigint') return key.toString();
		if (key == null) return key + '';
		// protect against expensive (DoS) string conversions
		throw new Error('Invalid property name type ' + typeof key);
	}

	let readFixedString = readStringJS;
	function readStringJS(length) {
		let result;
		if (length < 16) {
			if (result = shortStringInJS(length))
				return result
		}
		if (length > 64 && decoder)
			return decoder.decode(src.subarray(position$1, position$1 += length))
		const end = position$1 + length;
		const units = [];
		result = '';
		while (position$1 < end) {
			const byte1 = src[position$1++];
			if ((byte1 & 0x80) === 0) {
				// 1 byte
				units.push(byte1);
			} else if ((byte1 & 0xe0) === 0xc0) {
				// 2 bytes
				const byte2 = src[position$1++] & 0x3f;
				const codePoint = ((byte1 & 0x1f) << 6) | byte2;
				// Reject overlong encoding: 2-byte sequences must encode values >= 0x80
				if (codePoint < 0x80) {
					units.push(0xFFFD); // replacement character
				} else {
					units.push(codePoint);
				}
			} else if ((byte1 & 0xf0) === 0xe0) {
				// 3 bytes
				const byte2 = src[position$1++] & 0x3f;
				const byte3 = src[position$1++] & 0x3f;
				const codePoint = ((byte1 & 0x1f) << 12) | (byte2 << 6) | byte3;
				// Reject overlong encoding: 3-byte sequences must encode values >= 0x800
				// Also reject surrogates (0xD800-0xDFFF)
				if (codePoint < 0x800 || (codePoint >= 0xD800 && codePoint <= 0xDFFF)) {
					units.push(0xFFFD); // replacement character
				} else {
					units.push(codePoint);
				}
			} else if ((byte1 & 0xf8) === 0xf0) {
				// 4 bytes
				const byte2 = src[position$1++] & 0x3f;
				const byte3 = src[position$1++] & 0x3f;
				const byte4 = src[position$1++] & 0x3f;
				let unit = ((byte1 & 0x07) << 0x12) | (byte2 << 0x0c) | (byte3 << 0x06) | byte4;
				// Reject overlong encoding: 4-byte sequences must encode values >= 0x10000
				// Also reject values > 0x10FFFF (maximum valid Unicode)
				if (unit < 0x10000 || unit > 0x10FFFF) {
					units.push(0xFFFD); // replacement character
				} else if (unit > 0xffff) {
					unit -= 0x10000;
					units.push(((unit >>> 10) & 0x3ff) | 0xd800);
					unit = 0xdc00 | (unit & 0x3ff);
					units.push(unit);
				} else {
					units.push(unit);
				}
			} else {
				units.push(0xFFFD); // replacement character for invalid lead byte
			}

			if (units.length >= 0x1000) {
				result += fromCharCode.apply(String, units);
				units.length = 0;
			}
		}

		if (units.length > 0) {
			result += fromCharCode.apply(String, units);
		}

		return result
	}
	let fromCharCode = String.fromCharCode;
	function longStringInJS(length) {
		let start = position$1;
		let bytes = new Array(length);
		for (let i = 0; i < length; i++) {
			const byte = src[position$1++];
			if ((byte & 0x80) > 0) {
				position$1 = start;
	    			return
	    		}
	    		bytes[i] = byte;
	    	}
	    	return fromCharCode.apply(String, bytes)
	}
	function shortStringInJS(length) {
		if (length < 4) {
			if (length < 2) {
				if (length === 0)
					return ''
				else {
					let a = src[position$1++];
					if ((a & 0x80) > 1) {
						position$1 -= 1;
						return
					}
					return fromCharCode(a)
				}
			} else {
				let a = src[position$1++];
				let b = src[position$1++];
				if ((a & 0x80) > 0 || (b & 0x80) > 0) {
					position$1 -= 2;
					return
				}
				if (length < 3)
					return fromCharCode(a, b)
				let c = src[position$1++];
				if ((c & 0x80) > 0) {
					position$1 -= 3;
					return
				}
				return fromCharCode(a, b, c)
			}
		} else {
			let a = src[position$1++];
			let b = src[position$1++];
			let c = src[position$1++];
			let d = src[position$1++];
			if ((a & 0x80) > 0 || (b & 0x80) > 0 || (c & 0x80) > 0 || (d & 0x80) > 0) {
				position$1 -= 4;
				return
			}
			if (length < 6) {
				if (length === 4)
					return fromCharCode(a, b, c, d)
				else {
					let e = src[position$1++];
					if ((e & 0x80) > 0) {
						position$1 -= 5;
						return
					}
					return fromCharCode(a, b, c, d, e)
				}
			} else if (length < 8) {
				let e = src[position$1++];
				let f = src[position$1++];
				if ((e & 0x80) > 0 || (f & 0x80) > 0) {
					position$1 -= 6;
					return
				}
				if (length < 7)
					return fromCharCode(a, b, c, d, e, f)
				let g = src[position$1++];
				if ((g & 0x80) > 0) {
					position$1 -= 7;
					return
				}
				return fromCharCode(a, b, c, d, e, f, g)
			} else {
				let e = src[position$1++];
				let f = src[position$1++];
				let g = src[position$1++];
				let h = src[position$1++];
				if ((e & 0x80) > 0 || (f & 0x80) > 0 || (g & 0x80) > 0 || (h & 0x80) > 0) {
					position$1 -= 8;
					return
				}
				if (length < 10) {
					if (length === 8)
						return fromCharCode(a, b, c, d, e, f, g, h)
					else {
						let i = src[position$1++];
						if ((i & 0x80) > 0) {
							position$1 -= 9;
							return
						}
						return fromCharCode(a, b, c, d, e, f, g, h, i)
					}
				} else if (length < 12) {
					let i = src[position$1++];
					let j = src[position$1++];
					if ((i & 0x80) > 0 || (j & 0x80) > 0) {
						position$1 -= 10;
						return
					}
					if (length < 11)
						return fromCharCode(a, b, c, d, e, f, g, h, i, j)
					let k = src[position$1++];
					if ((k & 0x80) > 0) {
						position$1 -= 11;
						return
					}
					return fromCharCode(a, b, c, d, e, f, g, h, i, j, k)
				} else {
					let i = src[position$1++];
					let j = src[position$1++];
					let k = src[position$1++];
					let l = src[position$1++];
					if ((i & 0x80) > 0 || (j & 0x80) > 0 || (k & 0x80) > 0 || (l & 0x80) > 0) {
						position$1 -= 12;
						return
					}
					if (length < 14) {
						if (length === 12)
							return fromCharCode(a, b, c, d, e, f, g, h, i, j, k, l)
						else {
							let m = src[position$1++];
							if ((m & 0x80) > 0) {
								position$1 -= 13;
								return
							}
							return fromCharCode(a, b, c, d, e, f, g, h, i, j, k, l, m)
						}
					} else {
						let m = src[position$1++];
						let n = src[position$1++];
						if ((m & 0x80) > 0 || (n & 0x80) > 0) {
							position$1 -= 14;
							return
						}
						if (length < 15)
							return fromCharCode(a, b, c, d, e, f, g, h, i, j, k, l, m, n)
						let o = src[position$1++];
						if ((o & 0x80) > 0) {
							position$1 -= 15;
							return
						}
						return fromCharCode(a, b, c, d, e, f, g, h, i, j, k, l, m, n, o)
					}
				}
			}
		}
	}

	function readBin(length) {
		return currentDecoder.copyBuffers ?
			// specifically use the copying slice (not the node one)
			Uint8Array.prototype.slice.call(src, position$1, position$1 += length) :
			src.subarray(position$1, position$1 += length)
	}
	let f32Array = new Float32Array(1);
	let u8Array = new Uint8Array(f32Array.buffer, 0, 4);
	function getFloat16() {
		let byte0 = src[position$1++];
		let byte1 = src[position$1++];
		let exponent = (byte0 & 0x7f) >> 2;
		if (exponent === 0x1f) { // specials
			if (byte1 || (byte0 & 3))
				return NaN;
			return (byte0 & 0x80) ? -Infinity : Infinity;
		}
		if (exponent === 0) { // sub-normals
			// significand with 10 fractional bits and divided by 2^14
			let abs = (((byte0 & 3) << 8) | byte1) / (1 << 24);
			return (byte0 & 0x80) ? -abs : abs
		}

		u8Array[3] = (byte0 & 0x80) | // sign bit
			((exponent >> 1) + 56); // 4 of 5 of the exponent bits, re-offset-ed
		u8Array[2] = ((byte0 & 7) << 5) | // last exponent bit and first two mantissa bits
			(byte1 >> 3); // next 5 bits of mantissa
		u8Array[1] = byte1 << 5; // last three bits of mantissa
		u8Array[0] = 0;
		return f32Array[0];
	}

	new Array(4096);

	class Tag {
		constructor(value, tag) {
			this.value = value;
			this.tag = tag;
		}
	}

	currentExtensions[0] = (dateString) => {
		// string date extension
		return new Date(dateString)
	};

	currentExtensions[1] = (epochSec) => {
		// numeric date extension
		return new Date(Math.round(epochSec * 1000))
	};

	currentExtensions[2] = (buffer) => {
		// bigint extension
		let value = BigInt(0);
		for (let i = 0, l = buffer.byteLength; i < l; i++) {
			value = BigInt(buffer[i]) + (value << BigInt(8));
		}
		return value
	};

	currentExtensions[3] = (buffer) => {
		// negative bigint extension
		return BigInt(-1) - currentExtensions[2](buffer)
	};
	currentExtensions[4] = (fraction) => {
		// best to reparse to maintain accuracy
		return +(fraction[1] + 'e' + fraction[0])
	};

	currentExtensions[5] = (fraction) => {
		// probably not sufficiently accurate
		return fraction[1] * Math.exp(fraction[0] * Math.log(2))
	};

	// the registration of the record definition extension
	const recordDefinition = (id, structure) => {
		id = id - 0xe000;
		let existingStructure = currentStructures[id];
		if (existingStructure && existingStructure.isShared) {
			(currentStructures.restoreStructures || (currentStructures.restoreStructures = []))[id] = existingStructure;
		}
		currentStructures[id] = structure;

		structure.read = createStructureReader(structure);
	};
	currentExtensions[LEGACY_RECORD_INLINE_ID] = (data) => {
		let length = data.length;
		let structure = data[1];
		recordDefinition(data[0], structure);
		let object = {};
		for (let i = 2; i < length; i++) {
			let key = structure[i - 2];
			object[safeKey(key)] = data[i];
		}
		return object
	};
	currentExtensions[14] = (value) => {
		if (bundledStrings$1)
			return bundledStrings$1[0].slice(bundledStrings$1.position0, bundledStrings$1.position0 += value)
		return new Tag(value, 14)
	};
	currentExtensions[15] = (value) => {
		if (bundledStrings$1)
			return bundledStrings$1[1].slice(bundledStrings$1.position1, bundledStrings$1.position1 += value)
		return new Tag(value, 15)
	};
	let glbl = { Error, RegExp };
	currentExtensions[27] = (data) => { // http://cbor.schmorp.de/generic-object
		return (glbl[data[0]] || Error)(data[1], data[2])
	};
	const packedTable = (read) => {
		if (src[position$1++] != 0x84) {
			let error = new Error('Packed values structure must be followed by a 4 element array');
			if (src.length < position$1)
				error.incomplete = true;
			throw error
		}
		let newPackedValues = read(); // packed values
		if (!newPackedValues || !newPackedValues.length) {
			let error = new Error('Packed values structure must be followed by a 4 element array');
			error.incomplete = true;
			throw error
		}
		packedValues = packedValues ? newPackedValues.concat(packedValues.slice(newPackedValues.length)) : newPackedValues;
		packedValues.prefixes = read();
		packedValues.suffixes = read();
		return read() // read the rump
	};
	packedTable.handlesRead = true;
	currentExtensions[51] = packedTable;

	currentExtensions[PACKED_REFERENCE_TAG_ID] = (data) => { // packed reference
		if (!packedValues) {
			if (currentDecoder.getShared)
				loadShared();
			else
				return new Tag(data, PACKED_REFERENCE_TAG_ID)
		}
		if (typeof data == 'number')
			return packedValues[16 + (data >= 0 ? 2 * data : (-2 * data - 1))]
		let error = new Error('No support for non-integer packed references yet');
		if (data === undefined)
			error.incomplete = true;
		throw error
	};

	// The following code is an incomplete implementation of http://cbor.schmorp.de/stringref
	// the real thing would need to implemennt more logic to populate the stringRefs table and
	// maintain a stack of stringRef "namespaces".
	//
	// currentExtensions[25] = (id) => {
	// 	return stringRefs[id]
	// }
	// currentExtensions[256] = (read) => {
	// 	stringRefs = []
	// 	try {
	// 		return read()
	// 	} finally {
	// 		stringRefs = null
	// 	}
	// }
	// currentExtensions[256].handlesRead = true

	currentExtensions[28] = (read) => { 
		// shareable http://cbor.schmorp.de/value-sharing (for structured clones)
		if (!referenceMap) {
			referenceMap = new Map();
			referenceMap.id = 0;
		}
		let id = referenceMap.id++;
		let startingPosition = position$1;
		let token = src[position$1];
		let target;
		// TODO: handle Maps, Sets, and other types that can cycle; this is complicated, because you potentially need to read
		// ahead past references to record structure definitions
		if ((token >> 5) == 4)
			target = [];
		else
			target = {};

		let refEntry = { target }; // a placeholder object
		referenceMap.set(id, refEntry);
		let targetProperties = read(); // read the next value as the target object to id
		if (refEntry.used) {// there is a cycle, so we have to assign properties to original target
			if (Object.getPrototypeOf(target) !== Object.getPrototypeOf(targetProperties)) {
				// this means that the returned target does not match the targetProperties, so we need rerun the read to
				// have the correctly create instance be assigned as a reference, then we do the copy the properties back to the
				// target
				// reset the position so that the read can be repeated
				position$1 = startingPosition;
				// the returned instance is our new target for references
				target = targetProperties;
				referenceMap.set(id, { target });
				targetProperties = read();
			}
			return Object.assign(target, targetProperties)
		}
		refEntry.target = targetProperties; // the placeholder wasn't used, replace with the deserialized one
		return targetProperties // no cycle, can just use the returned read object
	};
	currentExtensions[28].handlesRead = true;

	currentExtensions[29] = (id) => {
		// sharedref http://cbor.schmorp.de/value-sharing (for structured clones)
		let refEntry = referenceMap.get(id);
		refEntry.used = true;
		return refEntry.target
	};

	currentExtensions[258] = (array) => new Set(array); // https://github.com/input-output-hk/cbor-sets-spec/blob/master/CBOR_SETS.md
	(currentExtensions[259] = (read) => {
		// https://github.com/shanewholloway/js-cbor-codec/blob/master/docs/CBOR-259-spec
		// for decoding as a standard Map
		if (currentDecoder.mapsAsObjects) {
			currentDecoder.mapsAsObjects = false;
			restoreMapsAsObject = true;
		}
		return read()
	}).handlesRead = true;
	function combine(a, b) {
		if (typeof a === 'string')
			return a + b
		if (a instanceof Array)
			return a.concat(b)
		return Object.assign({}, a, b)
	}
	function getPackedValues() {
		if (!packedValues) {
			if (currentDecoder.getShared)
				loadShared();
			else
				throw new Error('No packed values available')
		}
		return packedValues
	}
	const SHARED_DATA_TAG_ID = 0x53687264; // ascii 'Shrd'
	currentExtensionRanges.push((tag, input) => {
		if (tag >= 225 && tag <= 255)
			return combine(getPackedValues().prefixes[tag - 224], input)
		if (tag >= 28704 && tag <= 32767)
			return combine(getPackedValues().prefixes[tag - 28672], input)
		if (tag >= 1879052288 && tag <= 2147483647)
			return combine(getPackedValues().prefixes[tag - 1879048192], input)
		if (tag >= 216 && tag <= 223)
			return combine(input, getPackedValues().suffixes[tag - 216])
		if (tag >= 27647 && tag <= 28671)
			return combine(input, getPackedValues().suffixes[tag - 27639])
		if (tag >= 1811940352 && tag <= 1879048191)
			return combine(input, getPackedValues().suffixes[tag - 1811939328])
		if (tag == SHARED_DATA_TAG_ID) {// we do a special check for this so that we can keep the currentExtensions as densely stored array (v8 stores arrays densely under about 3000 elements)
			return {
				packedValues: packedValues,
				structures: currentStructures.slice(0),
				version: input,
			}
		}
		if (tag == 55799) // self-descriptive CBOR tag, just return input value
			return input
	});

	const isLittleEndianMachine$1 = new Uint8Array(new Uint16Array([1]).buffer)[0] == 1;
	const typedArrays = [Uint8Array, Uint8ClampedArray, Uint16Array, Uint32Array,
		typeof BigUint64Array == 'undefined' ? { name:'BigUint64Array' } : BigUint64Array, Int8Array, Int16Array, Int32Array,
		typeof BigInt64Array == 'undefined' ? { name:'BigInt64Array' } : BigInt64Array, Float32Array, Float64Array];
	const typedArrayTags = [64, 68, 69, 70, 71, 72, 77, 78, 79, 85, 86];
	for (let i = 0; i < typedArrays.length; i++) {
		registerTypedArray(typedArrays[i], typedArrayTags[i]);
	}
	function registerTypedArray(TypedArray, tag) {
		let dvMethod = 'get' + TypedArray.name.slice(0, -5);
		let bytesPerElement;
		if (typeof TypedArray === 'function')
			bytesPerElement = TypedArray.BYTES_PER_ELEMENT;
		else
			TypedArray = null;
		for (let littleEndian = 0; littleEndian < 2; littleEndian++) {
			if (!littleEndian && bytesPerElement == 1)
				continue
			let sizeShift = bytesPerElement == 2 ? 1 : bytesPerElement == 4 ? 2 : bytesPerElement == 8 ? 3 : 0;
			currentExtensions[littleEndian ? tag : (tag - 4)] = (bytesPerElement == 1 || littleEndian == isLittleEndianMachine$1) ? (buffer) => {
				if (!TypedArray)
					throw new Error('Could not find typed array for code ' + tag)
				if (!currentDecoder.copyBuffers) {
					// try provide a direct view, but will only work if we are byte-aligned
					if (bytesPerElement === 1 ||
						bytesPerElement === 2 && !(buffer.byteOffset & 1) ||
						bytesPerElement === 4 && !(buffer.byteOffset & 3) ||
						bytesPerElement === 8 && !(buffer.byteOffset & 7))
						return new TypedArray(buffer.buffer, buffer.byteOffset, buffer.byteLength >> sizeShift);
				}
				// we have to slice/copy here to get a new ArrayBuffer, if we are not word/byte aligned
				return new TypedArray(Uint8Array.prototype.slice.call(buffer, 0).buffer)
			} : buffer => {
				if (!TypedArray)
					throw new Error('Could not find typed array for code ' + tag)
				let dv = new DataView(buffer.buffer, buffer.byteOffset, buffer.byteLength);
				let elements = buffer.length >> sizeShift;
				let ta = new TypedArray(elements);
				let method = dv[dvMethod];
				for (let i = 0; i < elements; i++) {
					ta[i] = method.call(dv, i << sizeShift, littleEndian);
				}
				return ta
			};
		}
	}

	function readBundleExt() {
		let length = readJustLength();
		let bundlePosition = position$1 + read();
		for (let i = 2; i < length; i++) {
			// skip past bundles that were already read
			let bundleLength = readJustLength(); // this will increment position, so must add to position afterwards
			position$1 += bundleLength;
		}
		let dataPosition = position$1;
		position$1 = bundlePosition;
		bundledStrings$1 = [readStringJS(readJustLength()), readStringJS(readJustLength())];
		bundledStrings$1.position0 = 0;
		bundledStrings$1.position1 = 0;
		bundledStrings$1.postBundlePosition = position$1;
		position$1 = dataPosition;
		return read()
	}

	function readJustLength() {
		let token = src[position$1++] & 0x1f;
		if (token > 0x17) {
			switch (token) {
				case 0x18:
					token = src[position$1++];
					break
				case 0x19:
					token = dataView.getUint16(position$1);
					position$1 += 2;
					break
				case 0x1a:
					token = dataView.getUint32(position$1);
					position$1 += 4;
					break
			}
		}
		return token
	}

	function loadShared() {
		if (currentDecoder.getShared) {
			let sharedData = saveState(() => {
				// save the state in case getShared modifies our buffer
				src = null;
				return currentDecoder.getShared()
			}) || {};
			let updatedStructures = sharedData.structures || [];
			currentDecoder.sharedVersion = sharedData.version;
			packedValues = currentDecoder.sharedValues = sharedData.packedValues;
			if (currentStructures === true)
				currentDecoder.structures = currentStructures = updatedStructures;
			else
				currentStructures.splice.apply(currentStructures, [0, updatedStructures.length].concat(updatedStructures));
		}
	}

	function saveState(callback) {
		let savedSrcEnd = srcEnd;
		let savedPosition = position$1;
		let savedSrcStringStart = srcStringStart;
		let savedSrcStringEnd = srcStringEnd;
		let savedSrcString = srcString;
		let savedReferenceMap = referenceMap;
		let savedBundledStrings = bundledStrings$1;

		// TODO: We may need to revisit this if we do more external calls to user code (since it could be slow)
		let savedSrc = new Uint8Array(src.slice(0, srcEnd)); // we copy the data in case it changes while external data is processed
		let savedStructures = currentStructures;
		let savedDecoder = currentDecoder;
		let savedSequentialMode = sequentialMode;
		let value = callback();
		srcEnd = savedSrcEnd;
		position$1 = savedPosition;
		srcStringStart = savedSrcStringStart;
		srcStringEnd = savedSrcStringEnd;
		srcString = savedSrcString;
		referenceMap = savedReferenceMap;
		bundledStrings$1 = savedBundledStrings;
		src = savedSrc;
		sequentialMode = savedSequentialMode;
		currentStructures = savedStructures;
		currentDecoder = savedDecoder;
		dataView = new DataView(src.buffer, src.byteOffset, src.byteLength);
		return value
	}
	function clearSource() {
		src = null;
		referenceMap = null;
		currentStructures = null;
	}

	const mult10 = new Array(147); // this is a table matching binary exponents to the multiplier to determine significant digit rounding
	for (let i = 0; i < 256; i++) {
		mult10[i] = +('1e' + Math.floor(45.15 - i * 0.30103));
	}
	let defaultDecoder = new Decoder({ useRecords: false });
	const decode = defaultDecoder.decode;
	defaultDecoder.decodeMultiple;

	let textEncoder;
	try {
		textEncoder = new TextEncoder();
	} catch (error) {}
	let extensions, extensionClasses;
	const Buffer$1 = typeof globalThis === 'object' && globalThis.Buffer;
	const hasNodeBuffer = typeof Buffer$1 !== 'undefined';
	const ByteArrayAllocate = hasNodeBuffer ? Buffer$1.allocUnsafeSlow : Uint8Array;
	const ByteArray = hasNodeBuffer ? Buffer$1 : Uint8Array;
	const MAX_STRUCTURES = 0x100;
	const MAX_BUFFER_SIZE = hasNodeBuffer ? 0x100000000 : 0x7fd00000;
	let throwOnIterable;
	let target;
	let targetView;
	let position = 0;
	let safeEnd;
	let bundledStrings = null;
	const MAX_BUNDLE_SIZE = 0xf000;
	const hasNonLatin = /[\u0080-\uFFFF]/;
	const RECORD_SYMBOL = Symbol('record-id');
	class Encoder extends Decoder {
		constructor(options) {
			super(options);
			this.offset = 0;
			let start;
			let sharedStructures;
			let hasSharedUpdate;
			let structures;
			let referenceMap;
			options = options || {};
			let encodeUtf8 = ByteArray.prototype.utf8Write ? function(string, position) {
				return target.utf8Write(string, position, target.byteLength - position)
			} : (textEncoder && textEncoder.encodeInto) ?
				function(string, position) {
					return textEncoder.encodeInto(string, target.subarray(position)).written
				} : false;

			let encoder = this;
			let hasSharedStructures = options.structures || options.saveStructures;
			let maxSharedStructures = options.maxSharedStructures;
			if (maxSharedStructures == null)
				maxSharedStructures = hasSharedStructures ? 128 : 0;
			if (maxSharedStructures > 8190)
				throw new Error('Maximum maxSharedStructure is 8190')
			let isSequential = options.sequential;
			if (isSequential) {
				maxSharedStructures = 0;
			}
			if (!this.structures)
				this.structures = [];
			if (this.saveStructures)
				this.saveShared = this.saveStructures;
			let samplingPackedValues, packedObjectMap, sharedValues = options.sharedValues;
			let sharedPackedObjectMap;
			if (sharedValues) {
				sharedPackedObjectMap = Object.create(null);
				for (let i = 0, l = sharedValues.length; i < l; i++) {
					sharedPackedObjectMap[sharedValues[i]] = i;
				}
			}
			let recordIdsToRemove = [];
			let transitionsCount = 0;
			let serializationsSinceTransitionRebuild = 0;
			
			this.mapEncode = function(value, encodeOptions) {
				// Experimental support for premapping keys using _keyMap instad of keyMap - not optiimised yet)
				if (this._keyMap && !this._mapped) {
					//console.log('encoding ', value)
					switch (value.constructor.name) {
						case 'Array': 
							value = value.map(r => this.encodeKeys(r));
							break
						//case 'Map': 
						//	value = this.encodeKeys(value)
						//	break
					}
					//this._mapped = true
				}
				return this.encode(value, encodeOptions)
			};
			
			this.encode = function(value, encodeOptions)	{
				if (!target) {
					target = new ByteArrayAllocate(8192);
					targetView = new DataView(target.buffer, 0, 8192);
					position = 0;
				}
				safeEnd = target.length - 10;
				if (safeEnd - position < 0x800) {
					// don't start too close to the end, 
					target = new ByteArrayAllocate(target.length);
					targetView = new DataView(target.buffer, 0, target.length);
					safeEnd = target.length - 10;
					position = 0;
				} else if (encodeOptions === REUSE_BUFFER_MODE)
					position = (position + 7) & 0x7ffffff8; // Word align to make any future copying of this buffer faster
				start = position;
				if (encoder.useSelfDescribedHeader) {
					targetView.setUint32(position, 0xd9d9f700); // tag two byte, then self-descriptive tag
					position += 3;
				}
				referenceMap = encoder.structuredClone ? new Map() : null;
				if (encoder.bundleStrings && typeof value !== 'string') {
					bundledStrings = [];
					bundledStrings.size = Infinity; // force a new bundle start on first string
				} else
					bundledStrings = null;

				sharedStructures = encoder.structures;
				if (sharedStructures) {
					if (sharedStructures.uninitialized) {
						let sharedData = encoder.getShared() || {};
						encoder.structures = sharedStructures = sharedData.structures || [];
						encoder.sharedVersion = sharedData.version;
						let sharedValues = encoder.sharedValues = sharedData.packedValues;
						if (sharedValues) {
							sharedPackedObjectMap = {};
							for (let i = 0, l = sharedValues.length; i < l; i++)
								sharedPackedObjectMap[sharedValues[i]] = i;
						}
					}
					let sharedStructuresLength = sharedStructures.length;
					if (sharedStructuresLength > maxSharedStructures && !isSequential)
						sharedStructuresLength = maxSharedStructures;
					if (!sharedStructures.transitions) {
						// rebuild our structure transitions
						sharedStructures.transitions = Object.create(null);
						for (let i = 0; i < sharedStructuresLength; i++) {
							let keys = sharedStructures[i];
							//console.log('shared struct keys:', keys)
							if (!keys)
								continue
							let nextTransition, transition = sharedStructures.transitions;
							for (let j = 0, l = keys.length; j < l; j++) {
								if (transition[RECORD_SYMBOL] === undefined)
									transition[RECORD_SYMBOL] = i;
								let key = keys[j];
								nextTransition = transition[key];
								if (!nextTransition) {
									nextTransition = transition[key] = Object.create(null);
								}
								transition = nextTransition;
							}
							transition[RECORD_SYMBOL] = i | 0x100000;
						}
					}
					if (!isSequential)
						sharedStructures.nextId = sharedStructuresLength;
				}
				if (hasSharedUpdate)
					hasSharedUpdate = false;
				structures = sharedStructures || [];
				packedObjectMap = sharedPackedObjectMap;
				if (options.pack) {
					let packedValues = new Map();
					packedValues.values = [];
					packedValues.encoder = encoder;
					packedValues.maxValues = options.maxPrivatePackedValues || (sharedPackedObjectMap ? 16 : Infinity);
					packedValues.objectMap = sharedPackedObjectMap || false;
					packedValues.samplingPackedValues = samplingPackedValues;
					findRepetitiveStrings(value, packedValues);
					if (packedValues.values.length > 0) {
						target[position++] = 0xd8; // one-byte tag
						target[position++] = 51; // tag 51 for packed shared structures https://www.potaroo.net/ietf/ids/draft-ietf-cbor-packed-03.txt
						writeArrayHeader(4);
						let valuesArray = packedValues.values;
						encode(valuesArray);
						writeArrayHeader(0); // prefixes
						writeArrayHeader(0); // suffixes
						packedObjectMap = Object.create(sharedPackedObjectMap || null);
						for (let i = 0, l = valuesArray.length; i < l; i++) {
							packedObjectMap[valuesArray[i]] = i;
						}
					}
				}
				throwOnIterable = encodeOptions & THROW_ON_ITERABLE;
				try {
					if (throwOnIterable)
						return;
					encode(value);
					if (bundledStrings) {
						writeBundles(start, encode);
					}
					encoder.offset = position; // update the offset so next serialization doesn't write over our buffer, but can continue writing to same buffer sequentially
					if (referenceMap && referenceMap.idsToInsert) {
						position += referenceMap.idsToInsert.length * 2;
						if (position > safeEnd)
							makeRoom(position);
						encoder.offset = position;
						let serialized = insertIds(target.subarray(start, position), referenceMap.idsToInsert);
						referenceMap = null;
						return serialized
					}
					if (encodeOptions & REUSE_BUFFER_MODE) {
						target.start = start;
						target.end = position;
						return target
					}
					return target.subarray(start, position) // position can change if we call encode again in saveShared, so we get the buffer now
				} finally {
					if (sharedStructures) {
						if (serializationsSinceTransitionRebuild < 10)
							serializationsSinceTransitionRebuild++;
						if (sharedStructures.length > maxSharedStructures)
							sharedStructures.length = maxSharedStructures;
						if (transitionsCount > 10000) {
							// force a rebuild occasionally after a lot of transitions so it can get cleaned up
							sharedStructures.transitions = null;
							serializationsSinceTransitionRebuild = 0;
							transitionsCount = 0;
							if (recordIdsToRemove.length > 0)
								recordIdsToRemove = [];
						} else if (recordIdsToRemove.length > 0 && !isSequential) {
							for (let i = 0, l = recordIdsToRemove.length; i < l; i++) {
								recordIdsToRemove[i][RECORD_SYMBOL] = undefined;
							}
							recordIdsToRemove = [];
							//sharedStructures.nextId = maxSharedStructures
						}
					}
					if (hasSharedUpdate && encoder.saveShared) {
						if (encoder.structures.length > maxSharedStructures) {
							encoder.structures = encoder.structures.slice(0, maxSharedStructures);
						}
						// we can't rely on start/end with REUSE_BUFFER_MODE since they will (probably) change when we save
						let returnBuffer = target.subarray(start, position);
						if (encoder.updateSharedData() === false)
							return encoder.encode(value) // re-encode if it fails
						return returnBuffer
					}
					if (encodeOptions & RESET_BUFFER_MODE)
						position = start;
				}
			};
			this.findCommonStringsToPack = () => {
				samplingPackedValues = new Map();
				if (!sharedPackedObjectMap)
					sharedPackedObjectMap = Object.create(null);
				return (options) => {
					let threshold = options && options.threshold || 4;
					let position = this.pack ? options.maxPrivatePackedValues || 16 : 0;
					if (!sharedValues)
						sharedValues = this.sharedValues = [];
					for (let [ key, status ] of samplingPackedValues) {
						if (status.count > threshold) {
							sharedPackedObjectMap[key] = position++;
							sharedValues.push(key);
							hasSharedUpdate = true;
						}
					}
					while (this.saveShared && this.updateSharedData() === false) {}
					samplingPackedValues = null;
				}
			};
			const encode = (value) => {
				if (position > safeEnd)
					target = makeRoom(position);

				var type = typeof value;
				var length;
				if (type === 'string') {
					if (packedObjectMap) {
						let packedPosition = packedObjectMap[value];
						if (packedPosition >= 0) {
							if (packedPosition < 16)
								target[position++] = packedPosition + 0xe0; // simple values, defined in https://www.potaroo.net/ietf/ids/draft-ietf-cbor-packed-03.txt
							else {
								target[position++] = 0xc6; // tag 6 defined in https://www.potaroo.net/ietf/ids/draft-ietf-cbor-packed-03.txt
								if (packedPosition & 1)
									encode((15 - packedPosition) >> 1);
								else
									encode((packedPosition - 16) >> 1);
							}
							return
	/*						} else if (packedStatus.serializationId != serializationId) {
								packedStatus.serializationId = serializationId
								packedStatus.count = 1
								if (options.sharedPack) {
									let sharedCount = packedStatus.sharedCount = (packedStatus.sharedCount || 0) + 1
									if (shareCount > (options.sharedPack.threshold || 5)) {
										let sharedPosition = packedStatus.position = packedStatus.nextSharedPosition
										hasSharedUpdate = true
										if (sharedPosition < 16)
											target[position++] = sharedPosition + 0xc0

									}
								}
							} // else any in-doc incrementation?*/
						} else if (samplingPackedValues && !options.pack) {
							let status = samplingPackedValues.get(value);
							if (status)
								status.count++;
							else
								samplingPackedValues.set(value, {
									count: 1,
								});
						}
					}
					let strLength = value.length;
					if (bundledStrings && strLength >= 4 && strLength < 0x400) {
						if ((bundledStrings.size += strLength) > MAX_BUNDLE_SIZE) {
							let extStart;
							let maxBytes = (bundledStrings[0] ? bundledStrings[0].length * 3 + bundledStrings[1].length : 0) + 10;
							if (position + maxBytes > safeEnd)
								target = makeRoom(position + maxBytes);
							target[position++] = 0xd9; // tag 16-bit
							target[position++] = 0xdf; // tag 0xdff9
							target[position++] = 0xf9;
							// TODO: If we only have one bundle with any string data, only write one string bundle
							target[position++] = bundledStrings.position ? 0x84 : 0x82; // array of 4 or 2 elements depending on if we write bundles
							target[position++] = 0x1a; // 32-bit unsigned int
							extStart = position - start;
							position += 4; // reserve for writing bundle reference
							if (bundledStrings.position) {
								writeBundles(start, encode); // write the last bundles
							}
							bundledStrings = ['', '']; // create new ones
							bundledStrings.size = 0;
							bundledStrings.position = extStart;
						}
						let twoByte = hasNonLatin.test(value);
						bundledStrings[twoByte ? 0 : 1] += value;
						target[position++] = twoByte ? 0xce : 0xcf;
						encode(strLength);
						return
					}
					let headerSize;
					// first we estimate the header size, so we can write to the correct location
					if (strLength < 0x20) {
						headerSize = 1;
					} else if (strLength < 0x100) {
						headerSize = 2;
					} else if (strLength < 0x10000) {
						headerSize = 3;
					} else {
						headerSize = 5;
					}
					let maxBytes = strLength * 3;
					if (position + maxBytes > safeEnd)
						target = makeRoom(position + maxBytes);

					if (strLength < 0x40 || !encodeUtf8) {
						let i, c1, c2, strPosition = position + headerSize;
						for (i = 0; i < strLength; i++) {
							c1 = value.charCodeAt(i);
							if (c1 < 0x80) {
								target[strPosition++] = c1;
							} else if (c1 < 0x800) {
								target[strPosition++] = c1 >> 6 | 0xc0;
								target[strPosition++] = c1 & 0x3f | 0x80;
							} else if (
								(c1 & 0xfc00) === 0xd800 &&
								((c2 = value.charCodeAt(i + 1)) & 0xfc00) === 0xdc00
							) {
								c1 = 0x10000 + ((c1 & 0x03ff) << 10) + (c2 & 0x03ff);
								i++;
								target[strPosition++] = c1 >> 18 | 0xf0;
								target[strPosition++] = c1 >> 12 & 0x3f | 0x80;
								target[strPosition++] = c1 >> 6 & 0x3f | 0x80;
								target[strPosition++] = c1 & 0x3f | 0x80;
							} else {
								target[strPosition++] = c1 >> 12 | 0xe0;
								target[strPosition++] = c1 >> 6 & 0x3f | 0x80;
								target[strPosition++] = c1 & 0x3f | 0x80;
							}
						}
						length = strPosition - position - headerSize;
					} else {
						length = encodeUtf8(value, position + headerSize, maxBytes);
					}

					if (length < 0x18) {
						target[position++] = 0x60 | length;
					} else if (length < 0x100) {
						if (headerSize < 2) {
							target.copyWithin(position + 2, position + 1, position + 1 + length);
						}
						target[position++] = 0x78;
						target[position++] = length;
					} else if (length < 0x10000) {
						if (headerSize < 3) {
							target.copyWithin(position + 3, position + 2, position + 2 + length);
						}
						target[position++] = 0x79;
						target[position++] = length >> 8;
						target[position++] = length & 0xff;
					} else {
						if (headerSize < 5) {
							target.copyWithin(position + 5, position + 3, position + 3 + length);
						}
						target[position++] = 0x7a;
						targetView.setUint32(position, length);
						position += 4;
					}
					position += length;
				} else if (type === 'number') {
					if (!this.alwaysUseFloat && value >>> 0 === value) {// positive integer, 32-bit or less
						// positive uint
						if (value < 0x18) {
							target[position++] = value;
						} else if (value < 0x100) {
							target[position++] = 0x18;
							target[position++] = value;
						} else if (value < 0x10000) {
							target[position++] = 0x19;
							target[position++] = value >> 8;
							target[position++] = value & 0xff;
						} else {
							target[position++] = 0x1a;
							targetView.setUint32(position, value);
							position += 4;
						}
					} else if (!this.alwaysUseFloat && value >> 0 === value) { // negative integer, 31-bit or less
						if (value >= -24) {
							target[position++] = 0x1f - value;
						} else if (value >= -256) {
							target[position++] = 0x38;
							target[position++] = ~value;
						} else if (value >= -65536) {
							target[position++] = 0x39;
							targetView.setUint16(position, ~value);
							position += 2;
						} else {
							target[position++] = 0x3a;
							targetView.setUint32(position, ~value);
							position += 4;
						}
					} else if (!this.alwaysUseFloat && value < 0 && value >= -4294967296 && Math.floor(value) === value) {
						// negative integer, 32-bit or less
						target[position++] = 0x3a;
						targetView.setUint32(position, -1 - value);
						position += 4;
					} else {
						let useFloat32;
						if ((useFloat32 = this.useFloat32) > 0 && value < 0x100000000 && value >= -2147483648) {
							target[position++] = 0xfa;
							targetView.setFloat32(position, value);
							let xShifted;
							if (useFloat32 < 4 ||
									// this checks for rounding of numbers that were encoded in 32-bit float to nearest significant decimal digit that could be preserved
									((xShifted = value * mult10[((target[position] & 0x7f) << 1) | (target[position + 1] >> 7)]) >> 0) === xShifted) {
								position += 4;
								return
							} else
								position--; // move back into position for writing a double
						}
						target[position++] = 0xfb;
						targetView.setFloat64(position, value);
						position += 8;
					}
				} else if (type === 'object') {
					if (!value)
						target[position++] = 0xf6;
					else {
						if (referenceMap) {
							let referee = referenceMap.get(value);
							if (referee) {
								target[position++] = 0xd8;
								target[position++] = 29; // http://cbor.schmorp.de/value-sharing
								target[position++] = 0x19; // 16-bit uint
								if (!referee.references) {
									let idsToInsert = referenceMap.idsToInsert || (referenceMap.idsToInsert = []);
									referee.references = [];
									idsToInsert.push(referee);
								}
								referee.references.push(position - start);
								position += 2; // TODO: also support 32-bit
								return
							} else 
								referenceMap.set(value, { offset: position - start });
						}
						let constructor = value.constructor;
						if (constructor === Object) {
							if (this.skipFunction === true) {
								value = Object.fromEntries([...Object.keys(value).filter(x => typeof value[x] !== "function").map(x => [x, value[x]])]);
							}
							writeObject(value);
						} else if (constructor === Array) {
							length = value.length;
							if (length < 0x18) {
								target[position++] = 0x80 | length;
							} else {
								writeArrayHeader(length);
							}
							for (let i = 0; i < length; i++) {
								encode(value[i]);
							}
						} else if (constructor === Map) {
							if (this.mapsAsObjects ? this.useTag259ForMaps !== false : this.useTag259ForMaps) {
								// use Tag 259 (https://github.com/shanewholloway/js-cbor-codec/blob/master/docs/CBOR-259-spec--explicit-maps.md) for maps if the user wants it that way
								target[position++] = 0xd9;
								target[position++] = 1;
								target[position++] = 3;
							}
							length = value.size;
							if (length < 0x18) {
								target[position++] = 0xa0 | length;
							} else if (length < 0x100) {
								target[position++] = 0xb8;
								target[position++] = length;
							} else if (length < 0x10000) {
								target[position++] = 0xb9;
								target[position++] = length >> 8;
								target[position++] = length & 0xff;
							} else {
								target[position++] = 0xba;
								targetView.setUint32(position, length);
								position += 4;
							}
							if (encoder.keyMap) { 
								for (let [ key, entryValue ] of value) {
									encode(encoder.encodeKey(key));
									encode(entryValue);
								} 
							} else { 
								for (let [ key, entryValue ] of value) {
									encode(key); 
									encode(entryValue);
								} 	
							}
						} else {
							for (let i = 0, l = extensions.length; i < l; i++) {
								let extensionClass = extensionClasses[i];
								if (value instanceof extensionClass) {
									let extension = extensions[i];
									let tag = extension.tag;
									if (tag == undefined)
										tag = extension.getTag && extension.getTag.call(this, value);
									if (tag < 0x18) {
										target[position++] = 0xc0 | tag;
									} else if (tag < 0x100) {
										target[position++] = 0xd8;
										target[position++] = tag;
									} else if (tag < 0x10000) {
										target[position++] = 0xd9;
										target[position++] = tag >> 8;
										target[position++] = tag & 0xff;
									} else if (tag > -1) {
										target[position++] = 0xda;
										targetView.setUint32(position, tag);
										position += 4;
									} // else undefined, don't write tag
									extension.encode.call(this, value, encode, makeRoom);
									return
								}
							}
							if (value[Symbol.iterator]) {
								if (throwOnIterable) {
									let error = new Error('Iterable should be serialized as iterator');
									error.iteratorNotHandled = true;
									throw error;
								}
								target[position++] = 0x9f; // indefinite length array
								for (let entry of value) {
									encode(entry);
								}
								target[position++] = 0xff; // stop-code
								return
							}
							if (value[Symbol.asyncIterator] || isBlob(value)) {
								let error = new Error('Iterable/blob should be serialized as iterator');
								error.iteratorNotHandled = true;
								throw error;
							}
							if (this.useToJSON && value.toJSON) {
								const json = value.toJSON();
								// if for some reason value.toJSON returns itself it'll loop forever
								if (json !== value)
									return encode(json)
							}

							// no extension found, write as a plain object
							writeObject(value);
						}
					}
				} else if (type === 'boolean') {
					target[position++] = value ? 0xf5 : 0xf4;
				} else if (type === 'bigint') {
					if (value < (BigInt(1)<<BigInt(64)) && value >= 0) {
						// use an unsigned int as long as it fits
						target[position++] = 0x1b;
						targetView.setBigUint64(position, value);
					} else if (value > -(BigInt(1)<<BigInt(64)) && value < 0) {
						// if we can fit an unsigned int, use that
						target[position++] = 0x3b;
						targetView.setBigUint64(position, -value - BigInt(1));
					} else {
						// overflow
						if (this.largeBigIntToFloat) {
							target[position++] = 0xfb;
							targetView.setFloat64(position, Number(value));
						} else {
							if (value >= BigInt(0))
								target[position++] = 0xc2; // tag 2
							else {
								target[position++] = 0xc3; // tag 2
								value = BigInt(-1) - value;
							}
							let bytes = [];
							while (value) {
								bytes.push(Number(value & BigInt(0xff)));
								value >>= BigInt(8);
							}
							writeBuffer(new Uint8Array(bytes.reverse()), makeRoom);
							return;
						}
					}
					position += 8;
				} else if (type === 'undefined') {
					target[position++] = 0xf7;
				} else {
					throw new Error('Unknown type: ' + type)
				}
			};

			const writeObject = this.useRecords === false ? this.variableMapSize ? (object) => {
				// this method is slightly slower, but generates "preferred serialization" (optimally small for smaller objects)
				let keys = Object.keys(object);
				let vals = Object.values(object);
				let length = keys.length;
				if (length < 0x18) {
					target[position++] = 0xa0 | length;
				} else if (length < 0x100) {
					target[position++] = 0xb8;
					target[position++] = length;
				} else if (length < 0x10000) {
					target[position++] = 0xb9;
					target[position++] = length >> 8;
					target[position++] = length & 0xff;
				} else {
					target[position++] = 0xba;
					targetView.setUint32(position, length);
					position += 4;
				}
				if (encoder.keyMap) { 
					for (let i = 0; i < length; i++) {
						encode(encoder.encodeKey(keys[i]));
						encode(vals[i]);
					}
				} else {
					for (let i = 0; i < length; i++) {
						encode(keys[i]);
						encode(vals[i]);
					}
				}
			} :
			(object) => {
				target[position++] = 0xb9; // always use map 16, so we can preallocate and set the length afterwards
				let objectOffset = position - start;
				position += 2;
				let size = 0;
				if (encoder.keyMap) {
					for (let key in object) if (typeof object.hasOwnProperty !== 'function' || object.hasOwnProperty(key)) {
						encode(encoder.encodeKey(key));
						encode(object[key]);
						size++;
					}
				} else { 
					for (let key in object) if (typeof object.hasOwnProperty !== 'function' || object.hasOwnProperty(key)) {
							encode(key);
							encode(object[key]);
						size++;
					}
				}
				target[objectOffset++ + start] = size >> 8;
				target[objectOffset + start] = size & 0xff;
			} :
			(object, skipValues) => {
				let nextTransition, transition = structures.transitions || (structures.transitions = Object.create(null));
				let newTransitions = 0;
				let length = 0;
				let parentRecordId;
				let keys;
				if (this.keyMap) {
					keys = Object.keys(object).map(k => this.encodeKey(k));
					length = keys.length;
					for (let i = 0; i < length; i++) {
						let key = keys[i];
						nextTransition = transition[key];
						if (!nextTransition) {
							nextTransition = transition[key] = Object.create(null);
							newTransitions++;
						}
						transition = nextTransition;
					}				
				} else {
					for (let key in object) if (typeof object.hasOwnProperty !== 'function' || object.hasOwnProperty(key)) {
						nextTransition = transition[key];
						if (!nextTransition) {
							if (transition[RECORD_SYMBOL] & 0x100000) {// this indicates it is a brancheable/extendable terminal node, so we will use this record id and extend it
								parentRecordId = transition[RECORD_SYMBOL] & 0xffff;
							}
							nextTransition = transition[key] = Object.create(null);
							newTransitions++;
						}
						transition = nextTransition;
						length++;
					}
				}
				let recordId = transition[RECORD_SYMBOL];
				if (recordId !== undefined) {
					recordId &= 0xffff;
					target[position++] = 0xd9;
					target[position++] = (recordId >> 8) | 0xe0;
					target[position++] = recordId & 0xff;
				} else {
					if (!keys)
						keys = transition.__keys__ || (transition.__keys__ = Object.keys(object));
					if (parentRecordId === undefined) {
						recordId = structures.nextId++;
						if (!recordId) {
							recordId = 0;
							structures.nextId = 1;
						}
						if (recordId >= MAX_STRUCTURES) {// cycle back around
							structures.nextId = (recordId = maxSharedStructures) + 1;
						}
					} else {
						recordId = parentRecordId;
					}
					structures[recordId] = keys;
					if (recordId < maxSharedStructures) {
						target[position++] = 0xd9;
						target[position++] = (recordId >> 8) | 0xe0;
						target[position++] = recordId & 0xff;
						transition = structures.transitions;
						for (let i = 0; i < length; i++) {
							if (transition[RECORD_SYMBOL] === undefined || (transition[RECORD_SYMBOL] & 0x100000))
								transition[RECORD_SYMBOL] = recordId;
							transition = transition[keys[i]];
						}
						transition[RECORD_SYMBOL] = recordId | 0x100000; // indicates it is a extendable terminal
						hasSharedUpdate = true;
					} else {
						transition[RECORD_SYMBOL] = recordId;
						targetView.setUint32(position, 0xd9dfff00); // tag two byte, then record definition id
						position += 3;
						if (newTransitions)
							transitionsCount += serializationsSinceTransitionRebuild * newTransitions;
						// record the removal of the id, we can maintain our shared structure
						if (recordIdsToRemove.length >= MAX_STRUCTURES - maxSharedStructures)
							recordIdsToRemove.shift()[RECORD_SYMBOL] = undefined; // we are cycling back through, and have to remove old ones
						recordIdsToRemove.push(transition);
						writeArrayHeader(length + 2);
						encode(0xe000 + recordId);
						encode(keys);
						if (skipValues) return; // special exit for iterator
						for (let key in object)
							if (typeof object.hasOwnProperty !== 'function' || object.hasOwnProperty(key))
								encode(object[key]);
						return
					}
				}
				if (length < 0x18) { // write the array header
					target[position++] = 0x80 | length;
				} else {
					writeArrayHeader(length);
				}
				if (skipValues) return; // special exit for iterator
				for (let key in object)
					if (typeof object.hasOwnProperty !== 'function' || object.hasOwnProperty(key))
						encode(object[key]);
			};
			const makeRoom = (end) => {
				let newSize;
				if (end > 0x1000000) {
					// special handling for really large buffers
					if ((end - start) > MAX_BUFFER_SIZE)
						throw new Error('Encoded buffer would be larger than maximum buffer size')
					newSize = Math.min(MAX_BUFFER_SIZE,
						Math.round(Math.max((end - start) * (end > 0x4000000 ? 1.25 : 2), 0x400000) / 0x1000) * 0x1000);
				} else // faster handling for smaller buffers
					newSize = ((Math.max((end - start) << 2, target.length - 1) >> 12) + 1) << 12;
				let newBuffer = new ByteArrayAllocate(newSize);
				targetView = new DataView(newBuffer.buffer, 0, newSize);
				if (target.copy)
					target.copy(newBuffer, 0, start, end);
				else
					newBuffer.set(target.slice(start, end));
				position -= start;
				start = 0;
				safeEnd = newBuffer.length - 10;
				return target = newBuffer
			};
			let chunkThreshold = 100;
			let continuedChunkThreshold = 1000;
			this.encodeAsIterable = function(value, options) {
				return startEncoding(value, options, encodeObjectAsIterable);
			};
			this.encodeAsAsyncIterable = function(value, options) {
				return startEncoding(value, options, encodeObjectAsAsyncIterable);
			};

			function* encodeObjectAsIterable(object, iterateProperties, finalIterable) {
				let constructor = object.constructor;
				if (constructor === Object) {
					let useRecords = encoder.useRecords !== false;
					if (useRecords)
						writeObject(object, true); // write the record identifier
					else
						writeEntityLength(Object.keys(object).length, 0xa0);
					for (let key in object) {
						let value = object[key];
						if (!useRecords) encode(key);
						if (value && typeof value === 'object') {
							if (iterateProperties[key])
								yield* encodeObjectAsIterable(value, iterateProperties[key]);
							else
								yield* tryEncode(value, iterateProperties, key);
						} else encode(value);
					}
				} else if (constructor === Array) {
					let length = object.length;
					writeArrayHeader(length);
					for (let i = 0; i < length; i++) {
						let value = object[i];
						if (value && (typeof value === 'object' || position - start > chunkThreshold)) {
							if (iterateProperties.element)
								yield* encodeObjectAsIterable(value, iterateProperties.element);
							else
								yield* tryEncode(value, iterateProperties, 'element');
						} else encode(value);
					}
				} else if (object[Symbol.iterator] && !object.buffer) { // iterator, but exclude typed arrays
					target[position++] = 0x9f; // start indefinite array
					for (let value of object) {
						if (value && (typeof value === 'object' || position - start > chunkThreshold)) {
							if (iterateProperties.element)
								yield* encodeObjectAsIterable(value, iterateProperties.element);
							else
								yield* tryEncode(value, iterateProperties, 'element');
						} else encode(value);
					}
					target[position++] = 0xff; // stop byte
				} else if (isBlob(object)){
					writeEntityLength(object.size, 0x40); // encode as binary data
					yield target.subarray(start, position);
					yield object; // directly return blobs, they have to be encoded asynchronously
					restartEncoding();
				} else if (object[Symbol.asyncIterator]) {
					target[position++] = 0x9f; // start indefinite array
					yield target.subarray(start, position);
					yield object; // directly return async iterators, they have to be encoded asynchronously
					restartEncoding();
					target[position++] = 0xff; // stop byte
				} else {
					encode(object);
				}
				if (finalIterable && position > start) yield target.subarray(start, position);
				else if (position - start > chunkThreshold) {
					yield target.subarray(start, position);
					restartEncoding();
				}
			}
			function* tryEncode(value, iterateProperties, key) {
				let restart = position - start;
				try {
					encode(value);
					if (position - start > chunkThreshold) {
						yield target.subarray(start, position);
						restartEncoding();
					}
				} catch (error) {
					if (error.iteratorNotHandled) {
						iterateProperties[key] = {};
						position = start + restart; // restart our position so we don't have partial data from last encode
						yield* encodeObjectAsIterable.call(this, value, iterateProperties[key]);
					} else throw error;
				}
			}
			function restartEncoding() {
				chunkThreshold = continuedChunkThreshold;
				encoder.encode(null, THROW_ON_ITERABLE); // restart encoding
			}
			function startEncoding(value, options, encodeIterable) {
				if (options && options.chunkThreshold) // explicitly specified chunk sizes
					chunkThreshold = continuedChunkThreshold = options.chunkThreshold;
				else // we start with a smaller threshold to get initial bytes sent quickly
					chunkThreshold = 100;
				if (value && typeof value === 'object') {
					encoder.encode(null, THROW_ON_ITERABLE); // start encoding
					return encodeIterable(value, encoder.iterateProperties || (encoder.iterateProperties = {}), true);
				}
				return [encoder.encode(value)];
			}

			async function* encodeObjectAsAsyncIterable(value, iterateProperties) {
				for (let encodedValue of encodeObjectAsIterable(value, iterateProperties, true)) {
					let constructor = encodedValue.constructor;
					if (constructor === ByteArray || constructor === Uint8Array)
						yield encodedValue;
					else if (isBlob(encodedValue)) {
						let reader = encodedValue.stream().getReader();
						let next;
						while (!(next = await reader.read()).done) {
							yield next.value;
						}
					} else if (encodedValue[Symbol.asyncIterator]) {
						for await (let asyncValue of encodedValue) {
							restartEncoding();
							if (asyncValue)
								yield* encodeObjectAsAsyncIterable(asyncValue, iterateProperties.async || (iterateProperties.async = {}));
							else yield encoder.encode(asyncValue);
						}
					} else {
						yield encodedValue;
					}
				}
			}
		}
		useBuffer(buffer) {
			// this means we are finished using our own buffer and we can write over it safely
			target = buffer;
			targetView = new DataView(target.buffer, target.byteOffset, target.byteLength);
			position = 0;
		}
		clearSharedData() {
			if (this.structures)
				this.structures = [];
			if (this.sharedValues)
				this.sharedValues = undefined;
		}
		updateSharedData() {
			let lastVersion = this.sharedVersion || 0;
			this.sharedVersion = lastVersion + 1;
			let structuresCopy = this.structures.slice(0);
			let sharedData = new SharedData(structuresCopy, this.sharedValues, this.sharedVersion);
			let saveResults = this.saveShared(sharedData,
					existingShared => (existingShared && existingShared.version || 0) == lastVersion);
			if (saveResults === false) {
				// get updated structures and try again if the update failed
				sharedData = this.getShared() || {};
				this.structures = sharedData.structures || [];
				this.sharedValues = sharedData.packedValues;
				this.sharedVersion = sharedData.version;
				this.structures.nextId = this.structures.length;
			} else {
				// restore structures
				structuresCopy.forEach((structure, i) => this.structures[i] = structure);
			}
			// saveShared may fail to write and reload, or may have reloaded to check compatibility and overwrite saved data, either way load the correct shared data
			return saveResults
		}
	}
	function writeEntityLength(length, majorValue) {
		if (length < 0x18)
			target[position++] = majorValue | length;
		else if (length < 0x100) {
			target[position++] = majorValue | 0x18;
			target[position++] = length;
		} else if (length < 0x10000) {
			target[position++] = majorValue | 0x19;
			target[position++] = length >> 8;
			target[position++] = length & 0xff;
		} else {
			target[position++] = majorValue | 0x1a;
			targetView.setUint32(position, length);
			position += 4;
		}

	}
	class SharedData {
		constructor(structures, values, version) {
			this.structures = structures;
			this.packedValues = values;
			this.version = version;
		}
	}

	function writeArrayHeader(length) {
		if (length < 0x18)
			target[position++] = 0x80 | length;
		else if (length < 0x100) {
			target[position++] = 0x98;
			target[position++] = length;
		} else if (length < 0x10000) {
			target[position++] = 0x99;
			target[position++] = length >> 8;
			target[position++] = length & 0xff;
		} else {
			target[position++] = 0x9a;
			targetView.setUint32(position, length);
			position += 4;
		}
	}

	const BlobConstructor = typeof Blob === 'undefined' ? function(){} : Blob;
	function isBlob(object) {
		if (object instanceof BlobConstructor)
			return true;
		let tag = object[Symbol.toStringTag];
		return tag === 'Blob' || tag === 'File';
	}
	function findRepetitiveStrings(value, packedValues) {
		switch(typeof value) {
			case 'string':
				if (value.length > 3) {
					if (packedValues.objectMap[value] > -1 || packedValues.values.length >= packedValues.maxValues)
						return
					let packedStatus = packedValues.get(value);
					if (packedStatus) {
						if (++packedStatus.count == 2) {
							packedValues.values.push(value);
						}
					} else {
						packedValues.set(value, {
							count: 1,
						});
						if (packedValues.samplingPackedValues) {
							let status = packedValues.samplingPackedValues.get(value);
							if (status)
								status.count++;
							else
								packedValues.samplingPackedValues.set(value, {
									count: 1,
								});
						}
					}
				}
				break
			case 'object':
				if (value) {
					if (value instanceof Array) {
						for (let i = 0, l = value.length; i < l; i++) {
							findRepetitiveStrings(value[i], packedValues);
						}

					} else {
						let includeKeys = !packedValues.encoder.useRecords;
						for (var key in value) {
							if (value.hasOwnProperty(key)) {
								if (includeKeys)
									findRepetitiveStrings(key, packedValues);
								findRepetitiveStrings(value[key], packedValues);
							}
						}
					}
				}
				break
			case 'function': console.log(value);
		}
	}
	const isLittleEndianMachine = new Uint8Array(new Uint16Array([1]).buffer)[0] == 1;
	extensionClasses = [ Date, Set, Error, RegExp, Tag, ArrayBuffer,
		Uint8Array, Uint8ClampedArray, Uint16Array, Uint32Array,
		typeof BigUint64Array == 'undefined' ? function() {} : BigUint64Array, Int8Array, Int16Array, Int32Array,
		typeof BigInt64Array == 'undefined' ? function() {} : BigInt64Array,
		Float32Array, Float64Array, SharedData ];

	//Object.getPrototypeOf(Uint8Array.prototype).constructor /*TypedArray*/
	extensions = [{ // Date
		tag: 1,
		encode(date, encode) {
			let seconds = date.getTime() / 1000;
			if ((this.useTimestamp32 || date.getMilliseconds() === 0) && seconds >= 0 && seconds < 0x100000000) {
				// Timestamp 32
				target[position++] = 0x1a;
				targetView.setUint32(position, seconds);
				position += 4;
			} else {
				// Timestamp float64
				target[position++] = 0xfb;
				targetView.setFloat64(position, seconds);
				position += 8;
			}
		}
	}, { // Set
		tag: 258, // https://github.com/input-output-hk/cbor-sets-spec/blob/master/CBOR_SETS.md
		encode(set, encode) {
			let array = Array.from(set);
			encode(array);
		}
	}, { // Error
		tag: 27, // http://cbor.schmorp.de/generic-object
		encode(error, encode) {
			encode([ error.name, error.message ]);
		}
	}, { // RegExp
		tag: 27, // http://cbor.schmorp.de/generic-object
		encode(regex, encode) {
			encode([ 'RegExp', regex.source, regex.flags ]);
		}
	}, { // Tag
		getTag(tag) {
			return tag.tag
		},
		encode(tag, encode) {
			encode(tag.value);
		}
	}, { // ArrayBuffer
		encode(arrayBuffer, encode, makeRoom) {
			writeBuffer(arrayBuffer, makeRoom);
		}
	}, { // Uint8Array
		getTag(typedArray) {
			if (typedArray.constructor === Uint8Array) {
				if (this.tagUint8Array || hasNodeBuffer && this.tagUint8Array !== false)
					return 64;
			} // else no tag
		},
		encode(typedArray, encode, makeRoom) {
			writeBuffer(typedArray, makeRoom);
		}
	},
		typedArrayEncoder(68, 1),
		typedArrayEncoder(69, 2),
		typedArrayEncoder(70, 4),
		typedArrayEncoder(71, 8),
		typedArrayEncoder(72, 1),
		typedArrayEncoder(77, 2),
		typedArrayEncoder(78, 4),
		typedArrayEncoder(79, 8),
		typedArrayEncoder(85, 4),
		typedArrayEncoder(86, 8),
	{
		encode(sharedData, encode) { // write SharedData
			let packedValues = sharedData.packedValues || [];
			let sharedStructures = sharedData.structures || [];
			if (packedValues.values.length > 0) {
				target[position++] = 0xd8; // one-byte tag
				target[position++] = 51; // tag 51 for packed shared structures https://www.potaroo.net/ietf/ids/draft-ietf-cbor-packed-03.txt
				writeArrayHeader(4);
				let valuesArray = packedValues.values;
				encode(valuesArray);
				writeArrayHeader(0); // prefixes
				writeArrayHeader(0); // suffixes
				packedObjectMap = Object.create(sharedPackedObjectMap || null);
				for (let i = 0, l = valuesArray.length; i < l; i++) {
					packedObjectMap[valuesArray[i]] = i;
				}
			}
			if (sharedStructures) {
				targetView.setUint32(position, 0xd9dffe00);
				position += 3;
				let definitions = sharedStructures.slice(0);
				definitions.unshift(0xe000);
				definitions.push(new Tag(sharedData.version, 0x53687264));
				encode(definitions);
			} else
				encode(new Tag(sharedData.version, 0x53687264));
			}
		}];
	function typedArrayEncoder(tag, size) {
		if (!isLittleEndianMachine && size > 1)
			tag -= 4; // the big endian equivalents are 4 less
		return {
			tag: tag,
			encode: function writeExtBuffer(typedArray, encode) {
				let length = typedArray.byteLength;
				let offset = typedArray.byteOffset || 0;
				let buffer = typedArray.buffer || typedArray;
				encode(hasNodeBuffer ? Buffer$1.from(buffer, offset, length) :
					new Uint8Array(buffer, offset, length));
			}
		}
	}
	function writeBuffer(buffer, makeRoom) {
		let length = buffer.byteLength;
		if (length < 0x18) {
			target[position++] = 0x40 + length;
		} else if (length < 0x100) {
			target[position++] = 0x58;
			target[position++] = length;
		} else if (length < 0x10000) {
			target[position++] = 0x59;
			target[position++] = length >> 8;
			target[position++] = length & 0xff;
		} else {
			target[position++] = 0x5a;
			targetView.setUint32(position, length);
			position += 4;
		}
		if (position + length >= target.length) {
			makeRoom(position + length);
		}
		// if it is already a typed array (has an ArrayBuffer), use that, but if it is an ArrayBuffer itself,
		// must wrap it to set it.
		target.set(buffer.buffer ? buffer : new Uint8Array(buffer), position);
		position += length;
	}

	function insertIds(serialized, idsToInsert) {
		// insert the ids that need to be referenced for structured clones
		let nextId;
		let distanceToMove = idsToInsert.length * 2;
		let lastEnd = serialized.length - distanceToMove;
		idsToInsert.sort((a, b) => a.offset > b.offset ? 1 : -1);
		for (let id = 0; id < idsToInsert.length; id++) {
			let referee = idsToInsert[id];
			referee.id = id;
			for (let position of referee.references) {
				serialized[position++] = id >> 8;
				serialized[position] = id & 0xff;
			}
		}
		while (nextId = idsToInsert.pop()) {
			let offset = nextId.offset;
			serialized.copyWithin(offset + distanceToMove, offset, lastEnd);
			distanceToMove -= 2;
			let position = offset + distanceToMove;
			serialized[position++] = 0xd8;
			serialized[position++] = 28; // http://cbor.schmorp.de/value-sharing
			lastEnd = offset;
		}
		return serialized
	}
	function writeBundles(start, encode) {
		targetView.setUint32(bundledStrings.position + start, position - bundledStrings.position - start + 1); // the offset to bundle
		let writeStrings = bundledStrings;
		bundledStrings = null;
		encode(writeStrings[0]);
		encode(writeStrings[1]);
	}
	let defaultEncoder = new Encoder({ useRecords: false });
	const encode = defaultEncoder.encode;
	defaultEncoder.encodeAsIterable;
	defaultEncoder.encodeAsAsyncIterable;
	const REUSE_BUFFER_MODE = 512;
	const RESET_BUFFER_MODE = 1024;
	const THROW_ON_ITERABLE = 2048;

	// ---------------------------------------------------------------------------
	// Sender
	// ---------------------------------------------------------------------------
	class WebSocketBinarySender {
	    constructor(rws, sessionId) {
	        this._sessionId = null;
	        /** sessionId → sender mapping for server-side multi-connection routing */
	        this.sessionSenderMap = new Map();
	        this.rws = rws;
	        this._sessionId = sessionId !== null && sessionId !== void 0 ? sessionId : null;
	    }
	    get sessionId() {
	        return typeof this._sessionId === 'function' ? this._sessionId() : this._sessionId;
	    }
	    set sessionId(val) {
	        this._sessionId = val;
	    }
	    send(message) {
	        const sid = this.sessionId;
	        if (sid && !message.meta.sessionId) {
	            message.meta.sessionId = sid;
	        }
	        this.rws.send(encode(message));
	    }
	}
	// ---------------------------------------------------------------------------
	// Client side
	// ---------------------------------------------------------------------------
	/**
	 * Connect to a WebSocket-based RPC server with automatic reconnection.
	 *
	 * Returns `[client, mainProxy]`.
	 *
	 * Uses CBOR binary encoding for all messages.
	 *
	 * Usage::
	 *
	 *     const [client, main] = await createMain('myClient', 'localhost', 8765);
	 *     const result = await main.hello('world');
	 */
	async function createMain(hostId, host = "localhost", port = 8765, path = "/") {
	    const url = `ws://${host}:${port}${path}`;
	    const rws = new ReconnectingWebSocket(url);
	    rws.binaryType = "arraybuffer";
	    const client = new Client(hostId);
	    const messageReceiver = new MessageReceiver(hostId);
	    const sender = new WebSocketBinarySender(rws);
	    // setSender accepts a useSender function
	    client.setSender(() => sender);
	    rws.onmessage = (event) => {
	        const data = event.data;
	        const bytes = data instanceof ArrayBuffer ? new Uint8Array(data) : data;
	        const message = decode(bytes);
	        // Extract sessionId from meta and update sender
	        const meta = message.meta || {};
	        if (meta.sessionId) {
	            sender.sessionId = meta.sessionId;
	        }
	        messageReceiver.onReceiveMessage(message, client);
	    };
	    // Wait for connection to be established before getting main
	    await new Promise((resolve, reject) => {
	        rws.onopen = () => resolve();
	        rws.onerror = (e) => reject(e);
	    });
	    const main = await client.getMain();
	    return [client, main];
	}

	/*
	 * pushFile utility - uploads resources to local cache server via WebSocket RPC
	 * Uses @xuri-rpc/websocket-sender to communicate with cache_server.py
	 * RPC server runs on ws://localhost:8081/
	 * HTTP file server runs on http://cache.stellar:8080/
	 */


	const RPC_HOST = "localhost";
	const RPC_PORT = 8081;
	const RPC_PATH = "/";
	const HOST_ID = "singlefile-cache-client";
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
		const name = generateName(originalURL);
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


	const singlefile = globalThis.singlefile;
	const parsers = new Map(), pendingData = new Map();

	browser.runtime.onMessage.addListener(async ({ method, truncated, finished, requestId, url, data, mimeType, options, width, height, tabId }) => {
		if (method == "processPage") {
			options.pushFile = pushFile;
			const result = await singlefile.getPageData(options, { fetch }, null, null);
			const blob = new Blob([typeof result.content == "string" ? result.content : new Uint8Array(result.content)], { type: result.mimeType });
			return {
				url: URL.createObjectURL(blob),
				archiveTime: result.archiveTime,
				doctype: result.doctype,
				filename: result.filename,
				title: result.title
			};
		}
		if (method == "compressPage") {
			let parser = parsers.get(tabId);
			if (!parser) {
				parser = getParser();
				parsers.set(tabId, parser);
			}
			if (data) {
				await parser.next(new Uint8Array(data));
				return {};
			} else {
				const result = await parser.next();
				parsers.delete(tabId);
				const pageData = result.value;
				const blob = await singlefile.processors.compression.process(pageData, options);
				return URL.createObjectURL(blob);
			}
		}
		if (method == "getBlobURL") {
			const options = {};
			if (mimeType) {
				options.type = mimeType;
			}
			const dataArray = handleDataRequest({ requestId, truncated, finished, data });
			if (dataArray) {
				return URL.createObjectURL(new Blob(dataArray, options));
			} else {
				return {};
			}
		}
		if (method == "revokeObjectURL") {
			URL.revokeObjectURL(url);
			return {};
		}
		if (method == "getImageData") {
			const image = new Image();
			await new Promise((resolve, reject) => {
				image.onload = resolve;
				image.onerror = event => reject(new Error(event.detail));
				image.src = url;
			});
			const canvas = document.createElement("canvas");
			canvas.width = width;
			canvas.height = height;
			const context = canvas.getContext("2d");
			context.drawImage(image, 0, 0, width, height);
			const { data } = await context.getImageData(0, 0, width, height);
			return {
				url: URL.createObjectURL(new Blob([data]))
			};
		}
		if (method == "saveToClipboard") {
			const dataArray = handleDataRequest({ requestId, truncated, finished, data });
			if (dataArray) {
				const data = new Uint8Array(dataArray.map(data => data.length).reduce((total, length) => total + length));
				for (let i = 0, offset = 0; i < dataArray.length; i++) {
					data.set(dataArray[i], offset);
					offset += dataArray[i].length;
				}
				saveToClipboard({ content: new TextDecoder().decode(data), mimeType });
			}
			return {};
		}
	});

	function saveToClipboard(pageData) {
		const command = "copy";
		document.addEventListener(command, listener);
		document.execCommand(command);
		document.removeEventListener(command, listener);

		function listener(event) {
			event.clipboardData.setData(pageData.mimeType, pageData.content);
			event.clipboardData.setData("text/plain", pageData.content);
			event.preventDefault();
		}
	}

	function fetch(url, options = {}) {
		return new Promise((resolve, reject) => {
			const xhrRequest = new XMLHttpRequest();
			xhrRequest.withCredentials = true;
			xhrRequest.responseType = "arraybuffer";
			xhrRequest.onerror = event => reject(new Error(event.detail));
			xhrRequest.onreadystatechange = () => {
				if (xhrRequest.readyState == XMLHttpRequest.DONE) {
					resolve({
						status: xhrRequest.status,
						headers: {
							get: name => xhrRequest.getResponseHeader(name)
						},
						arrayBuffer: async () => xhrRequest.response
					});
				}
			};
			xhrRequest.open("GET", url, true);
			if (options.headers) {
				for (const entry of Object.entries(options.headers)) {
					xhrRequest.setRequestHeader(entry[0], entry[1]);
				}
			}
			xhrRequest.send();
		});
	}

	function handleDataRequest({ requestId, truncated, finished, data }) {
		let dataArray;
		if (truncated) {
			dataArray = pendingData.get(requestId);
			if (!dataArray) {
				dataArray = [];
				pendingData.set(requestId, dataArray);
			}
			dataArray.push(new Uint8Array(data));
			if (finished) {
				pendingData.delete(requestId);
			}
		} else if (data) {
			dataArray = [new Uint8Array(data)];
		}
		if (!truncated || finished) {
			return dataArray;
		}
	}

})();
