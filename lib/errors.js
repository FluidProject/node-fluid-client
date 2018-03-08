'use strict';

/**
 * Internal utilities for signing data packets
**/

const Errors = {
  ConfigurationError: class ConfigurationError extends Error {},
  SignatureError:     class SignatureError     extends Error {},
};

module.exports = Errors;