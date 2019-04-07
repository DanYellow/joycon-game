const express = require('express');
const app = require('express')();
const http = require('http').Server(app);
const io = require('socket.io')(http);
const _ = require('lodash');
const songs = require('./songs.json');

const songsCopy = Object.assign([], songs);

const port = 8080;

app.use(express.static(__dirname + '/src'));

// route our app
app.get('/', function(req, res) {
    res.sendFile(__dirname + '/src/index.html');
});

io.on('connection', function(socket) {
    console.log('a user connected');
    socket.on('disconnect', function() {
        console.log('user disconnected');
    });

    socket.on('ready_to_play', () => {
        const randIndex = Math.floor(Math.random() * songsCopy.length);
        const randomSong = songsCopy[randIndex];
        // songsCopy.splice(randIndex, 1);

        const message = Object.assign(
            {},
            { permutation: [2, 3, 0, 1] }, //_.shuffle([0, 1, 2, 3]) },
            randomSong
        );
        socket.emit('generate_permutation', message);
    });
});

http.listen(port, function() {
    console.log('listening on *:' + port);
});
