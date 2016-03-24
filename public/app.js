'use strict';

var socket = io.connect();
var users = [];

socket.on('newMessage', function (data) {
    var entry = document.createElement('li');
    var message = data.username + ': ' + data.message;
    entry.appendChild(document.createTextNode(message));
    document.getElementById('messages').appendChild(entry);
});

socket.on('newPrivateMessage', function (data) {
    var li = document.createElement('li');
    li.appendChild(document.createTextNode(data.message));

    var ul = document.getElementById('input-'+data.from);

    if (ul == undefined) {
        openPrivateChat(data.from);
    }

    ul.appendChild(li);
});

socket.on('getClients', function (usernames) {
    var container = document.getElementById('users');
    container.innerHTML = '';

    usernames.forEach(function (username) {
        if (socket.id != username) {
            var entry = document.createElement('li');
            entry.onclick = openPrivateChat.bind(this, username);
            entry.id = username;
            entry.appendChild(document.createTextNode(username));
            container.appendChild(entry);
        }
    });
});

function send() {
    event.preventDefault();
    var input = document.getElementById('message');
    socket.emit('addMessage', socket.id+ ' : ' +input.value);
    input.value = '';
}

function openPrivateChat(username) {
    var ul = document.createElement('ul');
    ul.id = 'input-'+username;

    var div = document.createElement('div');

    var input = document.createElement('input');
    input.id = 'message-'+username;

    var button = document.createElement('button');
    button.appendChild(document.createTextNode('send'));
    button.onclick = onPrivateSendClick.bind(this, socket.id, username);

    var li = document.getElementById(username);
    li.appendChild(ul);
    div.appendChild(input);
    div.appendChild(button);
    li.appendChild(div);

    li.onclick = '';
}

function onPrivateSendClick(from, to) {
    var input = document.getElementById('message-'+to);
    socket.emit('addPrivateMessage', {
        message: socket.id+ ' : ' +input.value,
        from: from,
        to: to
    });
    input.value = '';
}