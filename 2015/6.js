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


    lights = lights.map(line => {

        return line.map(light => +light).join('');

        // return line.reduce((acc, light) => {
        //     if (light) {
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


    // https://en.wikipedia.org/wiki/BMP_file_format
    let bitmap = 'BM'               // Windows Bitmap header, 14 bytes total:
        + (width * height + 54)     // File size (bytes): W × H + headers (=54 bytes)
        + '\x00\x00'                // Reserved
        + '\x00\x00'                // Reserved
        + '\x36\x00\x00\x00'        // Pixel array offset (=54 bytes)
        // Windows BITMAPINFOHEADER
        + '\x28\x00\x00\x00'        // Header size (=40 bytes)
        + width                     // Width in pixels
        + height                    // Height in pixels
        + '\x01\x00'                // Number of color planes (1)
        + '\x18\x00'                // 24 bits per pixel

        + '\x00\x00\x00\x00'        // No compression (0)
        + (width * height)          // Size of the raw bitmap data (bytes)
        + '\x13\x0B\x00\x00'        // Horizontal resolution (pixels per metre, signed integer), 2835 dpm = 72 dpi
        + '\x13\x0B\x00\x00'        // Vertical resolution, 2835 dpm = 72 dpi
        + '\x00\x00\x00\x00'        // Number of colors in the palette (keep 0 for default 2^bpp)
        + '\x00\x00\x00\x00'        // Important colors (0 = every color is important)
        + 'binary data...';


    let buffer = new ArrayBuffer(24);
    // ... read the data into the buffer ...
    let idView = new Uint32Array(buffer, 0, 1);
    let usernameView = new Uint8Array(buffer, 4, 16);
    let amountDueView = new Float32Array(buffer, 20, 1);


    // Bits per pixel
    const bpp           = 24;
    let dataSize        = width * height * (bpp / 8 | 0);
    // Each row in the Pixel array is padded to a multiple of 4 bytes in size
    let rowSize         = Math.floor( (bpp * width + 31) / 32 ) * 4;
    let pixelArraySize  = rowSize * height;

    let BMP = new DataView(new ArrayBuffer(54));
    // Bitmap file header
    BMP.setString(0, 'BM');                         // Windows Bitmap
    BMP.setUint32(2, pixelArraySize + 54, true);    // File size (bytes): W × H + headers (=54 bytes)
    BMP.setUint16(6, 0, true);                      // Reserved
    BMP.setUint16(8, 0, true);                      // Reserved
    BMP.setUint32(10, 54, true);                    // Pixel array offset (=54 bytes)
    // DIB header, Windows BITMAPINFOHEADER
    BMP.setUint32(14, 40, true);                    // DIB header size (=40 bytes)
    BMP.setUint32(18, width, true);                 // Width in pixels
    BMP.setUint32(22, height, true);                // Height in pixels
    BMP.setUint16(26, 1, true);                     // Number of color planes (1)
    BMP.setUint16(28, bpp, true);                   // Bits per pixel
    BMP.setUint32(30, 0, true);                     // No compression (0)
    BMP.setUint32(34, pixelArraySize, true);        // Size of the raw bitmap data (bytes) including padding (!)
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
            //let pixelData = data[y][x];
            let pixelData = 0;
            bmpData.setUint24(i, pixelData);
            i += byesPerPixel;
        }
        i = rowSize * (height - y);
    }

    //bmpData.setUint8ClampedArray(...);



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
