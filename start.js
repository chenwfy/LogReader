var server = require('./handlers/serverHandler'),
    file = require('./handlers/fileHandler');

var socketClients = {};
var setSocketClients = function (flag, socketClient) {
    if (socketClients[flag])
    {
        socketClients[flag].push(socketClient);
    } else {
        socketClients[flag] = [socketClient];
    }
};

var removeSocketClients = function (flag, socketClient) {
    if (socketClients[flag]) {
        socketClients[flag].forEach(function (socket, idx) {
            if (socket.id == socketClient.id)
                socketClients[flag].splice(idx, 1);
        });
    }
};

var isWatch = {};
var watchFile = function (flag, fileName) {
    if (!isWatch[flag]) {
        file(fileName).startWatch(function (data) {
            socketClients[flag].forEach(function (socket, idx) {
                socket.send(data.replace(/[\n]/gi, '<br />'));
            });
        });

        isWatch[flag] = true;
    }
};

server.Start(watchFile, setSocketClients, removeSocketClients);