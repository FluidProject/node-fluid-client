'use strict';

/**
 * Client for processing and validating Fluid URLs
 * See http://www.fluid.us/
**/

const Client = Object.assign( require('./base-client'), {
  //Use extension here to avoid circular references

  Request: require('./request'),

  requestUrl(hash) {
    const req = new this.Request();
    return req.sign(hash).signedUrl;
  },

} );

module.exports = Client;
