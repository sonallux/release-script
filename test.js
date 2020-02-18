const {ReleaseScript} = require('./dist/release-script.js');

new ReleaseScript({tag: 'Test'}).release('1.2.0');
