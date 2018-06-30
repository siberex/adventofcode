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


module.exports.group = group;
