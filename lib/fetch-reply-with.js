var isoFetch = require('isomorphic-fetch');

// hold all replies in memory
var replies = [];

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

        var existingIndex = -1; // append by default

        // check if condition already exists, if so, grab the index
        replies.forEach(function(item, index) {
            if (item.url === url && item.method === options.method) {
                existingIndex = index;
            }
        });

        // create a reply object to store (includes url/method to match on)
        var reply = {
            url: url,
            method: options.method,
            response: {
                status: options.replyWith.status || 200,
                body: options.replyWith.body + '',
                headers: options.replyWith.headers || {},
            },
            delay: options.replyWith.delay || 0
        };

        // if it already exists, replace
        if (replies[existingIndex]) {
            replies[existingIndex] = reply;
        }
        // otherwise, append
        else {
            replies.push(reply);
        }

        // return Response to first .then if present
        return Promise.resolve(new Response(reply.response.body, {
            status: reply.response.status,
            headers: new Headers(reply.response.headers || {})
        }));
    }

    // otherwise, attempt to intercept the request or allow it continue as normal
    return new Promise(function (resolve) {

        for (var i = 0, l = replies.length; i < l; i++) {

            var condition = replies[i];

            // if URL and method match
            if (condition.url === url && condition.method === options.method) {

                // reply with mocked result (delay in ms if set, 0 = immediate)
                return delay(condition.delay).then(function() {
                    resolve(new Response(condition.response.body, {
                        status: condition.response.status,
                        headers: new Headers(condition.response.headers || {})
                    }));
                });
            }
        }

        // if we reached this point we have no replies, return regular fetch
        return isoFetch(url, options);
    });
}

/**
 * returns a promise that is fulfilled after interval has passed
 * @param {integer} timeoutInMs - timeout in milliseconds
 * @return {Promise} resolved when timeout is reached
 */
function delay(timeoutInMs) {
    return new Promise(function (resolve) {
        setTimeout(function () {
            resolve();
        }, timeoutInMs);
    });
}

// replace global fetch object exposed via isomorphic-fetch with patched version
global.fetch = patchFetch;

// return reference as module to ease documentation readability
module.exports = patchFetch;
