"use strict";

const fs    = require('fs')
    , path  = require('path')
;

process.on('unhandledRejection', error => {
    console.error('unhandledRejection', error.message);
});

(async function () {

    let input = 'vzbxkghb';


    const charCodeA = 'a'.charCodeAt(0); // 97
    const base = 'z'.charCodeAt(0) - charCodeA + 1;

    function incrementLetter(input) {

        // 'abc' → ['a', 'b', 'c'] → [97, 98, 99] → [0, 1, 2] → '012'
        let numberBaseN = input.split('')
            .map( ch => (ch.charCodeAt(0) - charCodeA).toString(base) )
            .join('');

        // Important to save original zero-padding
        let targetLength = numberBaseN.length;

        // '012' → 28 (from base26)
        let result = parseInt(numberBaseN, base);

        // 28+1 → 29
        result++;

        // 29 → '13' (to base26) → '013' (padding) → [0, 1, 3] →
        // → [97, 98, 100] → ['a', 'b', 'd'] → 'abd'
        result = result.toString(base).padStart(targetLength, '0').split('')
            .map(digit => String.fromCharCode( parseInt(digit, base) + charCodeA ))
            .join('');

        return result;
    }

    // 1. Three consecutive letters constraint check.
    //    'hijklmmn' is ok (ijk).
    function checkConsecutive(input) {

    }

    let confusingRegex = /[iol]/;
    // 2. Check confusing letters constraint: no i, o, or l.
    function checkNoConfusing(input) {
        return !confusingRegex.test(input);
    }

    let twoDoublesRegex = /^.*([a-z]{1})\1.*([a-z]{1})(?!\1{1})\2.*$/;
    // 3. Check for two *different*, non-overlapping pairs of letters,
    //    like aa, bb, or zz. Examples:
    //      'abbceffg' is ok.
    //      'abbcegjk' is not ok.
    function checkPairs(input) {
        return twoDoublesRegex.test(input);
    }


    console.log(
        incrementLetter(input)
    );





})();