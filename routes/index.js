var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  console.log(123)
  res.send('test');
});

module.exports = router;
