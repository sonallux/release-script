const {ReleaseScript} = require('./lib/release-script.js');

new ReleaseScript({tag: 'Test'}).release('1.2.0');
