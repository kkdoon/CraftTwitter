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

    if(!isRequestValid(user2)){
        res.status(400).send(JSON.stringify({err: "Follow action cannot be completed", msg: "Username of user to be followed should be provided"}));
        return;
    }

    /*var resp1 = isUserValid(user1);
    if(resp1 != null){
        res.status(resp1.code).send(resp1.val);
        return;
    }
    var resp2 = isUserValid(user2);
    if(resp2 != null){
        res.status(resp2.code).send(resp2.val);
        return;
    }*/

    // Check if userID exists in cache
    cacheClient.hexists(constants.usersMapKey, user1, function (err, replies) {
        if (err) {
            res.status(500).send(JSON.stringify({err: err, msg: "Please try again later..."}));
            return;
        }
        if (replies === 0) {
            res.status(500).send(JSON.stringify({
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
                res.status(500).send(JSON.stringify({
                    msg: "User " +  user2 + " does not exist. Please provide valid username",
                    err: "Failed to finish follow operation"
                }));
                return;
            }
            // Add user2 to user1's following list
            cacheClient.lpush(constants.userPrefix + ":" + user1 + ":" + constants.following, user2, function (err) {
                if(err){
                    res.status(500).send(JSON.stringify({err: err, msg: "Please try again later"}));
                    return;
                }
                // Add user1 to user2's followers list
                cacheClient.lpush(constants.userPrefix + ":" + user2 + ":" + constants.followers, user1, function (err) {
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

router.get('/user/:userID/unfollow', function (req, res) {
    validate(req);

});

function isRequestValid(user){
    if (user == null || user.length == 0){
        return false;
    }
    return true;
}

/* Check if userID exists in cache
function isUserValid(user){
    cacheClient.hexists(constants.usersMapKey, user, function (err, replies) {
        console.log("resp:" + replies);
        if (err) {
           return {code: 500,  val: JSON.stringify({err: err, msg: "Please try again later..."})};
        }
        if (replies === 0) {
            console.log("resp:yes");
            return {code: 400, val: JSON.stringify({
                msg: "User " +  user+ " does not exist. Please provide valid username",
                err: "Failed to sign-up user"
            })};
        }
    });
}*/

module.exports = router;