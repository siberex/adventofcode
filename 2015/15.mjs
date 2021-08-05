import { fileURLToPath } from 'url';
import path, { dirname } from 'path';
import { promises as fs } from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const inputFile = path.join(__dirname, path.basename(__filename, '.mjs') + '.txt');
const rawInput = await fs.readFile(inputFile, 'utf8');

const matchRe = /^(\w+): capacity (-?\d+), durability (-?\d+), flavor (-?\d+), texture (-?\d+), calories (-?\d+)$/;

let data = rawInput.split('\n').map(line => {
    if (!line.length) {
        return null;
    }

    // line = 'PeanutButter: capacity -1, durability 3, flavor 0, texture 0, calories 1'

    let res = matchRe.exec(line);
    if (!res) {
        console.error('NOT PARSED: ' + line);
        return null;
    }

    res = res.slice(1);

    let [name, capacity, durability, flavor, texture, calories] = res;
    capacity    |= 0;
    durability  |= 0;
    flavor      |= 0;
    texture     |= 0;
    calories    |= 0;

    // [ 'PeanutButter', -1, 3, 0, 0, 1 ]
    // console.log([name, capacity, durability, flavor, texture, calories]);

    return [name, capacity, durability, flavor, texture, calories];
})
.filter(v => v !== null);

console.log(data);
