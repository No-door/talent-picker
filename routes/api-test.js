var express = require('express');
const {WebClient} = require("@slack/web-api");
var router = express.Router();
require('dotenv').config()



/* GET home page. */
router.get('/', function (req, res, next) {
    res.send('test');
});

module.exports = router;
