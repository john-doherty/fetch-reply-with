var fetch = require('../index.js');
var cuid = require('cuid');

describe('fetch-reply-with', function() {

    it('should expose global fetch object', function() {
        expect(fetch).toBeDefined();
    });

    it('should intercept requests', function(done) {

        var url = 'http://orcascan.com';
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

        var url = `http://www.${cuid.slug()}.com`;
        var status = randomIntBetween(200, 299);
        var body = cuid.slug();

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

    it('should allow intercept to be updated', function(done) {

        var url = `http://www.${cuid.slug()}.com`;
        var status = randomIntBetween(200, 299);
        var body1 = cuid.slug();
        var body2 = cuid.slug();

        fetch(url, {
            replyWith: {
                status: status,
                body: body1,
                headers: {
                    'Content-Type': 'application/json'
                }
            }
        });

        fetch(url, {
            replyWith: {
                status: status,
                body: body2,
                headers: {
                    'Content-Type': 'application/json'
                }
            }
        });

        fetch(url).then(function(res) {
            expect(res.status).toEqual(status);
            expect(res.headers.has('content-type')).toBe(true);
            expect(res.headers.get('content-type')).toBe('application/json');
            return res.text();
        })
        .then(function(text) {
            expect(text).toEqual(body2);
            done();
        })
        .catch(done);
    });

    it('should not reply until ~500ms have passed', function(done) {

        var url = `http://www.${cuid.slug()}.com`;
        var status = randomIntBetween(200, 299);
        var body = cuid.slug();

        fetch(url, {
            replyWith: {
                status: status,
                body: body,
                headers: {
                    'Content-Type': 'application/json'
                },
                delay: 500
            }
        });

        var startTime = new Date();

        fetch(url).then(function() {

            var endTime = new Date();

            // calculate time passed in ms
            var timePassed = endTime - startTime;

            // JS is never bang on with timeouts, allow ~50ms
            expect(timePassed).toBeGreaterThan(450);

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
