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

const getSong = songName => {
    // const randIndex = Math.floor(Math.random() * songsCopy.length);
    const randomSong = songsCopy[songName];
    console.log('randomSong', randomSong, songName);

    const permutation = _.shuffle([0, 1, 2, 3]);
    // const permutation = [2, 3, 0, 1];
    return (message = Object.assign({}, { permutation }, randomSong));
};

io.on('connection', function(socket) {
    console.log('a user connected');
    socket.on('disconnect', function() {
        console.log('user disconnected');
    });

    socket.on('big_screen_ready', () => {
        socket.broadcast.emit('start_host');
    });

    socket.on('send_song', songName => {
        const message = getSong(songName);
        socket.broadcast.emit('get_song', message);
    });

    socket.on('add_score', message => {
        socket.broadcast.emit('update_score', message);
    });

    socket.on('reload_turn', () => {
        const permutation = _.shuffle([0, 1, 2, 3]);
        // const permutation = [2, 3, 0, 1];
        const message = {
            permutation,
        };
        socket.broadcast.emit('reload_turn', message);
    });
});

http.listen(port, function() {
    console.log('listening on *:' + port);
});
