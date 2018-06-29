### What is this about?

Just a repo with my solutions for [adventofcode.com](http://adventofcode.com)

### Notable stuff

`2015/6.js` — BMP generation using `ArrayBuffer`: https://gist.github.com/siberex/9b843d5f3b0c573f6d3c4f4ca7205f73

`2015/9.js` — Graph implementation


### JS stuff to remember

Clone object:

	let clonedObject = { ...originalObject };
	
Map from object:

	let myMap = new Map( Object.entries(myObject) );
	
Create 2-dimensional array and fill it with values:

    // Fill 100 × 100 array with values (42)
    let arr = Array.from(
        Array(100),
        () => Array.from(Array(100), () => 42)
    );