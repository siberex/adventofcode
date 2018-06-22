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
    let data = await fs.readFileSync(inputFile, 'utf8');

    data = data.split("\n");

    let matchRe = /^(?:turn )?(on|off|toggle) (\d+),(\d+) through (\d+),(\d+)$/;


    const width = 1000
        , height = 1000;

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
                        lights[i][j] = true;
                        break;
                    case 'off':
                        lights[i][j] = false;
                        break;
                    case 'toggle':
                        lights[i][j] = !lights[i][j];
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


    return;

    lights = lights.map(line => {

        return line.map(light => {
            if (light) {
                countOn++;
                return '1';
            }
            return '0'
        }).join('');

        // return line.reduce((acc, light) => {
        //     if (light) {
        //         countOn++;
        //         return acc + '*';
        //     }
        //     return acc + '_';
        // }, '');

    }).join("\n");


    fs.writeFile(outputFile, lights, function(err) {
        if(err) {
            return console.log(err);
        }
        console.log("The file was saved!");
    });

    //console.log(lights);
    console.log(countOn);

    // let bitmap = 'BM'                       // Windows Bitmap
    //     + (width * height + 54).toString()  // File size (bytes): W × H + header (54 bytes)
    //     + '\x00\x00'                        // Reserved
    //     + '\x00\x00'                        // Reserved
    //     + '\x36\x00\x00\x00'                // Pixel array offset (54 bytes)
    //     + '\x28\x00\x00\x00'                // Windows BITMAPINFOHEADER size (40 bytes)
    //     + width                             // Width in pixels
    //     + height                            // Height in pixels
    //     + '\x01\x00'                        // Number of color planes (1)
    //     + '\x18\x00'                        // 24 bits / pixel
    //     + '\x00\x00\x00\x00'                // No compression (0)
    //     + (width * height)                  // Size of the raw bitmap data (bytes)
    //     + '\x13\x0B\x00\x00'                // Horizontal resolution (pixel per metre, signed integer), 2835 dpm = 72 dpi
    //     + '\x13\x0B\x00\x00'                // Vertical resolution, 2835 dpm = 72 dpi
    //     + '\x00\x00\x00\x00'                // Number of colors in the palette (keep 0 for 24-bit)
    //     + '\x00\x00\x00\x00'                // Important colors (0 = every color is important)
    //     + '';

    //
    // function parseBMP(arrayBuffer) {
    //     var stream = new DataStream(arrayBuffer, 0,
    //         DataStream.LITTLE_ENDIAN);
    //     var header = stream.readUint8Array(2);
    //     var fileSize = stream.readUint32();
    //     // Skip the next two 16-bit integers
    //     stream.readUint16();
    //     stream.readUint16();
    //     var pixelOffset = stream.readUint32();
    //     // Now parse the DIB header
    //     var dibHeaderSize = stream.readUint32();
    //     var imageWidth = stream.readInt32();
    //     var imageHeight = stream.readInt32();
    //     // ...
    // }


})();
