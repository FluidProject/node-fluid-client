'use strict';

/**
 * Internal utilities
**/

const util   = require('util');

const errors = require('./errors');
const client = require('./base-client');

class Utilities {

  static debug(format, ...args) {
    if (!client.config.logger)
      return;

    const text = util.format(format, ...args);
    client.config.logger(text);
  }

  static checkHashKeys(hash, keyset) {
    let keys = Object.getOwnPropertyNames(hash);
    keys = keys.filter( key => this.isNotEmpty(hash[key]) );

    const missing = this.arrayDifference(keyset.required, keys);
    const unknown = this.arrayDifference(keys, keyset.allowed);

    if (missing.length)
      throw new errors.SignatureError(`Required hash keys missing: ${missing}`);
    if (missing.length)
      throw new errors.SignatureError(`Unknown hash keys: ${unknown}`);
  }

  // This encodes to filename/url safe Base64
  static encode64(string) {
    const b64 = Buffer.from(string).toString('base64');
    return b64.replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '');
  }

  static decode64(string) {
    // The Node base64 decoder handles url safe encoding automatically
    return Buffer.from(string, 'base64').toString();
  }

  static isEmpty(value) {
    return value === undefined || value === null || value === '';
  }

  static isNotEmpty(value) {
    return ! this.isEmpty(value);
  }

  // Return items that are in left but not in right
  static arrayDifference(left, right) {
    return left.filter( val => !right.includes(val) );
  }

}

module.exports = Utilities;