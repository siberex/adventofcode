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
                    this.edges.get(from)
                        .filter(edge => edge.to !== to)
                );
            }
        }
    } // deleteDirectedEdge

    getNearest(from) {

        return this.edges.get(from).reduce((acc, val) => {
            if (acc === null) {
                return val;
            }

            if (acc.weight > val.weight) {
                return val;
            }

            return acc;
        }, null);

    } // getNearest

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


    let start = 'AlphaCentauri';
    console.log(cities.getNearest(start), 'closest');


})();