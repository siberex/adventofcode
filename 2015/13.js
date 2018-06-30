"use strict";

const fs    = require('fs')
    , path  = require('path')
    , Graph = require('../helpers').Graph
    , permute = require('../helpers').permute
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


    let persons = new Graph();
    let personsWithMe = new Graph();

    let matchRe = /^(\w+) would (lose|gain) (\d+) happiness units by sitting next to (\w+)\.$/;

    data.map(line => {
        // line = 'Carol would lose 62 happiness units by sitting next to Alice.'

        if (!line.length) {
            return;
        }

        let res = matchRe.exec(line);
        if (!res) {
            console.error('NOT PARSED: ' + line);
            return null;
        }

        // res = [ 'Carol', 'lose', '62', 'Alice' ]
        res = res.slice(1);

        let [a, sign, units, b] = res;
        units = parseInt(sign === 'lose' ? '-' + units : units);

        //console.log([a, b, units]);

        // ['Carol', 'Alice', -62]
        persons.addDirectedEdge(a, b, units);

        personsWithMe.addDirectedEdge(a, b, units);
        personsWithMe.addDirectedEdge(a, 'ME', 0);
        personsWithMe.addDirectedEdge(b, 'ME', 0);

        return [a, b, units];
    });


    //console.log(persons.getEdgeWeight('Alice', 'David'));


    function getMaximumHappiness(persons) {

        let names = [...persons.vertices.values()];
        let seats = names.length;
        let variations = permute(names);

        //console.log(`Permutations count for ${names.length} elements is n! = ${variations.length}`);

        return variations.map(configuration => {

            let happiness = 0;

            for (let i = 0; i < configuration.length; i++) {

                let current = configuration[i];
                let prev = configuration[i - 1 < 0 ? seats - 1 : i - 1];
                let next = configuration[(i + 1) % seats];

                // if (persons.getEdgeWeight(current, prev) === Infinity) {
                //     console.log([current, prev]);
                // }

                happiness +=
                    persons.getEdgeWeight(current, prev, 0)
                    + persons.getEdgeWeight(current, next, 0);

            }

            //console.log(configuration, happiness);

            return happiness;
        });

    }

    console.log(
        getMaximumHappiness(persons)
            .reduce( (acc, val) => Math.max(acc, val), -Infinity ),
        'Part 1'
    );

    console.log(
        getMaximumHappiness(personsWithMe)
            .reduce( (acc, val) => Math.max(acc, val), -Infinity ),
        'Part 2'
    );

})();