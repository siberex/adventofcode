"use strict";

const fs    = require('fs')
    , path  = require('path')
;


const width = 1000
    , height = 1000;


process.on('unhandledRejection', error => {
    console.error('unhandledRejection', error.message);
});


(async function () {

    // If current file is 123.js, will read file 123.txt as input
    const inputFile = __dirname + '/' + path.basename(__filename, '.js') + '.txt';
    const outputFile = __dirname + '/' + path.basename(__filename, '.js') + '-out.txt';
    const outputBmp = __dirname + '/' + path.basename(__filename, '.js') + '-out.bmp';
    let data = await fs.readFileSync(inputFile, 'utf8');

    data = data.split("\n");

    let matchRe = /^(?:turn )?(on|off|toggle) (\d+),(\d+) through (\d+),(\d+)$/;


    // Fill array 1000 × 1000 with values (false)
    let lights = Array.from(
        Array(height),
        () => Array.from(Array(width), () => false)
    );

    // Parse commands
    data = data.map(line => {
        // line = 'turn on 489,959 through 759,964'
        let res = matchRe.exec(line);
        if (res) res = res.slice(1)
            .map( (v, i) => i > 0 ? +v : v );
        return res;
    });

    // Execute commands on lights array
    data.map(action => {
        if (!action) {
            return;
        }

        let [cmd, x1, y1, x2, y2] = action;
        //console.log(cmd, x1, y1, x2, y2);

        for (let j = y1; j <= y2; j++) {
            for (let i = x1; i <= x2; i++) {
                switch (cmd) {
                    case 'on':
                        lights[j][i] = true;
                        break;
                    case 'off':
                        lights[j][i] = false;
                        break;
                    case 'toggle':
                        lights[j][i] = !lights[j][i];
                        break;
                }
            }
        }

    });

    // Count lit lights
    let countLit = lights.reduce(
        (sum, line) => line.reduce( (sum, pixel) => pixel ? sum + +pixel : sum, sum),
        0
    );

    console.log(countLit, 'how many lights are lit');


    // let lightsTxt = lights.map(
    //     line => line.map(light => +light).join('')
    // ).join("\n");
    //
    //
    // fs.writeFile(outputFile, lightsTxt, function(err) {
    //     if(err) {
    //         return console.log(err);
    //     }
    //     console.log('Result file was saved!');
    // });


    // Bits per pixel
    const bpp           = 24;
    //let dataSize        = width * height * (bpp / 8 | 0);

    // https://en.wikipedia.org/wiki/BMP_file_format
    // Each row in the Pixel array is padded to a multiple of 4 bytes in size
    let rowSize         = Math.floor( (bpp * width + 31) / 32 ) * 4;
    let pixelArraySize  = rowSize * height;

    let BMP = new DataView(new ArrayBuffer(54));

    // Bitmap file header
    'BM'.split('').map( (v, i) => {
        BMP.setUint8(i, v.charCodeAt(0));
    });
    BMP.setUint32(2,  pixelArraySize + 54, true);   // File size (bytes): pixel array size + headers (=54 bytes)
    BMP.setUint16(6,  0, true);                     // Reserved
    BMP.setUint16(8,  0, true);                     // Reserved
    BMP.setUint32(10, 54, true);                    // Pixel array offset (=54 bytes)

    // DIB header, Windows BITMAPINFOHEADER
    BMP.setUint32(14, 40, true);                    // DIB header size (=40 bytes)
    BMP.setUint32(18, width, true);                 // Width in pixels
    BMP.setUint32(22, height, true);                // Height in pixels
    BMP.setUint16(26, 1, true);                     // Number of color planes (1)
    BMP.setUint16(28, bpp, true);                   // Bits per pixel
    BMP.setUint32(30, 0, true);                     // No compression (0)
    BMP.setUint32(34, pixelArraySize, true);        // Size of the raw bitmap data (bytes) including rows padding
    BMP.setUint32(38, 2835, true);                  // Horizontal resolution (pixels per metre, signed integer), 2835 dpm = 72 dpi
    BMP.setUint32(42, 2835, true);                  // Vertical resolution, 2835 dpm = 72 dpi
    BMP.setUint32(46, 0, true);                     // Number of colors in the palette (keep 0 for default 2^bpp)
    BMP.setUint32(50, 0, true);                     // Important colors (0 = every color is important)

    let bmpData = new DataView(new ArrayBuffer(pixelArraySize));

    // Offset of a pixel value
    let i = 0;
    let byesPerPixel = (bpp / 8) | 0;
    // From bottom row to the top
    for (let y = height - 1; y >= 0; y--) {
        for (let x = 0; x < width; x++) {

            let pixelData = lights[y][x] ? 255 : 0;

            bmpData.setUint8(i,     pixelData); // B
            bmpData.setUint8(i + 1, pixelData); // G
            bmpData.setUint8(i + 2, pixelData); // R

            i += byesPerPixel;
        }
        i = rowSize * (height - y);
    }

    //console.log(BMP.buffer.byteLength + bmpData.buffer.byteLength, 'bmp length');

    let buffer = Buffer.concat([
        Buffer.from(BMP.buffer),
        Buffer.from(bmpData.buffer)
    ]);

    fs.writeFileSync(outputBmp, buffer);

})();
