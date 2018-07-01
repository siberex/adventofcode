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
    let data = fs.readFileSync(inputFile, 'utf8');
    data = data.split("\n");


    let matchRe = /^(\w+): capacity (-?\d+), durability (-?\d+), flavor (-?\d+), texture (-?\d+), calories (-?\d+)$/;


    data = data.map(line => {
        if (!line.length) {
            return null;
        }

        // line = 'PeanutButter: capacity -1, durability 3, flavor 0, texture 0, calories 1'

        let res = matchRe.exec(line);
        if (!res) {
            console.error('NOT PARSED: ' + line);
            return null;
        }

        res = res.slice(1);

        let [name, capacity, durability, flavor, texture, calories] = res;
        capacity    = capacity|0;
        durability  = durability|0;
        flavor      = flavor|0;
        texture     = texture|0;
        calories    = calories|0;

        // [ 'PeanutButter', -1, 3, 0, 0, 1 ]
        // console.log([name, capacity, durability, flavor, texture, calories]);

        return [name, capacity, durability, flavor, texture, calories];
    })
    .filter(v => v !== null);









})();