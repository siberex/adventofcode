import fs from 'node:fs/promises';

const LIMIT = {
    red: 12,
    green: 13,
    blue: 14
}

// const urlInput = new URL('./input.sample.txt', import.meta.url);
const urlInput = new URL('./input.txt', import.meta.url);
//fs.readFile(urlInput, 'utf8').then(console.log);

const fileInput = await fs.open(urlInput);

const possibleGameIds = [];
const gameIdsPower = [];

/**
 * isPossibleSet
 * @param {{red: Number, green: Number, blue: Number}} set 
 * @returns bool
 */
const isPossibleSet = set => (
    set.red <= LIMIT.red 
        && set.green <= LIMIT.green 
        && set.blue <= LIMIT.blue
);

for await (const line of fileInput.readLines()) {
    // line = 'Game 4: 1 green, 3 red, 6 blue; 3 green, 6 red; 3 green, 15 blue, 14 red'
    const [_, id, game] = line.match(/^Game (\d+): (.*)$/);

    // game = '1 green, 3 red, 6 blue; 3 green, 6 red; 3 green, 15 blue, 14 red'
    // sets[2] = '3 green, 15 blue, 14 red'
    const sets = game.match(/(\d+ (?:red|green|blue),? ?)+/g);

    /* s = [
        { red: 3, green: 1, blue: 6 },
        { red: 6, green: 3, blue: 0 },
        { red: 14, green: 3, blue: 15 }
    ] */
    const s = sets.map(setStr => {
        const set = {red: 0, green: 0, blue: 0};
        for (const [_, count, color] of setStr.matchAll(/(\d+) (red|green|blue)/g) ) {
            set[color] = parseInt(count);
        }
        return set;
    });

    // Part 1
    if (s.filter(isPossibleSet).length === s.length) {
        // console.log(id, s.map(v => Object.values(v)));
        possibleGameIds.push( parseInt(id) );
    }

    // Part 2
    /**
     * @type {{red: Number, green: Number, blue: Number}}
     */
    const lowerBound = s.reduce((acc, compare) => {
        for (const [key, value] of Object.entries(acc)) {
            acc[key] = Math.max(value, compare[key]);
        }
        return acc;
    }, {red: 0, green: 0, blue: 0});
    // console.log(id, lowerBound);

    gameIdsPower.push( lowerBound.red * lowerBound.green * lowerBound.blue );
}

const sumIds = possibleGameIds.reduce((acc, v) => acc + v, 0);
console.log('part1', sumIds);

const sumPower = gameIdsPower.reduce((acc, v) => acc + v, 0);
console.log('part2', sumPower);
