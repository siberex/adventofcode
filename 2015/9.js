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


    function getPathWeightsForEachVertex(graph, comparisonFn = null) {
        let distances = new Map();

        for (let startingVertex of graph.vertices) {
            let graphCopy = graph.clone();

            let next = startingVertex;
            let sum = 0;

            while (graphCopy.vertices.size) {
                let {to, weight} = graphCopy.getEdgeBy(next, comparisonFn);

                if (to === null) {
                    break;
                }

                graphCopy.deleteVertex(next);
                next = to;
                sum += weight;
            }

            distances.set(startingVertex, sum);
        }

        return distances;
    }


    // Part 1
    let shortest = getPathWeightsForEachVertex(cities, (a,b) => (a.weight > b.weight));
    console.log( Math.min(...shortest.values() ), 'Part 1');

    // Part 2
    let longest = getPathWeightsForEachVertex(cities, (a,b) => (a.weight < b.weight));
    console.log(Math.max( ...longest.values() ), 'Part 2');

})();