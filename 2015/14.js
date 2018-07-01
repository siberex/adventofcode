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
    let data = fs.readFileSync(inputFile, 'utf8');
    data = data.split("\n");


    let time = 2503;


    let matchRe = /^(\w+) can fly (\d+) km\/s for (\d+) seconds, but then must rest for (\d+) seconds\.$/;

    data = data.map(line => {
        // line = 'Donner can fly 9 km/s for 5 seconds, but then must rest for 38 seconds.'

        if (!line.length) {
            return null;
        }

        let res = matchRe.exec(line);
        if (!res) {
            console.error('NOT PARSED: ' + line);
            return null;
        }

        // res = [ 'Donner', '9', '5', '38' ]
        res = res.slice(1);

        let [name, speed, timeFly, timeRest] = res;
        speed       = speed|0;
        timeFly     = timeFly|0;
        timeRest    = timeRest|0;

        return [name, speed, timeFly, timeRest];
    }).filter(v => v !== null);


    function getDist(time, speed, timeFly, timeRest) {
        let segmentDistance = speed * timeFly;
        let segmentTime = timeFly + timeRest;

        let dist = Math.floor(time / segmentTime) * segmentDistance;
        dist += Math.min(time % segmentTime, timeFly) * speed;

        return dist;
    } // getDist


    let firstRun = data.map(deer => {
        let [name, speed, timeFly, timeRest] = deer;
        return getDist(time, speed, timeFly, timeRest);
    });

    console.log(
        firstRun.reduce( (acc, val) => Math.max(acc, val), -Infinity ),
        'Part 1'
    );


    let points = new Map( data.map(deer => [deer[0], 0]) );

    for (let s = 1; s <= time; s++) {
        let leader = data.map(deer => {
            let [name, speed, timeFly, timeRest] = deer;
            return [
                name,
                getDist(s, speed, timeFly, timeRest)
            ];
        }).reduce(
            (acc, val) => acc[1] > val[1] ? acc : val,
            [null, -Infinity]
        );

        points.set(
            leader[0],
            points.get(leader[0]) + 1
        );
    }

    console.log(points);

    console.log(
        Math.max( ...points.values() ),
        'Part 2'
    );

})();