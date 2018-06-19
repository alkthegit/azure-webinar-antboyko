var express = require('express');
var router = express.Router();
var conf = require("nconf");

conf
    .env()
    .defaults({
        name: "Azure Webinar / Alex Kuzin"
    })

/* GET home page. */
router.get('/', function(req, res, next) {
    // res.render('index', { title: 'Express' });
    res.render('index', { title: conf.get("name") });
});

module.exports = router;