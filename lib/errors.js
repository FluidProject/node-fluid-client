'use strict';

/**
 *   Error classes
**/

exports.ConfigurationError =     class ConfigurationError    extends Error {};
exports.SignatureError =         class SignatureError        extends Error {};
exports.SignatureExpiredError =  class SignatureExpiredError extends exports.SignatureError {};
