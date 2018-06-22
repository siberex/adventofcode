"use strict";

const fs    = require('fs')
    , path  = require('path')
;

(async function () {
    // If current file is 123.js, will read file 123.txt as input
    const inputFile = __dirname + '/' + path.basename(__filename, '.js') + '.txt';
    let data = await fs.readFileSync(inputFile, 'utf8');

    console.log(data);
    // ...

})();

process.on('unhandledRejection', error => {
    console.error('unhandledRejection', error.message);
});