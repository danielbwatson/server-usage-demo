var shoe = require('shoe');
var http = require('http');
var ecstatic = require('ecstatic');
var duplexEmitter = require('duplex-emitter');

var server = http.createServer(ecstatic(__dirname + '/static/')).listen(8080);

console.log('Listening on 8080: http://localhost:8080/index.html');

var _servers = [
    {
        serverId:'server0',
        serverName:'server0',
        serverStatus:'running',
        cpuUsage:60,
        memTotal:1024,
        memUsed:256
    },
    {
        serverId:'server1',
        serverName:'server1',
        serverStatus:'running',
        cpuUsage:25,
        memTotal:1024,
        memUsed:512
    },
    {
        serverId:'server2',
        serverName:'server2',
        serverStatus:'running',
        cpuUsage:75,
        memTotal:1024,
        memUsed:128
    },
    {
        serverId:'server3',
        serverName:'server3',
        serverStatus:'running',
        cpuUsage:95,
        memTotal:1024,
        memUsed:1024
    }
];

function getServerIndexForServerId(serverId) {
    for(i = 0; i < _servers.length; i++) {
        if(_servers[i].serverId === serverId) {
            return i;
        }
    }

    throw new Error('Unknown serverId: ' + serverId);
}

function getServerById(serverId) {
    for(i = 0; i < _servers.length; i++) {
        if(_servers[i].serverId === serverId) {
            return _servers[i];
        }
    }

    throw new Error('Unknown serverId: ' + serverId);
}

var sock = shoe(function (stream) {
    var client = duplexEmitter(stream);

    setInterval(function () {
        client.emit('server-list', _servers);
    }, 1000);

    client.on('destroy-server', function (serverId) {
        var index = getServerIndexForServerId(serverId);
        var server = _servers[index];
        server.serverStatus = 'destroying.';
        var count = 8;

        var iv = setInterval(function () {
          if(count === 0) {
            _servers.splice(index, 1);
            clearInterval(iv);
          } else {
            server.serverStatus += '.'
            count--;
          }
        }, 1000);
    });

    client.on('restart-server', function (serverId) {
        var server = getServerById(serverId);
        server.serverStatus = 'restarting.';
        var count = 4;

        var iv = setInterval(function () {
          if(count === 0) {
            server.serverStatus = 'running';
            clearInterval(iv);
          } else {
            server.serverStatus += '.'
            count--;
          }
        }, 1000);
    });
});

sock.install(server, '/serverUsage');
