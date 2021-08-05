import { fileURLToPath } from 'url';
import path, { dirname } from 'path';
import { promises as fs } from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const inputFile = path.join(__dirname, path.basename(__filename, '.mjs') + '.txt');
const rawInput = await fs.readFile(inputFile, 'utf8');

const matchRe = /^(\w+): capacity (-?\d+), durability (-?\d+), flavor (-?\d+), texture (-?\d+), calories (-?\d+)$/;

//const re = /(?:(\w+) (-?\d+))+/g;
//Object.fromEntries([...'PeanutButter: capacity -1, durability 3, flavor 0, texture 0, calories 1'.matchAll(/(?:(\w+) (-?\d+))+/g)].map(v => v.slice(1)))

let data = rawInput.split('\n').map(line => {
    // line = 'PeanutButter: capacity -1, durability 3, flavor 0, texture 0, calories 1'
    let res = matchRe.exec(line);
    if (!res) return null;

    res = res.slice(1);
    //  [ 'PeanutButter', -1, 3, 0, 0, 1 ],
    return res.map(
        // parseInt all values except the first (name)
        (v, i) => i ? v | 0 : v
    );
}).filter(Boolean);

console.log(data);
