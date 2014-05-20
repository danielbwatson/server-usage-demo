/**
 * Copyright 2013-2014 Facebook, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 * AppDispatcher
 *
 * A singleton that operates as the central hub for application updates.
 */

var Dispatcher = require('./Dispatcher');

var merge = require('react/lib/merge');

var AppDispatcher = merge(Dispatcher.prototype, {

  /**
   * Marks the action as initiated by the view.
   * @param  {object} action The data coming from the view.
   */
  handleViewAction: function(action) {
    this.dispatch({
      source: 'VIEW_ACTION',
      action: action
    });
  },

  /**
   * Marks the action as an action initated on the server.
   * @param  {object} action The data coming from the server.
   */
  handleServerInitiatedAction: function(action) {
    this.dispatch({
      source: 'SERVER_INITIATED_ACTION',
      action: action
    });
  }
});

module.exports = AppDispatcher;
