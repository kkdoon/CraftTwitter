// Importing all modules
var express = require('express');
var methodOverride = require('method-override');
var bodyParser = require('body-parser');

// Create the application
var app = express();

// Configuration

// Config files
var settings = require('./config/settings');

var environment = process.env.NODE_ENV || 'dev';
console.log('Environment: ' + environment);
var port = settings.port[environment];

var version = '/'  + settings.version;
var routes = require('./controllers/routes');

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use(methodOverride('X-HTTP-Method-Override'));

// CORS Support
app.use(function(req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    res.header('Access-Control-Allow-Headers', 'Content-Type');
    next();
});

// Alive Api
app.use("/alive", function (req, res, next) {
    res.send("Web Server up!");
    next();
});

// Route Handlers
app.use(version, routes.authApi);
app.use(version, routes.followApi);
app.use(version, routes.postsApi);
app.use(version, routes.feedsApi);

// Start web server
app.listen(port);
console.log('Listening on port ' + port);