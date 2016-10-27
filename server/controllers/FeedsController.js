var express = require('express');
var router = express.Router();
var constants = require('../util/ConstantsUtil');
var validate = require('../util/RequestValidate');
var cacheClient = require('../util/CacheConnectionUtil');

router.get('/user/:userID/feed', function (req, res) {
    validate(req);

    var user = req.params.userID;

    if (user == null || user.length == 0) {
        res.status(400).send(JSON.stringify({
            msg: "Username cannot be empty",
            err: "Failed to finish feed operation"
        }));
        return;
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
        // Retrieve top 100 tweets from user's timeline
        cacheClient.lrange(constants.userPrefix + ":" + user + ":" + constants.newsFeeds, 0, constants.feedSize-1, function (err, replies ) {
            if (err) {
                res.status(500).send(JSON.stringify({err: err, msg: "Please try again later"}));
                return;
            }
            cacheClient.mget(replies, function (err, replies) {
                if (err) {
                    res.status(500).send(JSON.stringify({err: err, msg: "Please try again later"}));
                    return;
                }
                res.send(replies);
            });
        });
    });
});

module.exports = router;