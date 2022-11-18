const express = require('express')

let app = express.Router()

app.get('/', function (req, res) {
    res.send('citadel')
});

app.get('/:id', function (req, res) {
    res.send('citadel: ' + req.params.id);
});

module.exports = app