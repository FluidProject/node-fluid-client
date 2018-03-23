'use strict';

/*******************************************
 * Base class for managing page lifecycle
 * Note: Beta
 **/

const errors       = require('./errors');
const utilities    = require('./utilities');
const client       = require('./base-client');

class BasePageManager {

  get isAuthorized()         { return this._authorized;          }
  get isPCompletedPurchase() { return this._completed_purchase;  }
  get isRememberedPurchase() { return this._remembered_purchase; }
  get isExpired()            { return this._expired;             }

  get resource()             { return this._resource;            }
  get purchaseAmount()       { return this._purchase_amount;     }

  constructor(pubId      = client.config.pubId,
              secretKey  = client.config.secretKey) {
    this.pubId     = pubId;
    this.secretKey = secretKey;
  }

  validateUrl(url) {
    this.reset();

    this.performWithoutExceptions( () => this.responseValidator().validateUrl(url) );

    return this.assignResults();
  }

  validateParam(param, resource=undefined) {
    this.reset();
    this._resource = resource;

    this.performWithoutExceptions( () => this.responseValidator().validateParam(param, resource) );

    return this.assignResults();
  }

  signedUrl(hash) {
    hash.resource = hash.resource || this.resource;
    hash.state    = hash.state    || this.userState();

    utilities.debug('#signedUrl >>', hash);
    return this.requestSigner().sign(hash).signedUrl;
  }

  // These methods must be over-ridden in sub-classes

  // eslint-disable-next-line no-unused-vars
  hasResourceBeenPurchased(resource, update=false) {
    throw new Error('#hasResouceBeenPurchased has not been implemented.');
  }

  // eslint-disable-next-line no-unused-vars
  markAsPurchased(resource, amount) {
    throw new Error('#markAsPurchased has not been implemented.');
  }

  userState() {
    throw new Error('#userState has not been implemented.');
  }

  // Private methods

  performWithoutExceptions(handler) {
    try {

      handler();

    } catch (ex) {
      if (! (ex instanceof errors.SignatureError))
        throw ex;
      utilities.debug('Exception in #performRequestValidation:', ex);
    }
  }

  assignResults() {
    if (this.responseValidator().resource)
      this._resource = this.responseValidator().resource;

    if (this.responseValidator().isValid && this.validateParameters()) {
      this._authorized         = true;
      this._completed_purchase = true;
      this._purchase_amount     = this.responseValidator().amount;
      this.markAsPurchased(this.resource, this.purchaseAmount);
      return true;

    } else if (this.hasResourceBeenPurchased(this.resource, true)) {
      this._authorized          = true;
      this._remembered_purchase = true;
      return true;

    } else {
      this._authorized = false;
      this._expired    = this.responseValidator().isExpired;
      return false;

    }
  }

  reset() {
    this._authorized           = undefined;
    this._completed_purchase   = undefined;
    this._remembered_purchase  = undefined;
    this._expired              = undefined;
    this._resource             = undefined;
    this._purchase_amount      = undefined;
  }

  validateParameters() {
    if (this.responseValidator().state !== this.userState()) {
      utilities.debug("Signed state '%s' doesn't match user state '%s'", this.responseValidator().state, this.userState() );
      return false;
    }
    //if (this.responseVlidator().resource !== this.resourceUrl) return false;

    return true;
  }

  responseValidator() {
    this._responseValidator = this._responseValidator || new client.ResponseValidator(this.pubId, this.secretKey);
    return this._responseValidator;
  }

  requestSigner() {
    this._requestSigner     = this._requestSigner     || new client.RequestSigner(this.pubId, this.secretKey);
    return this._requestSigner;
  }

}

module.exports = BasePageManager;
