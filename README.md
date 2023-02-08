# fetch-reply-with

[![npm version](https://badge.fury.io/js/fetch-reply-with.svg)](https://www.npmjs.com/package/fetch-reply-with)
[![Tests](https://github.com/john-doherty/fetch-reply-with/actions/workflows/ci.yml/badge.svg)](https://github.com/john-doherty/fetch-reply-with/actions/workflows/ci.yml)


Simplifies unit tests by intercepting [fetch](https://developers.google.com/web/updates/2015/03/introduction-to-fetch#fetch) requests and returning [mocked](https://en.wikipedia.org/wiki/Mock_object) responses.

## Install

```bash
npm install --save-dev fetch-reply-with
```

## Usage

```js
require('fetch-reply-with'); // <- `fetch` is now globally available

// setup intercept GET http://orcascan.com to reply with...
fetch('http://orcascan.com', {

    // regular fetch option
    method: 'GET',

    // add reply for this fetch
    replyWith: {
        status: 200,
        body: 'Barcode Scanner app',
        headers: {
            'Content-Type': 'text/html'
        },
        delay: 500 // miliseconds to wait before responding (default = 0)
    }
});

// execute fetch request
fetch('http://www.orcascan.com').then(function(res){
    return res.text();
})
.then(function(text){
    // text now equals Barcode Scanning app
});
```

Couple of things to note:
* Requests that are not intercepted are executed as normal
* A `replyWith` can be modified by defining the `replyWith` again

## Unit Tests

The project includes unit tests, to run the tests:

1. Checkout `git clone https://github.com/john-doherty/fetch-reply-with`
2. Navigate into project folder `cd fetch-reply-with`
3. Install dependencies `npm install`
4. Run the tests `npm test`

## Contributing

1. Fork it!
2. Create your feature branch: `git checkout -b my-new-feature`
3. Commit your changes: `git commit -m 'Add some feature'`
4. Push to the branch: `git push origin my-new-feature`
5. Submit a pull request :)

## Star the repo

If you find this useful please star the repo, it helps us prioritize fixes :raised_hands:

## History

For change-log, check [releases](https://github.com/john-doherty/fetch-reply-with/releases).

## License

Licensed under [MIT License](LICENSE) &copy; [John Doherty](https://twitter.com/mrjohndoherty)
