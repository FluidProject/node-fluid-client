'use strict';

/*******************************************
 * Null class for managing page lifecycle
 * When there is no session or state
 **/

const BasePageManager = require('./base-page-manager');

class NullPageManager extends BasePageManager {

  constructor(userState,
              pubId      = undefined,
              secretKey  = undefined) {
    super(pubId, secretKey);
    this._userState = userState;
  }

  // eslint-disable-next-line no-unused-vars
  hasResourceBeenPurchased(resource, update=false) {
    return false;
  }

  // eslint-disable-next-line no-unused-vars
  markAsPurchased(resource) {
    // nothing
  }

  userState() {
    return this._userState;
  }

}

module.exports = NullPageManager;
