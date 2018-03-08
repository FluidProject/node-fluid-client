'use strict';

/**
 * Basic client, used to avoid circular dependencies.
**/

const configuration = require('./configuration');

const BaseClient = {

  config:     new configuration(),
  errors:     require('./errors'),

};

module.exports = BaseClient;
