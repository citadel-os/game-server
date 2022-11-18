var express = require('express');
var app = express();


const citadel = require('./routes/citadel');
app.use('/citadel', citadel);

app.listen(8000, function () {
    console.log('listening to port 8000');
});