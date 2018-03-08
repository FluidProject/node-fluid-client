'use strict';

/**
 * Class for validating response tokens
**/

const constants = require('./constants');
const errors    = require('./errors');
const utilities = require('./utilities');
const parser    = require('./parser');
const signer    = require('./signer');
const client    = require('./client');

class Response {

  get isValid()    { return this._valid;    }
  get isSigned()   { return this._signed;   }
  get isExpired()  { return this._expired;  }
  get version()    { return this._version;  }
  get resource()   { return this._resource; }

  get tokens()     { this.checkProperty('tokens'); }
  get time()       { this.checkProperty('time'); }
  get state()      { this.checkProperty('state'); }

  constructor(pubId     = client.config.pubId,
              secretKey = client.config.secretKey) {
    this.pubId     = pubId;
    this.secretKey = secretKey;
  }

  validateUrl(url) {
    this.reset();

    const data = parser.parseUrl(url);
    if (data)
      this.validateDataHash(data);

    return this;
  }

  validateParam(param, resource) {
    this.reset();

    const data = parser.parseParam(param);
    if (data)
      this.validateDataHash(data, resource);

    return this;
  }

  ////////////////////////////////////////////////////////////////
  // internal

  validateDataHash(data, resource=undefined) {
    utilities.debug('Validating data-hash %O with resource:%s', data, resource);
    if (!data)
      return;

    if (data.pub_id !== this.pubId)
      throw new errors.SignatureError('Pub ID mismatch');

    const packet = utilities.decode64( data.packet);
    let hash     = signer.stringToHash(packet);
    utilities.debug('Encoded hash is %O', hash);

    hash.resource = this.checkResource(hash.resource, data.resource, resource);

    this._version  = hash.version;
    this._resource = hash.resource;

    this.performValidation(hash, data.signature);
  }

  performValidation(hash, signature) {
    this.reset();

    if (utilities.isEmpty(signature))
      throw new errors.SignatureError('Signature Required');

    utilities.checkHashKeys(hash, constants.RESPONSE_KEYS);
    const calculated = signer.signHash(hash, signature);
    utilities.debug('Checking signature of %O, given:%s, calculated:%s', hash, signature, calculated);

    if (signature !== calculated)
      throw new errors.SignatureError('Invalid signature');

    this._resource = hash.resource;
    this._tokens   = hash.tokens;
    this._state    = hash.state;
    this._time     = parseInt(hash.time);
    this._hash     = hash;

    this._signed   = true;

    if (this._time) {
      this._expired = Math.abs(Date.now() - this._time) > client.config.tolerance * 1000;
      utilities.debug('Checking expiration of %s at %s [%s], expired=%s', this._time, Date.now(), new Date(), this._expired);
      if (this._expired)
        throw new errors.SignatureExpiredError('Token has expired');
    }

    this._valid = true;
  }

  checkResource(...resources) {
    resources = resources.filter(utilities.isNotEmpty);

    if (resources.length === 0)
      throw new errors.SignatureError('No resource set');

    else if (resources.length > 1)
      throw new errors.SignatureError('Multiple resources set');

    else
      return resources[0];
  }

  checkProperty(prop) {
    if (prop === 'time' && this._expired)
      throw new errors.SignatureExpiredError('Expired');
    if (!this._valid)
      throw new errors.SignatureError('Not validated');

    return this._hash[prop];
  }

  reset() {
    this._valid = this.signed = this.expired = undefined;
  }

}

module.exports = Response;