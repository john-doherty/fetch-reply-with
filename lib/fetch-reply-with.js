'use strict';

var isoFetch = require('isomorphic-fetch');

// holds all replyWiths in memory
var replyWiths = [];

/**
 * extend fetch by adding replyWith property to intercept future requests
 * @param {string} url - url to fetch
 * @param {object} options - fetch options
 * @returns {Promise} executes .then if fetch successful, otherwise .catch
 */
function patchFetch(url, options) {

    options = options || {};
    options.method = options.method || 'GET';

    // if the user supplied a replyWith object, setup a fetch intercept and exit
    if (typeof options.replyWith === 'object') {

        // add fetch intercept and exit
        addReplyWith(url, options.method, options.replyWith.status || 200, options.replyWith.data || '', options.replyWith.headers || {});

        // this was a mock setup, so don't execute the request
        return Promise.resolve();
    }

    // otherwise, attempt to intercept the request or allow it continue as normal
    return new Promise(function (resolve) {

        for (var i = 0, l = replyWiths.length; i < l; i++) {

            var condition = replyWiths[i];

            if (condition.url === url && condition.method === options.method) {

                return resolve(new Response(condition.response.data, {
                    status: condition.response.status,
                    headers: new Headers(condition.response.headers || {})
                }));
            }
        }

        // if we reached this point we have no replyWiths, return regular fetch
        return isoFetch(url, options);
    });
}

/**
 * Adds replyWith conditions to private replyWiths collection
 * @param {string} url - url to intercept
 * @param {string} method - http method to intercept
 * @param {integer} status - HTTP status code to return
 * @param {any} data - data to return
 * @param {object} headers - key/value HTTP headers to return
 * @returns {void}
 */
function addReplyWith(url, method, status, data, headers) {

    // check if condition already exists
    var alreadyExists = replyWiths.filter(function(item) {
        return item.url === url && item.method === method;
    }).length > 0;

    if (alreadyExists) throw new Error('replyWith already exists for ' + method + ' ' + url);

    replyWiths.push({
        url: url,
        method: method,
        response: {
            status: status,
            data: data,
            headers: headers
        }
    });
}

// replace global fetch object exposed via isomorphic-fetch with patched version
global.fetch = patchFetch;

// return reference as module to ease documentation readability
module.exports = patchFetch;
