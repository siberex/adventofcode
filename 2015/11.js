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
    function haveThreeConsecutive(input) {
        if (input.length < 3) {
            return false;
        }

        // 'abc' → [97, 98, 99]
        let chars = input.split('').map( ch => ch.charCodeAt(0) );

        let consecutive = 1;
        // Char code of the first character
        let prev = chars[0];

        for (let i = 1; i < chars.length; i++) {
            let code = chars[i];

            if (prev + 1 === code) {
                consecutive++;
                if (consecutive === 3) {
                    return true;
                }
            } else {
                consecutive = 1;
            }
            prev = code;
        }

        return false;
    } // haveThreeConsecutive

    let confusingRegex = /[iol]/;
    // 2. Check confusing letters constraint: no i, o, or l.
    function haveNoConfusing(input) {
        return !confusingRegex.test(input);
    }

    let twoDoublesRegex = /^.*([a-z]{1})\1.*([a-z]{1})(?!\1{1})\2.*$/;
    // 3. Check for two *different*, non-overlapping pairs of letters,
    //    like aa, bb, or zz. Examples:
    //      'abbceffg' is ok.
    //      'abbcegjk' is not ok.
    function haveTwoDifferentPairs(input) {
        return twoDoublesRegex.test(input);
    }



    function getNewPassword(input) {
        while (
            !haveThreeConsecutive(input) ||
            !haveNoConfusing(input) ||
            !haveTwoDifferentPairs(input)
        ) {
            input = incrementLetter(input);
        }
        return input;
    }

    // Part 1
    console.log( input = getNewPassword(input), 'Part 1' );

    // Part 2
    input = incrementLetter(input);
    console.log( getNewPassword(input), 'Part 2' );

})();