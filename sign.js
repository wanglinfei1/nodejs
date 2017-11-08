const appKey = '3IAYPuAw1uUFac1p';
const appId = '1106438561';
var CryptoJS = require("crypto-js");

var raw = function (args) {
    var keys = Object.keys(args);
    keys = keys.sort()
    var newArgs = {};
    keys.forEach(function (key) {
        if (key !== 'sig') {
            newArgs[key] = args[key];
        }
    });
    var string = '';
    for (var k in newArgs) {
        string += '&' + k + '=' + newArgs[k];
    }
    string = string.substr(1);
    return string;
};
const sign = function (url, params,methods) {
    var string = raw(params);
    var method =methods||'GET'
    var getEncode = method.toUpperCase() +'&'+ encodeURIComponent(url) +'&'+ encodeURIComponent(string)
    var key = appKey+'&'
    var sign = CryptoJS.HmacSHA1(getEncode, key).toString();
    var sig = new Buffer(sign).toString('base64');
    console.log(sig)
    return sig;
};
module.exports = sign;
