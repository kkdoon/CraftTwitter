var express = require('express');
var router = express.Router();
var validate = require('../util/RequestValidate');
var cacheClient = require('../util/CacheConnectionUtil');
//var model = require('../models/index');
    
router.get('/follow', function (req, res) {
    validate(req);
    
});

module.exports = router;