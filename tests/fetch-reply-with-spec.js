'use strict';

var fetch = require('../index.js');

describe('fetch-reply-with', function() {

    it('should expose global fetch object', function() {
        expect(fetch).toBeDefined();
    });

    it('should intercept requests', function(done) {

        var url = 'http://www.orcascan.com';
        var status = 200;
        var body = 'Bulk Barcode Scanning app';

        // setup request intercept
        fetch(url, {
            replyWith: {
                status: 200,
                data: body
            }
        });

        // execute actual request
        fetch(url).then(function(res) {
            expect(res.status).toEqual(status);
            return res.text();
        })
        .then(function(text) {
            expect(text).toEqual(body);
            done();
        });
    });

    it('should return correct status, body, headers', function(done) {

        var url = 'http://www.mammothworkwear.com';
        var status = 200;
        var body = 'Helly Hansen Workwear';

        // setup request intercept
        fetch(url, {
            replyWith: {
                status: 200,
                data: body,
                headers: {
                    'Content-Type': 'application/json'
                }
            }
        });

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
        });
    });

});
