const requestify = require('requestify');
const Q = require('q');
const NodeCache = require( "node-cache" );
const localDB = new NodeCache();
const config = require('../config');
const format = require('string-format');

let _recaptcha_version = undefined;
const RECAPTCHA_API = 'https://lastgrupdate.com/api/last-update?version_only=web_cacher';

/**
 * Download URL
 * @param url
 */
function download_url(url){
    let deferred = Q.defer();
    // make request to get content
    requestify.get(url).then(function (response) {
        // Get the response body
        let body = response.getBody();
        deferred.resolve(body);
    }).catch(function (err) {
        deferred.reject(err);
    });
    return deferred.promise;
}

/**
 * Get URL from storage
 * @param url
 */
function get_from_storage(url){
    let deferred = Q.defer();
    localDB.get( url, function( err, value ){
        if( !err ) return deferred.resolve(value);
        if(err == null && value === undefined) return deferred.resolve(undefined);      // not set
        deferred.reject(err.message || err);
    });
    return deferred.promise;
}
/**
 * Set to storage
 * @param url
 * @param content
 */
function set_to_storage(url, content){
    let deferred = Q.defer();
    localDB.set( url, content, function( err, success ){
        if( !err && success ) deferred.resolve(true);
        else deferred.reject(new Error(err.message || err));
    });
    return deferred.promise;
}
/**
 * Flush storage
 */
function flush_storage(){
    localDB.flushAll();
}

/**
 * Check if recaptcha didn't changed it's version
 */
setInterval(function (){
    download_url(RECAPTCHA_API).then(function (v){
        v = v.version;
        // if versions differ, flush local db
        if(v !== _recaptcha_version){
            _recaptcha_version = v;
            flush_storage();
        }
    }).catch(function (err){
       console.log(format('[!] Error on recaptcha version regular check: {}', err.message || err).yellow.bold);
    });
}, 1000 * 60 * 60 * config.recaptcha_version_check);     // every 3 hours
//}, 1000 * config.recaptcha_version_check);     // every 3 seconds

module.exports = {
    cache: function(url){
        let deferred = Q.defer();
        let from_db = false;
        // try to get it from storage 1st
        get_from_storage(url).then(function (c){
           if(!c) return download_url(url);     // if not set inside DB, download
           else {
               from_db = true;     // so we know not to re-set it
               return c;
           }                       // if set, do not re-download
        }).then(function (c){
            deferred.resolve(c);   // return content
            // if we didn't got it from DB, set it now
            if(!from_db) return set_to_storage(url, c);     // set to storage
        }).catch(function (err){
            if(err.code > 400 && err.code < 500) deferred.reject(new Error(format('{} response from server', err.code)));
            else if(err.code > 500 && err.code < 600) deferred.reject(new Error(format('{} response from server', err.code)));
            deferred.reject(new Error(err.message || err));
        });
        return deferred.promise;
    }
};