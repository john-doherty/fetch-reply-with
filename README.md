# fetch-reply-with

[![Linked In](https://img.shields.io/badge/Linked-In-blue.svg)](https://www.linkedin.com/in/john-i-doherty) [![Twitter Follow](https://img.shields.io/twitter/follow/CambridgeMVP.svg?style=social&label=Twitter&style=plastic)](https://twitter.com/CambridgeMVP)

Adds `window.fetch` to node with the ability to intercept requests and reply with canned responses - simplifying unit testing.

## Installation

```bash
npm install --save-dev fetch-reply-with
```

## Usage

```js
var fetch = require('fetch-reply-with');

// add a fetch intercept
fetch('http://www.orcascan.com', 'GET').replyWith(200, 'Bulk Barcode Scanning app with easy export to Excel');

// all future calls to fetch('http://www.orcascan.com', 'GET') will now respond with the above
```

## Tests

The project includes unit tests, to run the tests execute the following from the command line:

```bash
git clone https://github.com/john-doherty/fetch-reply-with
cd fetch-reply-with
npm install
npm test
```

## License

Licensed under [MIT License](LICENSE) &copy; [John Doherty](http://www.johndoherty.info)