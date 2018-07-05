"use strict";

const fs    = require('fs')
    , path  = require('path')
;

process.on('unhandledRejection', error => {
    console.error('unhandledRejection', error.message);
});

(async function () {
    // If current file is 123.js, will read file 123.txt as input
    const inputFile = __dirname + '/' + path.basename(__filename, '.js') + '.txt';
    const outputFile = __dirname + '/' + path.basename(__filename, '.js') + '-out.txt';
    let data = fs.readFileSync(inputFile, 'utf8');
    data = data.split("\n");


    let replacements    = new Set();
    let srcString       = '';

    let matchRe         = /^(\w+) => (\w+)$/;

    data = data.map(line => {
        if (!line.length) {
            return null;
        }

        let res = matchRe.exec(line);
        if (!res) {
            srcString = line;
            return null;
        }

        res = res.slice(1);

        //console.log(res);
        return res;
    }).filter(v => Array.isArray(v));


    data.map(searchReplace => {
        let [search, replace] = searchReplace;

        let searchIndex = srcString.indexOf(search);

        while ( searchIndex !== -1 ) {

            let replacement = srcString.substring(0, searchIndex)
                + replace
                + srcString.substring(searchIndex + search.length);

            replacements.add(replacement);

            searchIndex = srcString.indexOf(search, searchIndex + 1);
        }
    });

    console.log(replacements.size, 'PART 1');



})();