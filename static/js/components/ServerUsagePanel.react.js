/** @jsx React.DOM */

var React = require('react');
var ReactPropTypes = React.PropTypes;
var AppDispatcher = require('../dispatcher/AppDispatcher');
var ServerConstants = require('../constants/ServerConstants');

var ServerUsagePanel = React.createClass({
    propTypes:{
        server:ReactPropTypes.object.isRequired
    },

    destroyClicked:function () {
        this.props.server.serverStatus = 'destroying';
        AppDispatcher.handleViewAction({
            actionType:ServerConstants.DESTROY_SERVER_REQUEST,
            serverId:this.props.server.serverId
        });
    },

    restartClicked:function () {
        this.props.server.serverStatus = 'restarting';
        AppDispatcher.handleViewAction({
            actionType:ServerConstants.RESTART_SERVER_REQUEST,
            serverId:this.props.server.serverId
        });
    },

    renderBody:function () {
        if (this.props.server.serverStatus === 'running') {
            var cpuStyle = {
                width:this.props.server.cpuUsage + '%'
            };
            var memUsagePercentage = (this.props.server.memUsed / this.props.server.memTotal) * 100;
            var memStyle = {
                width:memUsagePercentage + '%'
            };

            return (
                    <div>
                        <p>CPU - {this.props.server.cpuUsage}</p>
                        <div className='progress'>
                            <div className='progress-bar' role='progressbar' style={cpuStyle}></div>
                        </div>
                        <p>MEM - {this.props.server.memUsed}M</p>
                        <div className='progress'>
                            <div className='progress-bar' role='progressbar' style={memStyle}></div>
                        </div>
                        <div className="pull-right">
                            <button type='button' className='btn btn-warning' onClick={this.restartClicked}>
                                <span className='glyphicon glyphicon-refresh'></span>
                            Restart
                            </button>
                        &nbsp;
                            <button type='button' className='btn btn-danger' onClick={this.destroyClicked}>
                                <span className='glyphicon glyphicon-trash'></span>
                            Destroy
                            </button>
                        </div>
                    </div>
                    );
        } else {
            return (<p>{this.props.server.serverStatus}</p>)
        }
    },

    render:function () {
        var body = this.renderBody();

        return (
                <div className='panel panel-default'>
                    <div className='panel-heading'>
                        <h3 className='panel-title'>{this.props.server.serverName}</h3>
                    </div>
                    <div className='panel-body'>
                        {body}
                    </div>
                </div>
                );
    }
});

module.exports = ServerUsagePanel;
