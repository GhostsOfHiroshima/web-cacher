<?php
/**
 * Created by PhpStorm.
 * User: icebox
 * Date: 3/1/19
 * Time: 9:41 AM
 */

/**
 * Download URL content
 * @param $url
 * @return false|string
 */
function download($url){
    $source = file_get_contents($url);
    return $source;
}

/**
 * Replace URL given through web request
 * @param $url
 * @return string
 */
function replace_url($url){
    $replaced = str_replace('_QUESTION_', '?', $url);
    $replaced = str_replace('_SLASH_', '/', $replaced);
    return $replaced;
}

/**
 * Main method
 */
function main(){
    $full_link = (isset($_SERVER['HTTPS']) && $_SERVER['HTTPS'] === 'on' ? "https" : "http") . "://$_SERVER[HTTP_HOST]$_SERVER[REQUEST_URI]";
    $cache_url = substr($full_link, strrpos($full_link, '?') + 1);
    $cache_url = replace_url($cache_url);
    $content = download($cache_url);
    echo $content;
}

main();

?>