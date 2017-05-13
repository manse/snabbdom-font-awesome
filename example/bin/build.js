const browserify = require('browserify');
const tsify = require('tsify');
const fs = require('fs');

browserify({
    entries: ['./src/index.ts'],
    cache: {},
    packageCache: {},
    debug: true
})
.plugin(tsify).bundle().on('error', (err) => {
    console.log(err.message);
}).pipe(fs.createWriteStream('./public/index.js'));
