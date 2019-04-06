var express = require('express');
var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var port = 8080;

// app.use(express.static(__dirname));
app.use(express.static(__dirname + '/src'));

// start the server

// route our app
app.get('/', function(req, res) {
    res.sendFile(__dirname + '/src/index.html');
});

io.on('connection', function(socket) {
    console.log('a user connected');
    socket.on('disconnect', function() {
        console.log('user disconnected');
    });

    // socket.on('chat message', function(msg) {
    //     console.log('message: ' + msg);
    // });
});

http.listen(port, function() {
    console.log('listening on *:' + port);
});
