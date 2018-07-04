"use strict";

const fs    = require('fs')
    , path  = require('path')
;

process.on('unhandledRejection', error => {
    console.error('unhandledRejection', error.message);
});

(async function () {
    // If current file is 123.js, will read file 123.txt as input
    const inputFile = __dirname + '/' + path.basename(__filename, '.js') + '.txt';
    const outputFile = __dirname + '/' + path.basename(__filename, '.js') + '-out.txt';
    let data = fs.readFileSync(inputFile, 'utf8');
    data = data.split("\n");


    let matchRe = /^([a-z]{3}) ([a-z])?(?:, )?([+\-]\d+)?$/;

    let registers = new Map();

    const PART2 = true;

    let instructions = data.map(line => {
        if (!line.length) {
            return null;
        }

        // jio a, +8
        // jmp -7
        // inc a
        let res = matchRe.exec(line);
        if (!res) {
            console.error('NOT PARSED: ' + line);
            return null;
        }

        res = res.slice(1);
        let [cmd, register, value] = res;
        if (value !== undefined) {
            value = parseInt(value);
        }

        if ( register !== undefined && !registers.has(register) ) {
            registers.set(register, (PART2 && register === 'a') ? 1 : 0);
        }

        res = [cmd, register, value];

        //console.log(res);
        return res;
    }).filter(v => v);


    let i = 0;

    instructionsLoop:
    while (i < instructions.length) {
        let [cmd, register, value] = instructions[i];

        //console.log([cmd, register, value]);

        let r = 0;
        if (register && registers.has(register)) {
            r = registers.get(register);
        }

        switch (cmd) {
            case 'hlf':
                // half register’s current value
                registers.set(register, r / 2);
                i++;
                break;
            case 'tpl':
                // triple register’s current value
                registers.set(register, r * 3);
                i++;
                break;
            case 'inc':
                // increment register by 1
                registers.set(register, r + 1);
                i++;
                break;
            case 'jmp':
                // continue with the instruction offset away relative to itself
                i += value;
                break;
            case 'jie':
                // like jmp, but only jumps if register is even ("jump if even")
                if (r % 2 === 0) {
                    i += value;
                } else {
                    i++;
                }
                break;
            case 'jio':
                // like jmp, but only jumps if register is 1
                // ("jump if one", not odd)
                if (r === 1) {
                    i += value;
                } else {
                    i++;
                }
                break;
            default:
                // unknown command, exit
                break instructionsLoop;
        }
    }

    console.log(registers, PART2 ? 'PART 2' : 'PART 1');

})();