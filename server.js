var express = require('express');
var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var port = 8080;

app.use(express.static(__dirname + '/src'));

// route our app
app.get('/', function(req, res) {
    res.sendFile(__dirname + '/src/index.html');
});

const buttonMapping = {
    0: 'B',
    1: 'A',
    2: 'Y',
    3: 'X',
    12: 'D_UP',
    13: 'D_DOWN',
    14: 'D_LEFT',
    15: 'D_RIGHT',
};

io.on('connection', function(socket) {
    console.log('a user connected');
    socket.on('disconnect', function() {
        console.log('user disconnected');
    });

    // socket.on('chat message', function(msg) {
    //     console.log('message: ' + msg);
    // });

    socket.on('ready_to_play', () => {
        socket.emit('generate_permutation', {
            permutation: [3, 0, 2, 1],
        });
    });
});

http.listen(port, function() {
    console.log('listening on *:' + port);
});
