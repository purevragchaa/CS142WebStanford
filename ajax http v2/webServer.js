'use strict';
var express = require('express');
var portno = 3000; // Port number to use

var app = express();
app.use(express.json());
app.use(express.static(__dirname));
let users = [
        { id: 1, name: "dorj" },
        { id: 2, name: "bat" },
    ]
    // http://localhost:3000/user
app.get('/user', (req, res) => {
    res.json(users);
    // res.set('Content-Type', 'application/json')
    // res.send('{"id":1, "name":"dorj"}'); 
});

app.get('/user/:id', (req, res) => {
    let user = users[req.params.id - 1];
    res.status(200).json(user);
});

app.post('/user', (req, res) => {
    // insert into
    console.log(req.body);
    let result = {
        status: 'User is successfilly created!'
    }
    res.json(result);
});


var server = app.listen(portno, function() {
    var port = server.address().port;
    console.log('Listening at http://localhost:' + port + ' exporting the directory ' + __dirname);
});