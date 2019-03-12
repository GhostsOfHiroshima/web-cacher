var express = require('express');
var router = express.Router();
const requestify = require('requestify');
const format = require('string-format');

/**
 * Replace all chars
 * @param search
 * @param replacement
 * @returns {string}
 */
String.prototype.replaceAll = function (search, replacement) {
    var target = this;
    return target.replace(new RegExp(search, 'g'), replacement);
};

/* GET home page. */
router.get('/*', function (req, res, next) {
    let url = req.originalUrl;      // get URL
    // check if right URL
    if (!url.startsWith('/cache/')) return next();

    url = url.substring(7, url.length);
    url = url.replaceAll('_SLASH_', '/').replaceAll('_QUESTION_', '?');

    // we have the URL at this point, check if it starts with http:// or https://
    if (!url.startsWith('http://') && !url.startsWith('https://')) return next(new Error('URL doesn\'t start with http/s'));

    // make request to get content
    requestify.get(url).then(function (response) {
        // Get the response body
        let body = response.getBody();
        console.log(format('[+] Cached - {}', url).green.bold);
        res.send(body);     // respond with body
    }).catch(function (err) {
        // error occured
        console.log(format('[!] Error: {} on URL - {}', err.message || err, url).red.bold);
        return next(err);
    });
});

module.exports = router;
