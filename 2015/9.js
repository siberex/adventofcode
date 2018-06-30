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


    let cities = new Graph();

    let matchRe = /^(.+) to (.+) = (\d+)$/;

    data.map(line => {
        // line = 'AlphaCentauri to Straylight = 34'

        let res = matchRe.exec(line);
        if (!res) {
            console.error('NOT PARSED: ' + line);
            return null;
        }

        // res = ['AlphaCentauri', 'Straylight', '34']
        res = res.slice(1);

        let [a, b, dist] = res;
        dist = dist|0;

        cities.addEdge(a, b, dist);

        return res;
    });


    // Part 1
    let distances = [];
    for (let startingCity of cities.vertices) {
        let citiesCopy = cities.clone();

        let next = startingCity;
        let sum = 0;

        while (citiesCopy.vertices.size) {
            let {to, weight} = citiesCopy.getNearest(next);

            if (to === null) {
                break;
            }

            citiesCopy.deleteVertex(next);
            next = to;
            sum += weight;
            //console.log(to, weight);
        }

        distances.push(sum);
        //console.log(sum, startingCity);
    }
    console.log(Math.min(...distances), 'Part 1');

    // Part 2
    distances = [];
    for (let startingCity of cities.vertices) {
        let citiesCopy = cities.clone();

        let next = startingCity;
        let sum = 0;

        while (citiesCopy.vertices.size) {
            let {to, weight} = citiesCopy.getFurthest(next);

            if (to === null) {
                break;
            }

            citiesCopy.deleteVertex(next);
            next = to;
            sum += weight;
            //console.log(to, weight);
        }

        distances.push(sum);
    }

    console.log(Math.max(...distances), 'Part 2');


})();