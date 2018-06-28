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

    let testIndex = 1;
    //console.log(data[testIndex]);

    let matchRe = /^(.+) -> ([a-z]+)$/;
    let matchReCmd = {
        'and'       : /^([a-z]+|\d+) AND ([a-z]+|\d+)$/,
        'or'        : /^([a-z]+|\d+) OR ([a-z]+|\d+)$/,
        'not'       : /^NOT ([a-z]+)$/,
        'lshift'    : /^([a-z]+) LSHIFT (\d+)$/,
        'rshift'    : /^([a-z]+) RSHIFT (\d+)$/,
        'val'       : /^([a-z]+|\d+)$/,
    };




    let wires = {};

    // Parse commands
    data = data.map(line => {
        // line = 'hz RSHIFT 1 -> is'
        let res = matchRe.exec(line);
        // res = ['hz RSHIFT 1', 'is']
        if (!res) {
            console.error('NOT PARSED: ' + line);
            return null;
        }

        res = res.slice(1);
        let [commands, wire] = res;

        for (let cmd in matchReCmd) {
            let re = matchReCmd[cmd];

            let values = re.exec(commands);
            if (values) {
                values = values.slice(1);

                if (cmd === 'val') {
                    wires[wire] = values[0];
                    // console.log(wires[wire]);
                } else {
                    // wires['is'] = ['rshift', 'hz', 1]
                    wires[wire] = [cmd, ...values];
                }
                break;
            }
        }

        if (!wires[wire]) {
            console.error('NOT PARSED: ' + line);
        }

        //wires[wire] = commands;
        return wires[wire];
    });

    console.log( 'Wires count: ' + Object.keys(wires).length );


    function applyCmd(cmd, arg1, arg2) {
        if (typeof arg1 !== 'undefined' && isNaN(arg1)) {
            arg1 = applyWiring(arg1);
        } else {
            arg1 = parseInt(arg1);
        }
        if (typeof arg2 !== 'undefined' && isNaN(arg2)) {
            arg2 = applyWiring(arg2);
        } else {
            arg2 = parseInt(arg2);
        }

        switch (cmd) {
            case 'and':
                return arg1 & arg2;
            case 'or':
                return arg1 | arg2;
            case 'not':
                return ~arg1;
            case 'lshift':
                return arg1 << arg2;
            case 'rshift':
                return arg1 >> arg2;
        }
    }

    function applyWiring(wireName) {
        let wire = wires[wireName];

        if (typeof wire === 'string') {
            if (isNaN(wire)) {
                wires[wireName] = applyWiring(wire);
            } else {
                wires[wireName] = parseInt(wire);
            }
        }

        if ( Array.isArray(wire) ) {
            let [cmd, ...params] = wire;
            wires[wireName] = applyCmd(cmd, ...params);
        }

        return wires[wireName];
    } // applyWiring

    let result = applyWiring('a');

    console.log(result);

})();