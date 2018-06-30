"use strict";

const fs    = require('fs')
    , path  = require('path')
    , group = require('../helpers').group
;

process.on('unhandledRejection', error => {
    console.error('unhandledRejection', error.message);
});

(async function () {

    let input = '1113222113';

    // https://en.wikipedia.org/wiki/Look-and-say_sequence
    // https://oeis.org/A005150

    // To generate a member of the sequence from the previous member,
    // read off the digits of the previous member,
    // counting the number of digits in groups of the same digit.

    // 1    → 11 (one 1)
    // 11   → 21 (two 1s)
    // 21   → 1211 (one 2, one 1)
    // 1211 → 111221 (one 1, one 2, two 1s)
    // 111221 → 312211 (three 1s, two 2s, one 1)


    function say(s) {

        group(s)

    }






})();