const config = require('../config');
const ltrim = require('ltrim');

module.exports = {
    is_valid_url: function(url){
        let success = false;

        // check if URL is OK
        url = url.substring(11, url.length);
        url = url.replaceAll('_SLASH_', '/').replaceAll('_QUESTION_', '?');

        // we have the URL at this point, check if it starts with http:// or https://
        if (!url.startsWith('http://') && !url.startsWith('https://')) return new Error('URL doesn\'t start with http/s');

        // see if domain is valid
        config.valid_cache_domains.forEach(function(e){
            let u = ltrim(url, 'http://');
            u = ltrim(u, 'https://');
            u = ltrim(u, 'www.');
            let utl = u.toLowerCase();
            if(utl.startsWith(e)) success = true;

            // allow any domain
            if(e === '*') success = true;
        });
        if(!success) return undefined;      // no success
        return url;
    }
};