'use strict';

/**
 * Constants
**/

const Constants = {

  FLUID_PARAM_NAME:       'fluid-data',
  SIGNATURE_VERSION:      'v1',
  DELIMITER:              '*',

  REQUEST_KEYS:           { required: ['resource', 'tokens'],
                            allowed:  ['resource', 'tokens', 'time', 'state'] },

  RESPONSE_KEYS:          { required: ['resource', 'time'],
                            allowed:  ['resource', 'tokens', 'time', 'state'] },

  DEFAULT_FLUID_URI:      'https://fluid.us/purchase',
  DEFAULT_TOLERANCE:      300 /* seconds */,
};

module.exports = Constants;