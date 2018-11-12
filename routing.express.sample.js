//https://expressjs.com/en/guide/routing.html


var express = require('express');
var app = express();

// respond with "hello world" when a GET request is made to the homepage
app.get('/', function (req, res) {
  res.send('hello world');
});

// GET method route
app.get('/', function (req, res) {
    res.send('GET request to the homepage');
});
  
// POST method route
app.post('/', function (req, res) {
    res.send('POST request to the homepage');
});

app.all('/secret', function (req, res, next) {
console.log('Accessing the secret section ...');
    next(); // pass control to the next handler
});

app.get('/', function (req, res) {
    res.send('root');
});


//https://expressjs.com/en/4x/api.html#res.redirect
app.get('/about', function (req, res) {
    res.redirect('..about.html');
    // res.send('About.html');
});

app.listen(3000);
console.log("listening in 3000");