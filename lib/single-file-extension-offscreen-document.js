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

	const textEncoder = new TextEncoder();
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
		const encodedString = textEncoder.encode(string);
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

	/*
	 * pushFile utility - uploads resources to local cache server
	 * Based on cache_server.py API:
	 *   POST http://localhost:8080/cache/upload?name=<name>&mime=<mime>
	 *   Returns: { url, hash, name } where url is http://cache.stellar:8080/<filename>
	 */

	const CACHE_SERVER_URL = "http://localhost:8080";

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
		const name = generateName(originalURL);
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
			const result = await singlefile.getPageData(options, { fetch: fetch$1 }, null, null);
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

	function fetch$1(url, options = {}) {
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
