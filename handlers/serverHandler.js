/*
*  NODE.JS第一个练习项目
*  模块说明：HTTP服务及websocked服务
*/

var http = require('http'),
    url = require('url'),
    fs = require('fs'),
    fileRouter = require('../configs/fileRouter'),
    socketIo = require('socket.io');

var start = function (callback1, callback2, callback3) {
    var pathname;
    var httpServer = http.createServer(function (request, response) {
        pathname = url.parse(request.url).pathname;
        if (pathname != '' && pathname.substr(0, 1) == '/')
            pathname = pathname.substr(1);

        if (fileRouter[pathname]) {
            response.writeHead(200, { "Content-Type": "text/html" });
            response.write(fs.readFileSync('index.html'));
            response.end();
            callback1(pathname, fileRouter[pathname]);
        } else {
            response.writeHead(200, { "Content-Type": "text/plain" });
            response.write("404 NOT FOUND");
            response.end();
        }
    }).listen(8086, '192.168.8.70');


    socketIo(httpServer).sockets.on('connection', function (socket) {
        callback2(pathname, socket);
        socket.on('disconnect', function () {
            callback3(pathname, socket);
        });
    });
};

exports.Start = start;