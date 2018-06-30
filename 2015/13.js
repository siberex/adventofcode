"use strict";

const fs    = require('fs')
    , path  = require('path')
    , Graph = require('../helpers').Graph
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


    let persons = new Graph();

    let matchRe = /^(\w+) would (lose|gain) (\d+) happiness units by sitting next to (\w+)\.$/;

    data.map(line => {
        // line = 'Carol would lose 62 happiness units by sitting next to Alice.'

        let res = matchRe.exec(line);
        if (!res) {
            console.error('NOT PARSED: ' + line);
            return null;
        }

        // res = [ 'Carol', 'lose', '62', 'Alice' ]
        res = res.slice(1);

        let [a, sign, units, b] = res;
        units = parseInt(sign === 'lose' ? '-' + units : units);

        // ['Carol', 'Alice', -62]
        persons.addEdge(a, b, units);
        return [a, b, units];
    });



})();