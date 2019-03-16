var express = require('express');
var router = express.Router();
const format = require('string-format');
const utils = require('../modules/utils');
const cacher = require('../modules/cacher');

/* GET home page. */
router.get('/*', function (req, res, next) {
    let url = req.originalUrl;      // get URL
    if (url === '/') return res.send({status: 'online'});
    // check if right URL, if not, return with nothing
    if (!url.startsWith('/cache.php?')) return res.send();

    // check if url is valid
    let valid_url = utils.is_valid_url(url);
    if(valid_url instanceof Error) return next(valid_url);
    // invalid domain if undefined
    if(valid_url === undefined) return res.send();

    // at this point, we have a valid URL, get it's content
    cacher.cache(valid_url).then(function (content){
        console.log(format('[+] {}', valid_url).green.bold);
        return res.send(content);
    }).catch(function (err){
       return next(err);
    });

});

module.exports = router;
