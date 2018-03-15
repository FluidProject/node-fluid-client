'use strict';

/**
 * Constants
**/

const Constants = {

  FLUID_PARAM_NAME:                'fluid-data',
  SIGNATURE_VERSION:               'v1',
  DELIMITER:                       '*',

  REQUEST_KEYS:                    { required: ['resource', 'amount'                          ],
                                     allowed:  ['resource', 'amount', 'time', 'state'         ] },

  RESPONSE_KEYS:                   { required: ['resource',           'time',         'valid' ],
                                     allowed:  ['resource', 'amount', 'time', 'state'         ] },

  SHORT_TO_LONG_KEY_MAP:           { r:        'resource',
                                     a:        'amount',
                                     t:        'time',
                                     s:        'state',
                                     v:        'valid'         },
  LONG_TO_SHORT_KEY_MAP:           { resource: 'r',
                                     amount:   'a',
                                     time:     't',
                                     state:    's',
                                     valid:    'v'             },

  DEFAULT_FLUID_URI:               'https://fluid.us/purchase',
  DEFAULT_TOLERANCE:               30 /* seconds */,

  SESSION_USER_STATE_KEY:          'fluid-state',
  SESSION_USER_HISTORY_KEY:        'fluid-history',
  SESSION_USER_HISTORY_SEPARATOR:  ','

};

module.exports = Constants;