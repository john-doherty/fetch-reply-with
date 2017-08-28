'use strict';

var isoFetch = require('isomorphic-fetch');

// holds all intercepts in memory
var intercepts = [];

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

        if (!options.replyWith.data || options.replyWith.data === '') throw new Error('Please provide data to return in the body of the response');

        // add fetch intercept and exit
        addFetchIntercept(url, options.method, options.replyWith.status || 200, options.replyWith.data, options.replyWith.headers);

        return Promise.resolve();
    }

    // otherwise, attempt to intercept the request or allow it continue as normal
    return new Promise(function (resolve) {

        for (var i = 0, l = intercepts.length; i < l; i++) {

            var condition = intercepts[i];

            if (condition.url === url && condition.method === options.method) {

                return resolve(new Response(condition.response.data, {
                    status: condition.response.status,
                    headers: condition.response.headers
                }));
            }
        }

        // if we reached this point we have no intercepts, return regular fetch
        return isoFetch(url, options);
    });
}

/**
 * method to add replyWith intercepts
 * @param {string} url - url to intercept
 * @param {string} method - http method to intercept
 * @param {integer} status - HTTP status code to return
 * @param {any} data - data to return
 * @param {object} headers - key/value HTTP headers to return
 * @returns {void}
 */
function addFetchIntercept(url, method, status, data, headers) {

    // check if condition already exists
    var alreadyExists = intercepts.filter(function(item) {
        return item.url === url && item.method === method;
    }).length > 0;

    // no need to add it again
    if (!alreadyExists) {

        intercepts.push({
            url: url,
            method: method,
            response: {
                status: status,
                data: data,
                headers: headers
            }
        });
    }
}

// replace global fetch object exposed via isomorphic-fetch with patched version
global.fetch = patchFetch;

// return reference as module to ease documentation readability
module.exports = patchFetch;
