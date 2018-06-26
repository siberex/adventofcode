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

    let testIndex = 1;
    console.log(data[testIndex]);

    let matchRe = /^(.+) -> (.+)$/;
    let matchReCmd = /^(\w+)? ?(AND|OR|NOT|LSHIFT|RSHIFT)? ?(\w+)$/;

    // Parse commands
    data = data.map(line => {
        // line = 'hz RSHIFT 1 -> is'
        let res = matchRe.exec(line);
        if (res) res = res.slice(1);
        return res;
    });

    //console.log(data[testIndex]);
    //console.log(matchReCmd.exec(data[testIndex][0]).slice(1));

    let parsed = data.map(cmd => {
        let res = matchReCmd.exec(cmd[0]);
        if (res) res = res.slice(1);
        return res;
    });

    console.log(parsed[testIndex]);


})();