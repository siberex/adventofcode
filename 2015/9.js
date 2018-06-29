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

            if ( this.edges.has(name) ) {
                this.edges.delete(name);
            }

            this.deleteDirectedEdge(null, name);
        }
        return this.vertices.size;
    }

    addEdge(from, to, weight) {
        this.addDirectedEdge(from, to, weight);
        this.addDirectedEdge(to, from, weight);
    } // addEdge

    deleteEdge(from, to) {
        this.deleteDirectedEdge(from, to);
        this.deleteDirectedEdge(to, from);
    } // deleteEdge

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
    } // addDirectedEdge

    deleteDirectedEdge(from = null, to) {
        let fromVertices = this.vertices;

        if (from !== null) {
            fromVertices = [from];
        }

        for (let fromVertex of fromVertices) {
            if ( this.edges.has(fromVertex) ) {
                this.edges.set(
                    fromVertex,
                    this.edges.get(fromVertex)
                        .filter(edge => edge.to !== to)
                );
            }
        }
    } // deleteDirectedEdge

    getNearest(from) {
        let nearest = this.edges.get(from).reduce((acc, val) => {
            if (acc === null) {
                return val;
            }

            if (acc.weight > val.weight) {
                return val;
            }

            return acc;
        }, null);

        if (nearest === null) {
            nearest = {to: null, weight: Infinity};
        }

        return nearest;
    } // getNearest

    getFurthest(from) {
        let furthest = this.edges.get(from).reduce((acc, val) => {
            if (acc === null) {
                return val;
            }

            if (acc.weight < val.weight) {
                return val;
            }

            return acc;
        }, null);

        if (furthest === null) {
            furthest = {to: null, weight: Infinity};
        }

        return furthest;
    } // getFurthest

    clone() {
        let graph = new this.constructor();
        graph.vertices = new Set(this.vertices);
        graph.edges = new Map(this.edges);
        return graph;
    } // clone

} // Graph



(async function () {
    // If current file is 123.js, will read file 123.txt as input
    const inputFile = __dirname + '/' + path.basename(__filename, '.js') + '.txt';
    const outputFile = __dirname + '/' + path.basename(__filename, '.js') + '-out.txt';
    let data = fs.readFileSync(inputFile, 'utf8');
    data = data.split("\n");


    let cities = new Graph();

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

        cities.addEdge(a, b, dist);

        return res;
    });

    //console.log(data[2]);

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