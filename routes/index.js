var express = require('express');
var router = express.Router();
const requestify = require('requestify');
const format = require('string-format');
const utils = require('../modules/utils');

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

    // make request to get content
    requestify.get(valid_url).then(function (response) {
        // Get the response body
        let body = response.getBody();
        console.log(format('[+] Cached - {}', url).green.bold);
        res.send(body);     // respond with body
    }).catch(function (err) {
        console.log(err);
        // error occured
        console.log(format('{} on URL - {}', err.message || err, url).red.bold);
        return next(err);
    });
});

module.exports = router;
