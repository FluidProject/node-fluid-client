'use strict';

/**
 * Class for validating response parameters
**/

const constants = require('./constants');
const errors    = require('./errors');
const utilities = require('./utilities');
const parser    = require('./parser');
const signer    = require('./signer');
const client    = require('./base-client');

class Response {

  get isValid()    { return this._valid;    }
  get isSigned()   { return this._signed;   }
  get isExpired()  { return this._expired;  }
  get version()    { return this._version;  }
  get resource()   { return this._resource; }

  get amount()     { return this.checkProperty('amount'); }
  get time()       { return this.checkProperty('time'); }
  get state()      { return this.checkProperty('state'); }

  constructor(pubId     = client.config.pubId,
              secretKey = client.config.secretKey) {
    this.pubId     = pubId;
    this.secretKey = secretKey;
  }

  validateUrl(url) {
    this.reset();

    const data = parser.parseUrl(url);
    if (data)
      this.validateDataHash(data, data.resource);

    return this;
  }

  validateParam(param, resource=undefined) {
    this.reset();

    const data = parser.parseParam(param);
    if (data)
      this.validateDataHash(data, resource);

    return this;
  }

  ////////////////////////////////////////////////////////////////
  // internal

  validateDataHash(data, resource=undefined) {
    utilities.debug('Validating data-hash %j with resource:%s', data, resource);
    if (!data)
      return;

    if (data.pub_id !== this.pubId)
      throw new errors.SignatureError('Pub ID mismatch');

    const packet = utilities.decode64( data.packet);
    let hash     = signer.stringToHash(packet);
    utilities.debug('Encoded hash is %j', hash);

    hash.resource = this.checkResource(hash.resource, resource);

    this._version  = data.version;
    this._resource = hash.resource;

    this.performValidation(hash, data.signature);
  }

  performValidation(hash, signature) {
    this.reset();

    utilities.checkHashKeys(hash, constants.RESPONSE_KEYS);

    this.checkSignature(hash, signature);
    this.checkValid(hash.valid);

    this._resource = hash.resource;
    this._amount   = hash.amount && parseInt(hash.amount);
    this._state    = hash.state;
    this._time     = parseInt(hash.time);
    this._hash     = hash;

    this._signed   = true;

    if (this._time)
      this.checkExpiry(this._time);

    this._valid = true;
  }

  checkSignature(hash, signature) {
    if (utilities.isEmpty(signature))
      throw new errors.SignatureError('Signature Required');

    const calculated = signer.signHash(hash, this.secretKey);
    utilities.debug('Checking signature of %j, given:%s, calculated:%s', hash, signature, calculated);

    if (signature !== calculated)
      throw new errors.SignatureError('Invalid signature');
  }

  checkValid(valid) {
    if (!valid || valid.toLowerCase()[0] !== 'y')
      throw new errors.SignatureError('Signature Invalid');
  }

  checkExpiry(time) {
    const now = Date.now() / 1000;

    this._expired = Math.abs(now - time) > client.config.tolerance;

    utilities.debug('Checking expiration given:%s now:%s [%s], expired=%s', time, now, new Date(), this._expired);
    if (this._expired)
      throw new errors.SignatureExpiredError('Token has expired');
  }

  checkResource(resource1, resource2) {
    resource1 = utilities.nillable(resource1);
    resource2 = utilities.nillable(resource2);

    if (!resource1 && !resource2)
      throw new errors.SignatureError('No resource set');

    else if (!resource1)
      return resource2;

    else if (!resource2)
      return resource1;

    else if (resource1 !== resource2)
      throw new errors.SignatureError('Resource does not match');

    else
      return resource1;

  }

  checkProperty(prop) {
    if (prop === 'time' && this._expired)
      throw new errors.SignatureExpiredError('Expired');
    if (!this._valid)
      throw new errors.SignatureError('Not validated');

    return this[`_${prop}`];
  }

  reset() {
    this._valid = this.signed = this.expired = undefined;
  }

}

module.exports = Response;