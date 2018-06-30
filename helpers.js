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


module.exports.group = group;
module.exports.Graph = Graph;
