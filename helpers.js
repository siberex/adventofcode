/**
 * Created by sib.li on 30.06.18.
 */

"use strict";


/**
 * Similar to Haskell group function.
 * Looks for something to group inside provided string.
 *
 * Group repeating letters:
 *
 *  group('Mississippi')
 *  [ 'M', 'i', 'ss', 'i', 'ss', 'i', 'pp', 'i' ]
 *
 * Group consecutive letters:
 *  group('abcinopzjkl', (a,b) => a.charCodeAt(0)+1 === b.charCodeAt(0))
 *  [ 'abc', 'i', 'nop', 'z', 'jkl' ]
 *
 * @param {string} input
 * @param {function} isGroup
 * @return {Array}
 */
function group(input, isGroup = null) {

    if (typeof isGroup !== 'function') {
        isGroup = function(prev, curr) {
            return prev === curr;
        }
    }

    let prev = input[0];
    let groups = [];
    let group = prev;

    for (let i = 1; i < input.length; i++) {
        let curr = input[i];

        if ( isGroup(prev, curr) ) {
            group += curr;
        } else {
            groups.push(group);
            group = curr;

        }

        prev = curr;
    }

    groups.push(group);

    return groups;
} // group


/**
 * Weighted graph implementation.
 * Directed and undirected.
 *
 * Usage:
 * let g = new Graph();
 * g.addEdge('a', 'b', 10)
 *  .addEdge('a', 'c', 5)
 *  .addEdge('a', 'd', 20);
 *
 * g.getLightest('a');
 *  {to: 'c', weight: 5}
 *
 */
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
        return this;
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
        return this;
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


    getEdgeBy(from, comparison = null) {
        if (typeof comparison !== 'function') {
            comparison = function(a, b) {
                return a.weight > b.weight;
            }
        }

        let edge = this.edges.get(from).reduce((acc, val) => {
            if (acc === null) {
                return val;
            }

            if ( comparison(acc, val) ) {
                return val;
            }

            return acc;
        }, null);

        if (edge === null) {
            edge = {to: null, weight: Infinity};
        }

        return edge;
    } // getEdgeBy


    getLightest(from) {
        return this.getEdgeBy(from);
    } // getLightest

    getHeaviest(from) {
        return this.getEdgeBy(from, (a,b) => (a.weight < b.weight));
    } // getHeaviest

    clone() {
        let graph = new this.constructor();
        graph.vertices = new Set(this.vertices);
        graph.edges = new Map(this.edges);
        return graph;
    } // clone

} // Graph


/**
 * Heap's algorithm implementation to get all permutations of array.
 *
 * https://en.wikipedia.org/wiki/Heap%27s_algorithm
 * https://stackoverflow.com/questions/9960908/permutations-in-javascript/37580979#37580979
 *
 * @param {array} permutation
 * @return {*[]}
 */
function permute(permutation) {
    let length = permutation.length,
        result = [permutation.slice()],
        c = new Array(length).fill(0),
        i = 1, k, p;

    while (i < length) {
        if (c[i] < i) {
            k = i % 2 && c[i];
            p = permutation[i];
            permutation[i] = permutation[k];
            permutation[k] = p;
            ++c[i];
            i = 1;
            result.push(permutation.slice());
        } else {
            c[i] = 0;
            ++i;
        }
    }
    return result;
} // permute


module.exports.group = group;
module.exports.Graph = Graph;
module.exports.permute = permute;
