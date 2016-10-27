var express = require('express');
var router = express.Router();
var constants = require('../util/ConstantsUtil');
var validate = require('../util/RequestValidate');
var cacheClient = require('../util/CacheConnectionUtil');
var MAX_TWEET_SIZE = 140;

router.post('/user/:userID/post', function (req, res) {
    validate(req);

    var user = req.params.userID;
    var msg = req.body.msg;

    if (user == null || user.length == 0) {
        res.status(400).send(JSON.stringify({
            msg: "User " + user + " does not exist. Please provide valid username",
            err: "Failed to finish post operation"
        }));
        return;
    }

    if (msg == null || msg.length == 0) {
        res.status(400).send(JSON.stringify({
            msg: "Please provide valid message",
            err: "Failed to finish post operation"
        }));
        return
    }

    if (msg.length > MAX_TWEET_SIZE) {
        res.status(400).send(JSON.stringify({
            msg: "Please restrict tweet to 140 characters",
            err: "Failed to finish post operation"
        }));
        return
    }

    // Check if userID exists in cache
    cacheClient.hexists(constants.usersMapKey, user, function (err, replies) {
        if (err) {
            res.status(500).send(JSON.stringify({err: err, msg: "Please try again later..."}));
            return;
        }
        if (replies === 0) {
            res.status(500).send(JSON.stringify({
                msg: "User " + user + " does not exist. Please provide valid username",
                err: "Failed to finish post operation"
            }));
            return;
        }
        // Generate tweet id
        cacheClient.incr(constants.tweetIdKey, function (err, replies) {
            if (err) {
                res.status(500).send(JSON.stringify({err: err, msg: "Please try again later"}));
                return;
            }
            var tweetId = replies;
            // Post tweet to user's timeline
            cacheClient.set(constants.tweetPrefix + ":" + tweetId, msg, function (err) {
                if (err) {
                    res.status(500).send(JSON.stringify({err: err, msg: "Please try again later"}));
                    return;
                }
                // Add tweet id to user's post list
                cacheClient.lpush(constants.userPrefix + ":" + user + ":" + constants.posts, tweetId, function (err) {
                    if (err) {
                        res.status(500).send(JSON.stringify({err: err, msg: "Please try again later"}));
                        return;
                    }
                    // Retrieve all users following current user
                    cacheClient.lrange(constants.userPrefix + ":" + user + ":" + constants.followers, 0, -1, function (err, replies ) {
                        replies.forEach(function (reply) {
                            // Post on all users feed list
                            cacheClient.lpush(constants.userPrefix + ":" + reply + ":" + constants.newsFeeds, tweetId, function (err) {
                                if (err) {
                                    res.status(500).send(JSON.stringify({err: err, msg: "Please try again later"}));
                                    return;
                                }
                            });
                        });
                        // Post on current user's list
                        cacheClient.lpush(constants.userPrefix + ":" + user + ":" + constants.newsFeeds, tweetId, function (err) {
                            if (err) {
                                res.status(500).send(JSON.stringify({err: err, msg: "Please try again later"}));
                                return;
                            }
                            res.send(JSON.stringify({msg: "Tweet posted successfully!"}));
                        });
                    });
                });
            });
        });
    });
});


module.exports = router;