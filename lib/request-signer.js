'use strict';

/**
 * Class for generating request parameters and URLs
**/

const util         = require('util');

const constants    = require('./constants');
const client       = require('./base-client');
const utilities    = require('./utilities');
const hash_utils   = require('./hash-utils');

class RequestSigner {

  get signature()   { return this._signature;   }
  get signedParam() { return this._signedParam; }
  get signedUrl()   { return this._signedUrl;   }

  constructor(pubId     = client.config.pubId,
              secretKey = client.config.secretKey) {
    this.pubId     = pubId;
    this.secretKey = secretKey;
  }

  sign(hash) {
    hash_utils.checkHashKeys(hash, constants.REQUEST_KEYS);

    this.normalizeTime(hash);

    this._signature   = hash_utils.signHash(hash, this.secretKey);
    this._signedParam = this.makeParam(hash, this.signature);
    this._signedUrl   = util.format('%s?%s=%s', client.config.fluidUri, constants.FLUID_PARAM_NAME, this.signedParam);
    utilities.debug('Signed hash: %j with signature:"%s"', hash, this.signature);

    return this;
  }

  makeParam(hash, signature) {
    const data = hash_utils.hashToString(hash);
    utilities.debug('Param is: %s', data);

    return [
      constants.SIGNATURE_VERSION,
      this.pubId,
      utilities.encode64(data),
      signature,
    ].join(constants.DELIMITER);
  }

  normalizeTime(hash) {
    let time = hash.time;

    if (time && time instanceof Date)
      hash.time = Math.ceil( time.valueOf/1000 );
  }

}

module.exports = RequestSigner;