var express = require('express');
var path = require('path');

var app = express();

var bodyParser = require('body-parser');

//Add static resources
app.use(express.static(path.join(__dirname + '/client')));

app.use(bodyParser.urlencoded({
    extended: true
}));

console.log(__dirname + '/client');

app.use(bodyParser.json());

//Basic routing for all routes
app.all('/*', function(req, res) {
    console.log('Made it here');
   res.sendFile(__dirname + '/client/index.html');
});

//TODO: Replace with configuration file
//TODO: Replace console statement with logger
app.listen(3000, function() {
    console.log('Server starting on port 3000');
});


