'use strict';

var utils = require('./pouch-utils');
var OAuth = require('oauth');
var extend = require('pouchdb-extend');


var consumerKey = "",
    consumerSecret = "",
    userKey = "",
    userSecret = "";


exports.oauthConsumerKey = function (key, secret) {
    consumerKey = key;
    consumerSecret = secret;
};

exports.oauthUserKey = function (key, secret) {
    userKey = key;
    userSecret = secret;
};

exports.enableOAuth = utils.toPromise(function (callback) {
    var db = this;
    callback(null, 'ok');
});

exports.disableOAuth = function () {
    console.log("OAUTH disabled");
}

exports.mkAuthenticateHeaderValue = function (url, method) {
    method = method || "GET";
    var oauth = new OAuth.OAuth(
        url, url,
        consumerKey, consumerSecret,
        '1.0', null,
        'HMAC-SHA1'
    );
    var orderedParameters = oauth._prepareParameters(userKey, userSecret, method, url);
    return oauth._buildAuthorizationHeaders(orderedParameters);
}

exports.enableOauthSync = function (remoteDb, options) {
    options = options || {};

    extend(options, {
        live: true,
        retry: true,

        ajax: {
            beforeSend: function (xhr) {
                xhr.setRequestHeader('Authorization', pouchdbOauth.mkAuthenticateHeaderValue(this.url, this.method))
            }
        }
    });

    return PouchDB.sync('mycards', remoteDb, options)
}

/* istanbul ignore next */
if (typeof window !== 'undefined' && window.PouchDB) {
    window.PouchDB.plugin(exports);
}
