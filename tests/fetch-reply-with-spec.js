'use strict';

var fetch = require('../index.js');

describe('fetch-reply-with', function() {

    it('should expose global fetch object', function() {
        expect(fetch).toBeDefined();
    });

    it('should intercept requests', function(done) {

        var url = 'http://www.orcascan.com';
        var status = randomIntBetween(200, 299);
        var body = 'Bulk Barcode Scanning app';

        // setup request intercept
        fetch(url, {
            replyWith: {
                status: status,
                body: body
            }
        })
        .catch(done);

        // execute actual request
        fetch(url).then(function(res) {
            expect(res.status).toEqual(status);
            return res.text();
        })
        .then(function(text) {
            expect(text).toEqual(body);
            done();
        })
        .catch(done);
    });

    it('should return correct status, body, headers', function(done) {

        var url = 'http://www.mammothworkwear.com';
        var status = randomIntBetween(200, 299);
        var body = 'Helly Hansen Workwear';

        // setup request intercept
        fetch(url, {
            replyWith: {
                status: status,
                body: body,
                headers: {
                    'Content-Type': 'application/json'
                }
            }
        })
        .catch(done);

        // execute actual request
        fetch(url).then(function(res) {
            expect(res.status).toEqual(status);
            expect(res.headers.has('content-type')).toBe(true);
            expect(res.headers.get('content-type')).toBe('application/json');

            return res.text();
        })
        .then(function(text) {
            expect(text).toEqual(body);
            done();
        })
        .catch(done);
    });

    it('should also return response to first then', function(done) {

        var now = (new Date()).getTime();
        var url = 'http://www.' + now + '.com';
        var status = randomIntBetween(200, 299);
        var body = String(now);

        // setup request intercept
        fetch(url, {
            replyWith: {
                status: status,
                body: body,
                headers: {
                    'Content-Type': 'application/json'
                }
            }
        })
        .then(function(res) {
            expect(res.status).toEqual(status);
            expect(res.headers.has('content-type')).toBe(true);
            expect(res.headers.get('content-type')).toBe('application/json');

            return res.text();
        })
        .then(function(text) {
            expect(text).toEqual(body);
            done();
        })
        .catch(done);
    });
});

/* --- HELPERS --- */

/**
 * Returns a random number within a range
 * @param {integer} min - minimum number to return
 * @param {integer} max - maximum number to return
 * @returns {integer} number between min & max
 */
function randomIntBetween(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
}
