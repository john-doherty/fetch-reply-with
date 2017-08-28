'use strict';

var isoFetch = require('isomorphic-fetch');

// holds all intercepts in memory
var intercepts = [];

/**
 * intercept global fetch object exposed via isomorphic-fetch and check for canned responses
 * @param {string} url - url to fetch
 * @param {object} options - fetch options
 * @returns {Promise} executes .then if fetch successful, otherwise .catch
 */
global.fetch = function (url, options) {

    options = options || {};
    options.method = options.method || 'GET';

    return new Promise(function (resolve, reject) {

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
 * @returns {object} exposing .replyWith method to add intercepts
 */
module.exports = function(url, method) {

    if (!url || url === '') throw new Error('Please provide a url to intercept');

    // default to GET
    method = method || 'GET';

    // check if condition already exists
    var alreadyExists = intercepts.filter(function(item) {
        return item.url === url && item.method === method;
    }).length > 0;

    // no need to add it again
    if (alreadyExists) return;

    // return object with .replyWith to allow intercepts to be added with ease
    return {

        /**
         * adds response information to an intercept
         * @param {integer} status - HTTP status code to return
         * @param {any} data - data to return
         * @param {object} headers - key/value HTTP headers to return
         */
        replyWith: function (status, data, headers) {

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
    };
};