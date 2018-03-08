'use strict';

/**
 * Internal utilities
**/

const util   = require('util');

const errors = require('./errors');
const client = require('./base-client');

const Utilities = {

  debug(format, ...args) {
    if (!client.config.logger)
      return;

    const text = util.format(format, ...args);
    client.config.logger(text);
  },

  checkHashKeys(hash, keyset) {
    let keys = Object.getOwnPropertyNames(hash);
    keys = keys.filter( key => this.notEmpty(hash[key]) );

    const missing = this.arrayDifference(keyset.required, keys);
    const unknown = this.arrayDifference(keys, keyset.allowed);

    if (missing.length)
      throw new errors.SignatureError(`Required hash keys missing: ${missing}`);
    if (missing.length)
      throw new errors.SignatureError(`Unknown hash keys: ${unknown}`);
  },

  // This encodes to filename/url safe Base64
  encode64(string) {
    const b64 = Buffer.from(string).toString('base64');
    return b64.replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '');
  },

  decode64(string) {
    return Buffer.from(string, 'base64').toString();
  },

  empty(value) {
    return value === undefined || value === null || value === '';
  },

  notEmpty(value) {
    return ! this.empty(value);
  },

  // Return items that are in left but not in right
  arrayDifference(left, right) {
    return left.filter( val => !right.includes(val) );
  },

};

module.exports = Utilities;