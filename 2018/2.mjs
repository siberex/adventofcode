import { fileURLToPath } from 'url';
import path, { dirname } from 'path';
import { promises as fs } from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const inputFile = path.join(__dirname, path.basename(__filename, '.mjs') + '.txt');

let rawInput = `abcdef
bababc
abbcde
abcccd
aabcdd
abcdee
ababab`;
rawInput = (await fs.readFile(inputFile)).toString();

const input = rawInput.split('\n').filter(Boolean);


// Part 1
let twos = 0;
let threes = 0;

input.forEach(str => {
    // Count chars in string: 'bababc' → { b: 3, a: 2, c: 1 }
    const chars = str.split('')
    const count = chars.reduce((cnt, char) => {cnt[char] = cnt[char] ? ++cnt[char] : 1; return cnt}, {});

    const countDesc = Object.values(count).sort((a, b) => b - a);

    if (countDesc[0] === 3) {
        threes++;
    }
    if (countDesc[0] === 2 || countDesc[1] === 2) {
        twos++;
    }
});

console.log(twos * threes);


// Part 2

let input2 = `abcde
fghij
klmno
pqrst
fguij
axcye
wvxyz`.split('\n').sort();

// ...



