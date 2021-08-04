import { fileURLToPath } from 'url';
import path, { dirname } from 'path';
import { promises as fs } from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const outputFile = path.join(__dirname, path.basename(__filename, '.mjs') + '.rle');

// Conway's Game of Life. See also 2015/18

let input = `..#.#
.#.##
...#.
...##
#.###`;

input = `....#
#..#.
#..##
..#..
#....`;

// http://golly.sourceforge.net/Help/formats.html
// Birth 1 or 2, Survival 1 → 'B12/S1'
// 5x5 bounded grid → 'P5,5'
// four adjacent tiles = Von Neumann neighbourhood → 'V' suffix
// https://conwaylife.com/wiki/Von_Neumann_neighbourhood
const header = 'x = 5, y = 5, rule = B12/S1V:P5,5\n';

let data = input.split('\n').filter(Boolean).map(
    // # → o, . → b
    line => line.replace(/#/g, 'o').replace(/\./g, 'b')
);

let rle = header;

// End of the row marker
rle += data.join('$\n');
// End of the pattern marker
rle += '!';

await fs.writeFile(outputFile, rle);
