var express = require('express');
var router = express.Router();
var passport = require('passport');
var ldapStrategy = require('passport-ldapauth');
var constants = require('../util/ConstantsUtil');
var cacheClient = require('../util/CacheConnectionUtil');
var validate = require('../util/RequestValidate');

var options = {
    server: {
        url: 'ldap://54.172.26.24:389',
        searchBase: 'ou=Users,dc=openstack,dc=org',
        searchFilter: '(uid={{username}})',
    }
};

passport.use(new ldapStrategy(options));

/*passport.serializeUser(function(user, done) {
    done(null, user);
});

passport.deserializeUser(function(user, done) {
    done(null, user);
});*/

router.post('/login', passport.authenticate('ldapauth', {session: false}), function(req, res) {
    //res.send({status: 'ok'});
    // Check if userID exists in cache
    validate(req);
    var userName = req.body.username;
    cacheClient.hexists(constants.usersMapKey, userName, function (err, replies) {
        if(err){
            res.status(500).send(JSON.stringify({err: err, msg: "Please try again later..."}));
            return;
        }
        if(replies != 1){
            // If user does not exists, then add userid in users map
            cacheClient.hset(constants.usersMapKey, userName, 1, function (err, replies) {
                if(err || replies != 1){
                    res.status(500).send(JSON.stringify({err: err, msg: "Please try again later"}));
                    return;
                }
                res.send(JSON.stringify({msg: "Login successful. Welcome " + userName, userID: userName}));
                return;
            });
        }else{
            res.send(JSON.stringify({msg: "Login successful. Welcome " + userName, userID: userName}));
            return;
        }
    });
});

module.exports = router;