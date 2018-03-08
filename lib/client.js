'use strict';

/**
 * Client for processing and validating Fluid URLs
 * See http://www.fluid.us/
**/

const Client = Object.assign( require('./base-client'), {
  //Use extension here to avoid circular references

  // Classes exported

  Request:  require('./request'),

  Response: require('./response'),

  // Shortcut helpers for the lazy

  requestUrl(hash) {
    const req = new this.Request();
    return req.sign(hash).signedUrl;
  },

  validateUrl(url) {
    const resp = new this.Response();
    return resp.validateUrl(url);
  },

  validateParam(param) {
    const resp = new this.Response();
    return resp.validateParam(param);
  },

} );

module.exports = Client;
