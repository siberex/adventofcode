"use strict";

const fs    = require('fs')
    , path  = require('path')
;

process.on('unhandledRejection', error => {
    console.error('unhandledRejection', error.message);
});


class Graph {
    constructor() {
        this.vertices = new Set();
        this.edges = new Map();
    }

    addVertex(name) {
        if ( !this.vertices.has(name) ) {
            this.vertices.add(name);
        }
        return this.vertices.size;
    }

    deleteVertex(name) {
        if ( this.vertices.has(name) ) {
            this.vertices.delete(name);

        }
        return this.vertices.size;
    }

    addEdge(from, to, weight) {
        this.addDirectedEdge(from, to, weight);
        this.addDirectedEdge(to, from, weight);
    }

    deleteEdge(from, to) {
        this.deleteDirectedEdge(from, to);
        this.deleteDirectedEdge(to, from);
    }

    addDirectedEdge(from, to, weight = Infinity) {
        if ( !this.vertices.has(from) ) {
            this.addVertex(from);
        }
        if ( !this.vertices.has(to) ) {
            this.addVertex(to);
        }

        if ( !this.edges.has(from) ) {
            this.edges.set(from, []);
        }
        this.edges.get(from).push({
            to      : to,
            weight  : weight
        });
    }

    deleteDirectedEdge(from, to) {
        this.edges.set(
            from,
            this.edges.get(from)
                .filter(edge => edge.to !== to)
        );
    }

} // Graph



(async function () {
    // If current file is 123.js, will read file 123.txt as input
    const inputFile = __dirname + '/' + path.basename(__filename, '.js') + '.txt';
    const outputFile = __dirname + '/' + path.basename(__filename, '.js') + '-out.txt';
    let data = fs.readFileSync(inputFile, 'utf8');
    data = data.split("\n");


    let cities = {};

    let matchRe = /^(.+) to (.+) = (\d+)$/;

    data = data.map(line => {
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

        // if (cities[a]) {
        //     cities[a][b] = dist;
        // } else {
        //     cities[a] = {[b] : dist};
        // }
        //
        // if (cities[b]) {
        //     cities[b][a] = dist;
        // } else {
        //     cities[b] = {[a] : dist};
        // }

        if (!cities[a]) {
            cities[a] = [];
        }
        cities[a].push({name: b, dist: dist});

        if (!cities[b]) {
            cities[b] = [];
        }
        cities[b].push({name: a, dist: dist});

        return res;
    });


    //console.log(data[2]);

    // console.log( new Map( Object.entries( { ...cities } ) ) );

    //Object.keys(cities).map(start => {

        // Clone cities graph
        // let graph = { ...cities };
        let citiesToVisit = new Map( Object.entries(cities) );

        //while (citiesToVisit.size) {
            //citiesToVisit.delete()
        //}

        let start = 'AlphaCentauri';

        //console.log( citiesToVisit.get(start) );

        // [{name: 'a', dist: 5}, {name: 'b', dist: 1}] => {name: 'b', dist: 1}

        let nextClosest = citiesToVisit.get(start).reduce((acc, val) => {
            if (acc === null) {
                return val;
            }

            if (acc.dist > val.dist) {
                return val;
            }

            return acc;
        }, null);

        console.log(nextClosest, 'closest');

    //});



})();