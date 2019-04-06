var express = require('express');
var app = express();
var port = 8080;

app.use(express.static(__dirname + '/src'));


// start the server
app.listen(port, function() {
  console.log('app started');
});

// route our app
app.get('/', function(req, res) {
    res.sendfile('./src/index.html');
});