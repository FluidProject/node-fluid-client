'use strict';

/************************************************************
 * Class for managing page lifecycle using a session
 * ** VERY BETA and VERY UNTESTED **
 **/

const crypto          = require('crypto');

const constants       = require('./constants');
const utilities       = require('./utilities');
const client          = require('./base-client');

const BasePageManager = require('./base-page-manager');

//#@note: The history list is sorted with the most recent last

class SessionPageManager extends BasePageManager {

  constructor(session,
              pubId      = undefined,
              secretKey  = undefined) {
    super(pubId, secretKey);
    this.session = session;
  }

  userState() {
    let state = this.session.get(constants.SESSION_USER_STATE_KEY);
    if (!state) {
      state = this.randomState();
      utilities.debug('USer State set to', state);
      this.session.set(constants.SESSION_USER_STATE_KEY, state);
    }
    return state;
  }

  clearHistory() {
    this.writeHistory([]);
  }

  hasResourceBeenPurchased(resource, update=false) {
    const hash      = this.resourceToHash(resource);
    let   resources = this.readHistory();

    const index = resources.lastIndexOf(hash);
    if (index < 0)
      return false;

    // If updating then move it to the end (newest)
    if (update && index < resources.length - 1) {
      resources.splice(index, 1);
      resources.push(hash);
      this.writeHistory(resources);
    }

    return true;
  }

  markAsPurchased(resource) {
    const hash      = this.resourceToHash(resource);
    let   resources = this.readHistory();

    // If the resource is already purchased we move it to the end to make it the 'newest'
    const index = resources.lastIndexOf(hash);
    if (index >= 0 && index < resources.length-1)
      resources.splice(index, 1);  // Delete the item

    resources.push(hash);
    this.writeHistory(resources);
  }

  readHistory() {
    const  data = this.session.get(constants.SESSION_USER_HISTORY_KEY) || '';
    return data.split(constants.SESSION_USER_HISTORY_SEPARATOR);
  }

  writeHistory(resources) {
    // Keep the length under HISTORY_LIMIT
    if (resources.length > client.config.historyLimit)
      resources.shift();
    const data = resources.join(constants.SESSION_USER_HISTORY_SEPARATOR);
    this.session.set(constants.SESSION_USER_HISTORY_KEY, data);
  }

  randomState() {
    return crypto.randomBytes(16).toString('base64').replace(/\+\\=/g,'');
  }

  resourceToHash(resource) {
    return crypto.createHash('md5').update(resource).digest('base64').replace(/\+\\=/g,'');
  }

}

module.exports = SessionPageManager;
