'use strict';

/**
 * Configuration
**/

const process   = require('process');

const constants = require('./constants');
const errors    = require('./errors');

class Configuration {

  // Tolerance for request timeout checking

  get tolerance() {
    return this._tolerance || constants.DEFAULT_TOLERANCE;
  }

  set tolerance(value) {
    this._tolerance = value;
  }

  // Your Publisher ID

  get pubId() {
    if (!this._pubID)
      this._pubId = this.getDefaultPubID();
    return this._pubId;
  }

  set pubId(value) {
    this._pubId = value;
  }

  // The Secret API key ** Don't give this to anyone or put it in your website

  get secretKey() {
    if (!this._secretKey)
      this._secretKey = this.getDefaultSecretKey();
    return this._secretKey;
  }

  set secretKey(value) {
    this._secretKey = value;
  }

  // debug/logger function (for example `console.debug`, nil to disable)

  get debug() {
    return this._debug;
  }

  set debug(value) {
    this._debug = value;
  }

  // URI for Fluid API

  get fluidUri() {
    return this._fluidUri || constants.DEFAULT_FLUID_URI;
  }

  set fluidUri(value) {
    this._fluidUri = value;
  }

  ////////////////////////////////////////////////////////////
  // private

  getDefaultPubID() {
    const value = process.env.FLUID_PUB_ID;
    if (!value)
      throw new errors.ConfigurationError('No FLUID_PUB_ID provided');
    return value;
  }

  getDefaultSecretKey() {
    const value = process.env.FLUID_SECRET_KEY;
    if (!value)
      throw new errors.ConfigurationError('No FLUID_SECRET_KEY provided');
    return value;
  }

}

module.exports = Configuration;
