var express = require('express');
var router = express.Router();
var constants = require('../util/ConstantsUtil');
var validate = require('../util/RequestValidate');
var cacheClient = require('../util/CacheConnectionUtil');
//var model = require('../models/index');
    
router.post('/signup', function (req, res) {
    validate(req);
    var userName = req.body.username;
    var password = req.body.password;

    if(!isRequestValid(userName, password)){
        res.status(400).send(JSON.stringify({err: "Username and password cannot be empty", msg: "Failed to sign-up user"}));
        return;
    }

    // Check if userID exists in cache
    cacheClient.hexists(constants.usersMapKey, userName, function (err, replies) {
        if(err){
            res.status(500).send(JSON.stringify({err: err, msg: "Please try again later"}));
            return;
        }
        if(replies === 1){
            res.status(400).send(JSON.stringify({err: "Username exists. Please sign-up with another username", msg: "Failed to sign-up user"}));
        }else{// If user does not exists, then add userid in users map
            cacheClient.hset(constants.usersMapKey, userName, 1, function (err, replies) {
                if(err || replies != 1){
                    res.status(500).send(JSON.stringify({err: err, msg: "Please try again later"}));
                    return;
                }// Add user profile info in user:userid:profile hmap key
                cacheClient.hmset(constants.userPrefix + ":" + userName + ":" + constants.userProfile, "userName", userName, "password", password, function (err, replies) {
                    if(err || replies != 'OK'){
                        res.status(500).send(JSON.stringify({err: err, msg: "Please try again later"}));
                        return;
                    }
                    res.send(JSON.stringify({msg: "Signed up user: " + userName}));
                });
            });
        }
    });
});

router.post('/login', function (req, res) {
    validate(req);
    var userName = req.body.username;
    var password = req.body.password;

    if(!isRequestValid(userName, password)){
        res.status(400).send(JSON.stringify({err: "Username and password cannot be empty", msg: "Failed to sign-in user"}));
        return;
    }

    cacheClient.hget(constants.userPrefix + ":" + userName + ":" + constants.userProfile, "password", function (err, replies) {
        if(err){
            res.status(500).send(JSON.stringify({err: err, msg: "Please try again later"}));
            return;
        }
        if(replies == password ) {
            res.send(JSON.stringify({msg: "Login successful. Welcome " + userName}));
        }else{
            res.status(400).send(JSON.stringify({msg: "Login failed. Please make sure username/password is valid"}));
        }
    });
});

function isRequestValid(userName, password){
    if (userName == null || userName.length == 0 || password == null || password.length == 0){
        return false;
    }
    return true;
}

module.exports = router;