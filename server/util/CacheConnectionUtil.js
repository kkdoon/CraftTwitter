var redis = require('redis');
var settings = require('../config/settings');

var environment = process.env.NODE_ENV || 'dev';
var host = settings.cache[environment].hostname;
var port = settings.cache[environment].port;

// Connect to Redis
client = redis.createClient(port, host);

client.on("error", function (err) {
    console.log("" + err);
    // Terminating application
    process.exit(1)
});

console.log('Redis connected....');

module.exports = client;
