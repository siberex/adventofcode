

## 1

```js
// https://adventofcode.com/2021/day/1/input
const input = document.body.innerText.split('\n').filter(Boolean);
let sumInc = 0;
for (let i = 1; i < input.length; i++) {
  if (input[i] > input[i-1]) sumInc++;
}
console.log(sumInc);

// 1582 → too low. WUT?

```

