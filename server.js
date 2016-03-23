'use strict';

var express = require('express'), app = express();
var jade = require('jade');
var http = require('http')
    , server = http.createServer(app)
    , io = require('socket.io').listen(server);

app.set('views', __dirname + '/views');
app.set('view engine', 'jade');
app.set("view options", {layout: false});
app.use(express.static(__dirname + '/public'));

app.get('/', function (req, res) {
    res.render('index.jade');
});

var messages = [];
server.listen(16558);

io.sockets.on('connection', function (socket) {

    io.sockets.emit('newMessage', {
        username: 'admin',
        message: socket.id + ' joined'
    });

    io.sockets.emit('getClients', Object.keys(io.engine.clients));

    socket.on('disconnect', function () {
        io.sockets.emit('getClients', Object.keys(io.engine.clients));
        io.sockets.emit('newMessage', {
            username: 'admin',
            message: socket.id + ' left'
        });
    });

    socket.on('addMessage', function (message) {
        if (message) {
            messages.push(message);
            io.sockets.emit('newMessage', {
                username: socket.id,
                message: message
            });
        }
    });

    socket.on('addPrivateMessage', function (data) {
        io.sockets.connected['/#'+data.username].emit('newMessage', {
            username: data.username,
            message: data.message
        });
    });
});