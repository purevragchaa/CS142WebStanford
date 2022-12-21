'use strict';

var express = require('express');
// var cors = require('cors')
var portno = 3000; // Port number to use
var app = express();

// app.use(cors())
app.use(express.static(__dirname));

let users = [
    { id: 1, name: 'dorj' }, // a resource
    { id: 2, name: 'bat' } // a resource
]

//unique URI --> /user --> an endpoint for user

app.get('/user', (req, res) => {
    res.json(users);
});

app.get('/user/:id', (req, res) => {

    let id = req.params.id;
    // res.set('Content-Type', 'application/json')
    // res.send('{"ps":"prop val"}');

    res.status(200).json(obj);
})

var server = app.listen(portno, function() {
    var port = server.address().port;
    console.log('Listening at http://localhost:' + port + ' exporting the directory ' + __dirname);
});