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
 */

var duplexEmitter = require('duplex-emitter');
var merge = require('react/lib/merge');
var reconnect = require('reconnect');
var AppDispatcher = require('../dispatcher/AppDispatcher');
var EventEmitter = require('events').EventEmitter;
var ServerConstants = require('../constants/ServerConstants');

var CHANGE_EVENT = 'change';

var _servers = [];
var _server = null;

function initializeApp() {
    reconnect(function (stream) {
        var server = _server = duplexEmitter(stream);

        server.on('server-list', function (list) {
            AppDispatcher.handleServerInitiatedAction({
                actionType:ServerConstants.INCOMING_SERVER_STATUS_LIST,
                serverList:list
            });
        });
    }).connect('/serverUsage');
}

var ServerStore = merge(EventEmitter.prototype, {
    getServerList:function () {
        return _servers;
    },

    emitChange:function () {
        this.emit(CHANGE_EVENT);
    },

    /**
     * @param {function} callback
     */
    addChangeListener:function (callback) {
        this.on(CHANGE_EVENT, callback);
    },

    /**
     * @param {function} callback
     */
    removeChangeListener:function (callback) {
        this.removeListener(CHANGE_EVENT, callback);
    }
});

// Register to handle all updates
AppDispatcher.register(function (payload) {
    var action = payload.action;
    var text;

    switch (action.actionType) {
        case ServerConstants.INITIALIZE_APP:
            initializeApp();
            break;

        case ServerConstants.INCOMING_SERVER_STATUS_LIST:
            _servers = action.serverList;
            break;

        case ServerConstants.RESTART_SERVER_REQUEST:
            _server.emit('restart-server', action.serverId)
            break;

        case ServerConstants.DESTROY_SERVER_REQUEST:
            _server.emit('destroy-server', action.serverId)
            break;

        default:
            return true;
    }

    // This often goes in each case that should trigger a UI change. This store
    // needs to trigger a UI change after every view action, so we can make the
    // code less repetitive by putting it here.  We need the default case,
    // however, to make sure this only gets called after one of the cases above.
    ServerStore.emitChange();

    return true; // No errors.  Needed by promise in Dispatcher.
})

module.exports = ServerStore;
