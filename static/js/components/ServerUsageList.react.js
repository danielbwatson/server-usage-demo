/** @jsx React.DOM */

var ServerUsagePanel = require('./ServerUsagePanel.react');
var React = require('react');
var ServerStore = require('../stores/ServerStore');

function getServerState() {
    return {
        serverList:ServerStore.getServerList()
    };
}

var ServerUsageList = React.createClass({
    getInitialState:function () {
        return getServerState();
    },

    _onChange:function () {
        this.setState(getServerState());
    },

    componentDidMount:function () {
        ServerStore.addChangeListener(this._onChange);
    },

    componentWillUnmount:function () {
        ServerStore.removeChangeListener(this._onChange);
    },

    render:function () {
        var serverPanels = [];
        for (var key in this.state.serverList) {
            var server = this.state.serverList[key];
            serverPanels.push(<div className='row'>
                <ServerUsagePanel server={server} />
            </div>);
        }

        return (
                <div>
                  {serverPanels}
                </div>
                );
    }
});

module.exports = ServerUsageList;
