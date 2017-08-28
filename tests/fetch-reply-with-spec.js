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
});
