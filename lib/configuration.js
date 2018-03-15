'use strict';

/**
 * Configuration
**/

const process   = require('process');

const constants = require('./constants');
const errors    = require('./errors');

class Configuration {

  // Provides the following configuration properties:

  // pubId:
  //    Your Publisher ID

  get pubId() {
    if (!this._pubID)
      this._pubId = this.getDefaultPubID();
    return this._pubId;
  }

  set pubId(value) {
    this._pubId = value;
  }
   
  // secretKey:
  //    Your Secret API Key - don't give this to anyone or put it on your website

  get secretKey() {
    if (!this._secretKey)
      this._secretKey = this.getDefaultSecretKey();
    return this._secretKey;
  }

  set secretKey(value) {
    this._secretKey = value;
  }
  
  // tolerance:
  //    Tolerance for request timeout checking in seconds

  // historyLimit:
  //   The maximum number of items that will be kept in the Page Manager's session history

  // fluidUri
  //   URI for Fluid API

  // debug:
  //   debug/logger function matching parameters for `util.format` undefined to disable
  //   console.log or console.debug are good choices for debugging

  constructor() {
    this.tolerance    = constants.DEFAULT_TOLERANCE;
    this.historyLimit = constants.DEFAULT_HISTORY_LIMIT;
    this.fluidUri     = process.env.FLUID_URI || constants.DEFAULT_FLUID_URI;
    this.debug        = undefined;
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
