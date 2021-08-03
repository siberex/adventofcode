# [Advent of code 2019](https://adventofcode.com/2019)


# 1: The Tyranny of the Rocket Equation

```js
let input = await fetch('https://adventofcode.com/2019/day/1/input').then(r => r.text());
input = input.split('\n').filter(Boolean);

// Part 1
input.reduce((acc, curr) => {
    const res = (parseInt(curr) / 3 | 0) - 2;
    return acc + BigInt(res);
}, 0n);

// Part 2
function fuel(n) {
    n = parseInt(n);
    n = (n / 3 | 0) - 2;
    return n <= 0 ? 0 : n + fuel(n);
}
input.reduce((acc, curr) => {
    return acc + BigInt(fuel(curr));
}, 0n);
```


# 4: Secure Container

```js
const input = '234208-765869';
const [from, to] = input.split('-').map(v => parseInt(v));

// Part 1
const reDuplicate = /([0-9])\1{1}/;
function test(n) {
    const nStr = n.toString();
    if (!reDuplicate.test(nStr)) return false;
    // Going from left to right, the digits never decrease
    return nStr.split('')
        .map(x => x | 0)
        .reduce(
            (acc, curr, i, digits) =>
                digits[i - 1]
                    ? (curr >= digits[i - 1]) && acc
                    : acc,
            true
        );
}
let count = 0;
for (let i = from; i < to; i++) {
    count += test(i);
}

// Part 2
function test(n) {
    const nStr = n.toString();
    // Two adjacent matching digits are not part of a larger group of matching digits
    const doubles = nStr.match(/([0-9])\1+/g)?.filter(m => m.length === 2);
    if (!doubles || !doubles.length) return false;

    // Going from left to right, the digits never decrease
    return nStr.split('')
        .map(x => x | 0)
        .reduce(
            (acc, curr, i, digits) =>
                digits[i - 1]
                    ? (curr >= digits[i - 1]) && acc
                    : acc,
            true
        );
}
let count = 0;
for (let i = from; i < to; i++) {
    count += test(i);
}
```

