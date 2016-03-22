var express = require('express'), app = express();
var jade = require('jade');
var http = require('http')
    , server = http.createServer(app)
    , io = require('socket.io').listen(server);

app.set('views', __dirname + '/views');
app.set('view engine', 'jade');
app.set("view options", {layout: false});
app.use(express.static(__dirname + '/public'));

// default route
app.get('/', function (req, res) {
    res.render('index.jade');
});

// global variables
var messages = [];
var sockets = [];

server.listen(16558);
io.sockets.on('connection', function (socket) {
    sockets.push(socket);

    io.sockets.emit('newMessage', {
        username: 'admin',
        message: getSocketName(socket) + ' joined'
    });

    var id = socket.id;
    socket.on('disconnect', function () {
        sockets = sockets.filter(function (socket) {
            return id != socket.id;
        });

        io.sockets.emit('getClients', getSocketNames(sockets));
        io.sockets.emit('newMessage', {
            username: 'admin',
            message: getSocketName(socket) + ' left'
        });
    });

    io.sockets.emit('getClients', getSocketNames(sockets));

    socket.on('addMessage', function (message) {
        if (message) {
            messages.push(message);
            io.sockets.emit('newMessage', {
                username: getSocketName(socket),
                message: message
            });
        }
    });
});

function getSocketName(socket) {
    return socket.id.substring(5, 15);
}

function getSocketNames(sockets) {
    return sockets.map(function (socket) {
        return getSocketName(socket);
    });
}