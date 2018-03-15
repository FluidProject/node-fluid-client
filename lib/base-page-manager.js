'use strict';

/*******************************************
 * Base class for managing page lifecycle
 * Note: Beta
 **/

const errors       = require('./errors');
const utilities    = require('./utilities');
const client       = require('./base-client');

class BasePageManager {

  get isAuthorized()    { return this._authorized;    }
  get isSigned()        { return this._signed;        }
  get isRemembered()    { return this._remembered;    }

  get resource()        { return this._resource;      }

  constructor(pubId      = client.config.pubId,
              secretKey  = client.config.secretKey) {
    this.pubId     = pubId;
    this.secretKey = secretKey;
  }

  validateUrl(url) {
    return this.performRequestValidation(
      () => this.responseValidator().validateUrl(url)
    );
  }

  validateParam(param, resource=undefined) {
    this._resource = resource;
    return this.performRequestValidation(
      () => this.responseValidator().validateParam(param, resource)
    );
  }

  signedUrl(hash) {
    hash.resource = hash.resource || this.resource;
    hash.state    = hash.state    || this.userState();

    utilities.debug('#signedUrl >>', hash);
    return this.requestSgner.sign(hash).signedUrl;
  }

  // These methods must be over-ridden in sub-classes

  // eslint-disable-next-line no-unused-vars
  hasResourceBeenPurchased(resource, update=false) {
    throw new Error('#hasResouceBeenPurchased has not been implemented.');
  }

  // eslint-disable-next-line no-unused-vars
  markAsPurchased(resource) {
    throw new Error('#markAsPurchased has not been implemented.');
  }

  userState() {
    throw new Error('#userState has not been implemented.');
  }

  // Private methods

  performRequestValidation(handler) {
    try {

      handler();

    } catch (ex) {
      if (! (ex instanceof errors.SignatureError))
        throw ex;
      utilities.debug('Exception in #performRequestValidation:', ex);
    }

    this._resource = this.responseValidator().resource;

    if (this.responseValidator().isValid && this.validateParameters()) {
      this._signed     = true;
      this._authorized = true;
      this.markAsPurchased(this.resource);
      return true;

    } else if (this.hasResourceBeenPurchased(this.resource, true)) {
      this._remembered = true;
      this._authorized = true;
      return true;

    } else {
      return false;

    }
  }

  validateParameters() {
    return this.responseValidator().state === this.userState(); // && response_validator.resource == resource_url
  }

  responseValidator() {
    this._responseValidator = this._responseValidator || new client.ResponseValidator(this.pubId, this.secretKey);
  }

  requestSigner() {
    this._requestSigner     = this._requestSigner     || new client.RequestSigner(this.pubId, this.secretKey);
  }

}

module.exports = BasePageManager;
