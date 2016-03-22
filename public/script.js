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