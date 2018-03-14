'use strict';

/**
 * Internal utilities for signing data packets
**/

const querystring = require('querystring');
const crypto      = require('crypto');

const constants   = require('./constants');
const errors      = require('./errors');
const utilities   = require('./utilities');

class HashUtils {

  static checkHashKeys(hash, keySet) {
    let keys = Object.getOwnPropertyNames(hash);
    keys = keys.filter( key => utilities.isNotEmpty(hash[key]) );

    const missing = utilities.arrayDifference(keySet.required, keys);
    const extra   = utilities.arrayDifference(keys, keySet.allowed);

    if (missing.length)
      throw new errors.SignatureError(`Required hash keys missing: ${missing}`);
    if (extra.length)
      throw new errors.SignatureError(`Extra hash keys: ${extra}`);
  }

  static signHash(hash, secretKey) {
    const  text = this.hashToString(hash);
    let    hmac = crypto.createHmac('sha256', secretKey);
    return hmac.update(text).digest('hex');
  }

  // Turns hash into a url style list
  // Not using querystring.stringify because it needs to be sorted and filtered
  static hashToString(hash) {
    const  keys      = Object.getOwnPropertyNames(hash);
    const  validKeys = keys.filter( key => utilities.isNotEmpty(hash[key]) );
    const  params    = validKeys.sort().map( (key) => {
      const value = querystring.escape( hash[key] );
      key = constants.LONG_TO_SHORT_KEY_MAP[key] || key;
      return `${key}=${value}`;
    } );
    return params.join('&');
  }

  static stringToHash(string) {
    if (!string)
      return null;

    const params = string.split('&');
    return params.reduce( (hash, param) => {
      let [key, value] = param.split('=');
      key = constants.SHORT_TO_LONG_KEY_MAP[key] || key;
      hash[key] = querystring.unescape(value);
      return hash;
    }, {});
  }

}

module.exports = HashUtils;