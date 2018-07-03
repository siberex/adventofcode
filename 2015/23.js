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


    let matchRe = /^([a-z]{3}) ([a-z])?(?:, )?([+\-]\d+)?$/;


    let instructions = data.map(line => {
        if (!line.length) {
            return null;
        }

        // jio a, +8
        // jmp -7
        // inc a
        let res = matchRe.exec(line);
        if (!res) {
            console.error('NOT PARSED: ' + line);
            return null;
        }

        res = res.slice(1);

        console.log(res);

    }).filter(v => v);


    let cmd = 'abc';
    switch (cmd) {
        case 'hlf':
            // half register’s current value
            break;
        case 'tpl':
            // triple register’s current value
            break;
        case 'inc':
            // increment register by 1
            break;
        case 'jmp':
            // continue with the instruction offset away relative to itself
            break;
        case 'jie':
            // like jmp, but only jumps if register is even ("jump if even")
            break;
        case 'jio':
            // like jmp, but only jumps if register is 1
            // ("jump if one", not odd)
            break;
        default:
            // unknown command, exit

    }


})();