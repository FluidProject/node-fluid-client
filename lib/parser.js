'use strict';

/**
 * Internal utilities for signing data packets
**/

const nodeurl   = require('url');

const constants = require('./constants');
const errors    = require('./errors');
const utilities = require('./utilities');

class Parser {

  static parseUrl(url) {
    // Using the legacy API for compatibility with Node 6 & AWS Lambda
    const uri = nodeurl.parse(url, true);

    const param = uri.query[ constants.FLUID_PARAM_NAME ];
    if (!param)
      return null;

    uri.search = this.removeParam(uri.search, constants.FLUID_PARAM_NAME);
    const resource = nodeurl.format(uri);

    let data = this.parseParam(param);
    data.resource = resource;
    data.param    = param;
    return data;
  }

  static parseParam(param) {
    if (utilities.isEmpty(param))
      return null;

    const parts = param.split(constants.DELIMITER);

    if (parts.length !== 4)
      throw new errors.SignatureError('Invalid param parts');
    if (parts.some(utilities.isEmpty))
      throw new errors.SignatureError('Invalid param parts');
    if (parts[0] !== constants.SIGNATURE_VERSION)
      throw new errors.SignatureError('Invalid token version');

    return {
      version:   parts[0],
      pub_id:    parts[1],
      packet:    parts[2],
      signature: parts[3],
    };
  }

  static removeParam(search, name) {
    const regexp = new RegExp(`(\\?|&)(${name}=.*?)(&|#|$)`);
    return search.replace(regexp, function(match, pre, param, post) {
      return post==='&' ? pre : post;
    });
  }


}

module.exports = Parser;