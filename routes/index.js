var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.status(200).json({
    status: `OK`,
    service: `claim`
  });
});

module.exports = router;
