'use strict';

/**
 * Client for processing and validating Fluid URLs
 * See http://www.fluid.us/
**/

const Client = Object.assign( require('./base-client'), {
  //Use extension here to avoid circular references

  //////////////// Inherited //////////////
  // config:     new configuration(),
  // errors:     require('./errors'),

  // Classes exported
  RequestSigner:     require('./request-signer'),
  ResponseValidator: require('./response-validator'),

  // Shortcut helpers for the lazy

  requestUrl(hash) {
    const signer = new this.RequestSigner();
    return signer.sign(hash).signedUrl;
  },

  validateUrl(url) {
    const validator = new this.ResponseValidator();
    return validator.validateUrl(url);
  },

  validateParam(param, resource=undefined) {
    const validator = new this.ResponseValidator();
    return validator.validateParam(param, resource);
  },

} );

module.exports = Client;
