// Copyright (c) Cognitect, Inc.
// All rights reserved.

"use strict";

goog.provide("com.cognitect.transit");
goog.require("com.cognitect.transit.impl.reader");
goog.require("com.cognitect.transit.impl.writer");
goog.require("com.cognitect.transit.types");
goog.require("com.cognitect.transit.eq");
goog.require("com.cognitect.transit.impl.decoder");

/** @define {boolean} */
var NODE_TARGET = false;

/** @define {boolean} */
var BROWSER_TARGET = false;

goog.scope(function() {

/**
 * @class transit
 */
var transit = com.cognitect.transit;

var reader  = com.cognitect.transit.impl.reader,
    writer  = com.cognitect.transit.impl.writer,
    decoder = com.cognitect.transit.impl.decoder,
    types   = com.cognitect.transit.types,
    eq      = com.cognitect.transit.eq;

/**
 * Create a transit reader instance.
 * @method transit.reader
 * @param {string|null} type type of reader to construct.
 *     Default to "json". For verbose mode supply "json-verbose".
 * @param {Object|null} opts reader options. A JavaScript object to
 *     customize the writer Valid entries include "defaultDecoder",
 *     and "decoders". "defaultDecoder" should be JavaScript function
 *     taking two arguments, the first is the tag, the second the
 *     value. "decoders" should be an object of tags to handle. The
 *     values are functions that will receive the value of matched
 *     tag.
 * @return {transit.reader} A transit reader.
 */
transit.reader = function(type, opts) {
    if(type === "json" || type === "json-verbose" || type == null) {
        type = "json";
        var unmarshaller = new reader.JSONUnmarshaller(opts);
        return new reader.Reader(unmarshaller, opts);
    } else {
        throw new Error("Cannot create reader of type " + type);
    }
};

/**
 * Create a transit writer instance.
 * @method transit.writer
 * @param {String|null} type type of writer to construct.
 *     Defaults to "json". For verbose mode supply "json-verbose".
 * @param {Object|null} opts writer options. A JavaScript object to
 *     customize the writer. Takes "handlers", a JavaScript array containing
 *     and even number of entries. Every two entries should be a pair - a
 *     JavaScript constructor and transit writer handler instance.
 * @return {transit.writer} A transit writer.
 */
transit.writer = function(type, opts) {
    if(type === "json" || type === "json-verbose" || type == null) {
        if(type === "json-verbose") {
            if(opts == null) opts = {};
            opts["verbose"] = true;
        }
        type = "json";
        var marshaller = new writer.JSONMarshaller(opts);
        return new writer.Writer(marshaller, opts);
    } else {
        var err = new Error("Type must be \"json\"");
        err.data = {type: type};
        throw err;
    }
};

/**
 * Create a transit writer handler.
 * @method transit.makeHandler
 * @param {Object} obj An object containing 3 functions, tag, rep and stringRep.
 *    "tag" should return a string representing the tag to be written on the wire.
 *    "rep" should return the representation on the wire. "stringRep" is should return
 *    the string representation of the value.
 * @return {transit.handler} A transit write handler.
 */
transit.makeHandler = function(obj) {
    var Handler = function(){};
    Handler.prototype.tag = obj["tag"];
    Handler.prototype.rep = obj["rep"];
    Handler.prototype.stringRep = obj["stringRep"];
    return new Handler();
};

transit.makeBuilder = function(obj) {
    var Builder = function(){};
    Builder.prototype.init = obj["init"];
    Builder.prototype.add = obj["add"];
    Builder.prototype.finalize = obj["finalize"];
    return new Builder();
};

/**
 * Create a transit date.
 * @method transit.date
 * @param {Number|String} A number or string representing milliseconds since epoch.
 * @return {Date} A JavaScript Date.
 */
transit.date = types.date;

/**
 * Create a transit 64bit integer. Will return a JavaScript
 * number if a string that represents an integer value in the 53bit
 * range.
 * @method transit.integer
 * @param {Number} s A string representing an integer in the 64bit range.
 * @return {transit.integer} A 64bit long.
 */
transit.integer = types.intValue;

/**
 * Test if an object is a transit 64 bit integer.
 * @method transit.isInteger
 * @params {Object} x Any JavaScript value.
 * @return {Boolean} true if the value is a transit 64bit integer, false otherwise.
 */
transit.isInteger = types.intValue;

/**
 * Create transit UUID from high and low 64 bits. These integer values
 * can be constructed with transit.integer.
 * @method transit.uuid
 * @param {transit.integer} high The high 64 bits.
 * @param {transit.integer} low The low 64 bits.
 * @return {transit.uuid} A transit UUID.
 */
transit.uuid = types.uuid;

/**
 * Test if an object is a transit UUID.
 * @method transit.isUUID
 * @param {Object} x Any JavaScript value.
 * @return {Boolean} true if the vlaue is a transit UUID instance, false otherwise.
 */
transit.isUUID = types.isUUID;

/**
 * Create a transit big decimal.
 * @method transit.bigdec
 * @param {String} s A string representing an arbitrary precisions decimal value.
 * @return {transit.bigdec} A transit big decimal.
 */
transit.bigdec =  types.bigDecimalValue;

/**
 * Test if an object is a transit big decimal.
 * @method transit.isBigDecimal
 * @param {Object} x Any JavaScript value.
 * @return {Boolean} true if x is a transit big decimal, false otherwise.
 */
transit.isBigDecimal = types.isBigDecimal;

/**
 * Create transit keyword.
 * @method transit.keyword
 * @param {String} name A string.
 * @return {transit.keyword} A transit keyword.
 */
transit.keyword = types.keyword;

/**
 * Test if an object is a transit keyword.
 * @method transit.isKeyword
 * @param {Object} x Any JavaScript value.
 * @return {Boolean} true if x is a transit keyword, false if otherwise.
 */
transit.isKeyword = types.isKeyword;

/**
 * Create a transit symbol.
 * @method transit.symbol
 * @param {s} name A string.
 * @return {transit.symbol} A transit symbol instance.
 */
transit.symbol =         types.symbol;

/**
 * Test if an object is a transit symbol
 * @method transit.isSymbol
 * @param {Object} x Any JavaScript value.
 * @return {Boolean} true if x is a transit symbol, false if otherwise.
 */
transit.isSymbol =       types.isSymbol;

/**
 * Create transit binary blob.
 * @method transit.binary
 * @params {String} s A base64 encoded string.
 * @return {transit.binary} A transit binary blob instance.
 */
transit.binary =         types.binary;

/**
 * Test if an object is a transit binary blob.
 * @method transit.isBinary
 * @param {Object} x Any JavaScript value.
 */
transit.isBinary =       types.isBinary;
transit.uri =            types.uri;
transit.isURI =          types.isURI;
transit.map =            types.map;
transit.isMap =          types.isMap;
transit.set =            types.set;
transit.isSet =          types.isSet;
transit.list =           types.list;
transit.isList =         types.isList;
transit.quoted =         types.quoted;
transit.isQuoted =       types.isQuoted;
transit.tagged =         types.taggedValue;
transit.isTaggedValue =  types.isTaggedValue;
transit.link =           types.link;
transit.isLink =         types.isLink;
transit.hash =           eq.hashCode;
transit.equals =         eq.equals;
transit.extendToEQ =     eq.extendToEQ;
transit.decoder =        decoder.decoder;
transit.UUIDfromString = types.UUIDfromString;
transit.randomUUID =     types.randomUUID;
transit.stringableKeys = writer.stringableKeys;

if(BROWSER_TARGET) {
    goog.exportSymbol("transit.reader",         transit.reader);
    goog.exportSymbol("transit.writer",         transit.writer);
    goog.exportSymbol("transit.makeBuilder",    transit.makeBuilder);
    goog.exportSymbol("transit.makeHandler",    transit.makeHandler);
    goog.exportSymbol("transit.date",           types.date);
    goog.exportSymbol("transit.integer",        types.intValue);
    goog.exportSymbol("transit.isInteger",      types.isInteger);
    goog.exportSymbol("transit.uuid",           types.uuid);
    goog.exportSymbol("transit.isUUID",         types.isUUID);
    goog.exportSymbol("transit.bigdec",         types.bigDecimalValue);
    goog.exportSymbol("transit.isBigDecimal",   types.isBigDecimal);
    goog.exportSymbol("transit.keyword",        types.keyword);
    goog.exportSymbol("transit.isKeyword",      types.isKeyword);
    goog.exportSymbol("transit.symbol",         types.symbol);
    goog.exportSymbol("transit.isSymbol",       types.isSymbol);
    goog.exportSymbol("transit.binary",         types.binary);
    goog.exportSymbol("transit.isBinary",       types.isBinary);
    goog.exportSymbol("transit.uri",            types.uri);
    goog.exportSymbol("transit.isURI",          types.isURI);
    goog.exportSymbol("transit.map",            types.map);
    goog.exportSymbol("transit.isMap",          types.isMap);
    goog.exportSymbol("transit.set",            types.set);
    goog.exportSymbol("transit.isSet",          types.isSet);
    goog.exportSymbol("transit.list",           types.list);
    goog.exportSymbol("transit.isList",         types.isList);
    goog.exportSymbol("transit.quoted",         types.quoted);
    goog.exportSymbol("transit.isQuoted",       types.isQuoted);
    goog.exportSymbol("transit.tagged",         types.taggedValue);
    goog.exportSymbol("transit.isTaggedValue",  types.idTaggedValue);
    goog.exportSymbol("transit.link",           types.link);
    goog.exportSymbol("transit.isLink",         types.isLink);
    goog.exportSymbol("transit.hash",           eq.hashCode);
    goog.exportSymbol("transit.equals",         eq.equals);
    goog.exportSymbol("transit.extendToEQ",     eq.extendToEQ);
    goog.exportSymbol("transit.decoder",        decoder.decoder);
    goog.exportSymbol("transit.UUIDfromString", types.UUIDfromString);
    goog.exportSymbol("transit.randomUUID",     types.randomUUID);
    goog.exportSymbol("transit.stringableKeys", writer.stringableKeys);
}

if(NODE_TARGET) {
    module.exports = {
        reader:         transit.reader,
        writer:         transit.writer,
        makeBuilder:    transit.makeBuilder,
        makeHandler:    transit.makeHandler,
        date:           types.date,
        integer:        types.intValue,
        isInteger:      types.isInteger,
        uuid:           types.uuid,
        isUUID:         types.isUUID,
        bigdec:         types.bigDecimalValue,
        isBigDecimal:   types.isBigDecimal,
        keyword:        types.keyword,
        isKeyword:      types.isKeyword,
        symbol:         types.symbol,
        isSymbol:       types.isSymbol,
        binary:         types.binary,
        isBinary:       types.isBinary,
        uri:            types.uri,
        isURI:          types.isURI,
        map:            types.map,
        isMap:          types.isMap,
        set:            types.set,
        isSet:          types.isSet,
        list:           types.list,
        isList:         types.isList,
        quoted:         types.quoted,
        isQuoted:       types.isQuoted,
        tagged:         types.taggedValue,
        isTaggedValue:  types.isTaggedValue,
        link:           types.link,
        isLink:         types.isLink,
        hash:           eq.hashCode,
        equals:         eq.equals,
        extendToEQ:     eq.extendToEQ,
        decoder:        decoder.decoder,
        UUIDfromString: types.UUIDfromString,
        randomUUID:     types.randomUUID,
        stringableKeys: writer.stringableKeys
    };
}

});
