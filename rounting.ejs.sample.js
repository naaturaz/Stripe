
var express = require('express');
var app = express();
//https://ejs.co/
app.set('view engine', 'ejs');

app.listen(3000);
console.log("listening in 3000");

app.get('/about', function(req, res) {
    res.render('about');
});

app.get('/', function(req, res) {
    res.render('home');
});

app.get('*', function(req, res) {
    res.render('error');
});