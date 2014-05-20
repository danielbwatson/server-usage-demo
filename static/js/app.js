/** @jsx React.DOM */

var React = require('react');
var ServerUsageList = require('./components/ServerUsageList.react');
var AppDispatcher = require('./dispatcher/AppDispatcher');
var ServerConstants = require('./constants/ServerConstants');

AppDispatcher.handleViewAction({
    actionType:ServerConstants.INITIALIZE_APP
});

React.renderComponent(<ServerUsageList />, document.getElementById('ServerUsageList'));
