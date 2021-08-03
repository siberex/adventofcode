import { fileURLToPath } from 'url';
import path, { dirname } from 'path';
import { promises as fs } from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const inputFile = path.join(__dirname, path.basename(__filename, '.mjs') + '.txt');
const rawInput = (await fs.readFile(inputFile)).toString();
let input = rawInput.split(/[^\d\-]+/).filter(Boolean).map(n => parseInt(n));

// Part 1
const res1 = input.reduce((prev, curr) => prev + curr, 0);
console.log(res1);

// Part 2
const checkSet = new Set();
let sum = 0;
checkSet.add(0);

// noinspection InfiniteLoopJS
for (let i = 0; true; i++, i = i % input.length) {
    sum += input[i];
    if ( checkSet.has(sum) ) {
        console.log(sum);
        break;
    }
    checkSet.add(sum);
}
