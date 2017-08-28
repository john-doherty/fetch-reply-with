'use strict';

var fetch = require('../index.js');

describe('fetch-reply-with', function() {

    it('should expose global fetch object', function() {
        expect(fetch).toBeDefined();
    });

    it('should expose fetch.replyWith object', function() {
        expect(fetch('http://www.orcascan.com').replyWith).toBeDefined();
        expect(typeof fetch('http://www.orcascan.com').replyWith).toBe('function');
    });
});
