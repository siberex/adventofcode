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
    const outputFile = __dirname + '/' + path.basename(__filename, '.js') + '.rle';
    let data = fs.readFileSync(inputFile, 'utf8');
    data = data.split("\n");


    // This is basically Conway’s Game of Life
    // Let’s convert input to Extended RLE format:
    // http://golly.sourceforge.net/Help/formats.html
    // And launch it with Golly:
    // http://golly.sourceforge.net/

    let header = "x = 100, y = 100, rule = B3/S23:P100,100\n";

    data = data.map(line => {
        if (!line.length) {
            return null;
        }

        // On
        line = line.replace(/#/g, 'o');
        // Off
        line = line.replace(/\./g, 'b');


        return line;
    }).filter(v => v);

    let rle = header;

    // End of the row marker
    rle += data.join("$\n");
    // End of the pattern marker
    rle += '!';

    fs.writeFileSync(outputFile, rle);

    console.log('RLE file saved: ' + path.basename(__filename, '.js') + '.rle');

    console.log('Now open ' +path.basename(__filename, '.js') + '.lua'+ ' script with Golly (File → Run Script…)');

})();