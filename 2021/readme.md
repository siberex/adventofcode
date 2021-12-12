

## Day 1

Part 1:

```js
const inputRaw = await fetch('https://adventofcode.com/2021/day/1/input').then(response => response.text());
const input = inputRaw.split('\n').filter(Boolean);
let sumInc = 0;
for (let i = 1; i < input.length; i++) {
  if (input[i] > input[i-1]) sumInc++;
}
console.log(sumInc);

// 1582 → too low. WUT?
// correct answer: 1583
```


## Day 2

Part 1:

```js
const inputRaw = await fetch('https://adventofcode.com/2021/day/2/input').then(response => response.text());
const input = inputRaw.split('\n').filter(Boolean);

let position = 0;
let depth = 0;
const actions = {
    'forward': (v) => { position += v },
    'down': (v) => { depth += v },
    'up': (v) => { depth -= v },
}

input.forEach(line => {
    let [cmd, val] = line.split(' ');
    actions[cmd](val | 0);
});

console.log(position * depth);
```

