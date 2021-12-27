# fetch-reply-with

[![npm version](https://badge.fury.io/js/fetch-reply-with.svg)](https://www.npmjs.com/package/fetch-reply-with)
[![Shippable branch](https://img.shields.io/shippable/59a3e414c80c0407002b779f/master.svg)](https://app.shippable.com/projects/59a3e414c80c0407002b779f)

Simplifies unit tests by intercepting [window.fetch](https://developers.google.com/web/updates/2015/03/introduction-to-fetch#fetch) requests and returning [mocked](https://en.wikipedia.org/wiki/Mock_object) responses.

## Install

```bash
npm install --save-dev fetch-reply-with
```

## Usage

```js
require('fetch-reply-with'); // <- fetch is now globally available within the node environment

//
// setup URL intercepts and mock responses
//

// intercept GET http://www.orcascan.com
fetch('http://www.orcascan.com', {

    // regular fetch option
    method: 'GET',

    // add reply for this fetch
    replyWith: {
        status: 200,
        body: 'Bulk Barcode Scanning app',
        headers: {
            'Content-Type': 'text/html'
        }
    }
});

// typical fetch request
fetch('http://www.orcascan.com').then(function(res){
    // gets mocked response
    return res.text();
})
.then(function(text){
    // text now equals Bulk Barcode Scanning app
});
```

_Requests that are not intercepted are executed as normal._

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
