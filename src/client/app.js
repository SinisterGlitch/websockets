'use strict';

var socket = io.connect();
var users = [];

socket.on('newMessage', function (data) {
    var entry = document.createElement('li');
    var message = data.username + ': ' + data.message;
    entry.appendChild(document.createTextNode(message));
    document.getElementById('messages').appendChild(entry);
});

socket.on('getClients', function (usernames) {
    var container = document.getElementById('users');
    container.innerHTML = '';

    usernames.forEach(function (username) {
        var entry = document.createElement('li');
        entry.onclick = openPrivateChat.bind(this, username);
        entry.id = username;
        entry.appendChild(document.createTextNode(username));
        container.appendChild(entry);
    });
});

function send() {
    event.preventDefault();
    var input = document.getElementById('message');
    socket.emit('addMessage', input.value);
    input.value = '';
}

function openPrivateChat(username) {
    var textarea = document.createElement('textarea');
    textarea.id = 'message-'+username;

    var button = document.createElement('button');
    button.appendChild(document.createTextNode('send'));
    button.onclick = onPrivateSendClick.bind(this, username, 'message-'+username);

    var li = document.getElementById(username);
    li.appendChild(textarea);
    li.appendChild(button);
    li.onclick = '';
}

function onPrivateSendClick(username, id) {
    socket.emit('addPrivateMessage', {
        message: document.getElementById(id).value,
        username: username
    });
}