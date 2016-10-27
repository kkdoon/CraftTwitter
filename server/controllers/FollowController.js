var express = require('express');
var router = express.Router();
var constants = require('../util/ConstantsUtil');
var validate = require('../util/RequestValidate');
var cacheClient = require('../util/CacheConnectionUtil');

router.get('/users', function (req, res) {
    validate(req);

    var filterUser = req.query.user;

    cacheClient.hkeys(constants.usersMapKey, function (err, replies) {
        if (err) {
            res.status(500).send(JSON.stringify({err: err, msg: "Please try again later"}));
            return;
        }
        var userList = [];
        replies.forEach(function (reply) {
            if(filterUser != reply){
                userList.push(reply);
            }
        });
        res.json(userList);
    });
});

router.post('/user/:userID/follow', function (req, res) {
    validate(req);

    var user1 = req.params.userID;
    var user2 = req.query.user;

    //console.log(user1 + "," + user2);
    if(!isRequestValid(user1)){
        res.status(400).send(JSON.stringify({err: "Follow action cannot be completed", msg: "Username of main user should be provided"}));
        return;
    }

    if(!isRequestValid(user2)){
        res.status(400).send(JSON.stringify({err: "Follow action cannot be completed", msg: "Username of user to be followed should be provided"}));
        return;
    }

    // Check if userID exists in cache
    cacheClient.hexists(constants.usersMapKey, user1, function (err, replies) {
        if (err) {
            res.status(500).send(JSON.stringify({err: err, msg: "Please try again later..."}));
            return;
        }
        if (replies === 0) {
            res.status(400).send(JSON.stringify({
                msg: "User " +  user1 + " does not exist. Please provide valid username",
                err: "Failed to finish follow operation"
            }));
            return;
        }
        cacheClient.hexists(constants.usersMapKey, user2, function (err, replies) {
            if (err) {
                res.status(500).send(JSON.stringify({err: err, msg: "Please try again later..."}));
                return;
            }
            if (replies === 0) {
                res.status(400).send(JSON.stringify({
                    msg: "User " +  user2 + " does not exist. Please provide valid username",
                    err: "Failed to finish follow operation"
                }));
                return;
            }
            // Add user2 to user1's following list
            cacheClient.sadd(constants.userPrefix + ":" + user1 + ":" + constants.following, user2, function (err) {
                if(err){
                    res.status(500).send(JSON.stringify({err: err, msg: "Please try again later"}));
                    return;
                }
                // Add user1 to user2's followers list
                cacheClient.sadd(constants.userPrefix + ":" + user2 + ":" + constants.followers, user1, function (err) {
                    if (err) {
                        res.status(500).send(JSON.stringify({err: err, msg: "Please try again later"}));
                        return;
                    }
                    res.send(JSON.stringify({msg: "User " + user1 + " started following user " + user2}));
                });
            });
        });
    });
});

router.get('/user/:userID/follow', function (req, res) {
    validate(req);

    var user = req.params.userID;

    if(!isRequestValid(user)){
        res.status(400).send(JSON.stringify({err: "Follow list cannot be retrieved", msg: "Username of main user should be provided"}));
        return;
    }

    cacheClient.smembers(constants.userPrefix + ":" + user + ":" + constants.following, function (err, replies) {
        if (err) {
            res.status(500).send(JSON.stringify({err: err, msg: "Please try again later..."}));
            return;
        }
        res.json(replies);
    });
});

router.get('/user/:userID/unfollow', function (req, res) {
    validate(req);

});

function isRequestValid(user){
    if (user == null || user.length == 0){
        return false;
    }
    return true;
}

module.exports = router;