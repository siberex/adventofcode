"use strict";

const fs    = require('fs')
    , path  = require('path')
    , group = require('../helpers').group
;

process.on('unhandledRejection', error => {
    console.error('unhandledRejection', error.message);
});

(async function () {

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
        return group(s).map(v => v.length + '' + v[0]).join('');
    }

    // Test
    let input = '1';
    for (let i = 0; i < 14; i++) {
        input = say(input);
    }

    console.log(input === '311311222113111231131112132112311321322112111312211312111322212311322113212221', 'Test');


    // Part 1
    input = '1113222113';
    for (let i = 0; i < 40; i++) {
        input = say(input);
    }
    console.log(input.length, 'Part 1');

    // Part 2
    input = '1113222113';
    for (let i = 0; i < 50; i++) {
        input = say(input);
    }
    console.log(input.length, 'Part 2');

})();