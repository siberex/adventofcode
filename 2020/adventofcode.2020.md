# [Advent of code 2020](https://adventofcode.com/2020)


# 1: Report Repair

```js
input = input.split('\n').map(v => parseInt(v));
for (let i = 0; i < input.length; i++) {
  const a = input[i];
  for (let j = i + 1; j < input.length; j++) {
    const b = input[j];
    if (a + b == 2020) { console.log(a * b); }
  }
}
```

```js
for (let i = 0; i < input.length; i++) {
  const a = input[i];
  for (let j = i + 1; j < input.length; j++) {
    const b = input[j];
    for (let k = j + 1; k < input.length; k++) {
      const c = input[k];  
      if (a + b + c == 2020) { console.log(a * b * c); }
    }
  }
}
```


# 2: Password Philosophy

```js
input = input.split("\n").map(s => {
  let [policy, pw] = s.split(': ');
  let [minmax, ch] = policy.split(' ');
  let [min, max] = minmax.split('-')
  return {min, max, ch, pw};
});
let good = 0;
input.forEach(v => {
  const {min, max, ch, pw} = v;
  const re = new RegExp(ch, 'g');
  const len = pw.match(re)?.length ?? 0;
  if (len >= min && len <= max) {
    good++;
  }
});
```

```js
let good = 0;
input.forEach(v => {
  const {min: x, max: y, ch, pw} = v;
  if ( (pw[x - 1] === ch) ^ (pw[y - 1] === ch ) ) {
    good++;
  }
});
```


# 3: Toboggan Trajectory

```js
input = input.split('\n').map(row => row.split('').map(v => (v === '#') & 1));
let count = 0;
let j = 0;
for (let i = 1; i < input.length; i++) {
  j = (j + 3) % input[i].length;
  if (input[i][j]) count++;
}
console.log(count);
```

```js
const slope = (right = 3, down = 1) => {
  let count = 0;
  let j = 0;
  for (let i = down; i < input.length; i += down) {
    j = (j + right) % input[i].length;
    if (input[i][j]) count++;
  }
  return count;
};
[[1,1],[3,1],[5,1],[7,1],[1,2]]
  .map(([right, down]) => slope(right, down))
  .reduce((acc, curr) => acc * BigInt(curr), 1n);
```


# 4: Passport Processing

```js
input = input.split('\n\n');
const test = ['byr', 'iyr', 'eyr', 'hgt', 'hcl', 'ecl', 'pid'].sort().join('|');
const re = new RegExp(`(${test}):\\S+`, 'g');
input.reduce((acc, pasportData) => {
  const matched = pasportData.match(re)
    .map(field => field.substr(0, 3))
    .sort().join('|');
  return matched === test ? acc + 1 : acc;
}, 0);
```

```js
input = input.split('\n\n');
const required = [
  [/(byr):(\d{4})/g, 1920, 2002],
  [/(iyr):(\d{4})/g, 2010, 2020],
  [/(eyr):(\d{4})/g, 2020, 2030],
  [/(hgt):(\d+)cm/g, 150, 193],
  [/(hgt):(\d+)in/g, 59, 76],
  [/(hcl):#[0-9a-f]{6}/g],
  [/(ecl):(amb|blu|brn|gry|grn|hzl|oth)/g],
  [/(pid):\d{9}/g],
];
input.reduce((acc, pasportData) => {
  const matched = required.map(req => {
    const [re, min, max] = req;
    const matched = pasportData.matchAll(re).next().value?.slice(1); // ['byr', '1920'], ['hcl'] or undefined
    if (!matched) return null;
    if (min && max) {
      const val = parseInt(matched[1]);
      if (val > max || val < min) return null;
    }
    return matched[0];
  })
  .filter(Boolean)
  .sort().join('|');;
  return matched === test ? acc + 1 : acc;
}, 0);
```


# 5: Binary Boarding

```js
let input = await fetch('https://adventofcode.com/2020/day/5/input').then(r => r.text());
input = input.split('\n').filter(Boolean);
input.map(v => {
  let row = v.substr(0,7).replaceAll('F', 0).replaceAll('B', 1);
  row = parseInt(row, 2);
  let col = v.substr(7,3).replaceAll('R', 1).replaceAll('L', 0);
  col = parseInt(col, 2);
  return row * 8 + col;
})
.reduce((a,c) => a > c ? a : c, -Infinity);

```

```js
let rows = Array(128).fill().map(() => Array(8).fill(0));
input.forEach(v => {
  let row = v.substr(0,7).replaceAll('F', 0).replaceAll('B', 1);
  row = parseInt(row, 2);
  let col = v.substr(7,3).replaceAll('R', 1).replaceAll('L', 0);
  col = parseInt(col, 2);
  rows[row][col] = 1;
});
rows.forEach((row, i, rows) => {
  if (
    parseInt(row.join(''), 2) !== 255 
    && row.reduce((a, b) => a + b, 0) === 7
  ) {
      console.log(i * 8 + row.indexOf(0));
  };
});
```


# 6: Custom Customs

```js
input = input.split('\n\n');
input.map(group => {
  const answers = group.split('\n').reduce((acc, curr) => {
    if (acc === null) return new Set(curr);
    return new Set([...acc, ...curr]);
  }, null);
  return answers.size;
})
.reduce((a, b) => a + b, 0);
```

```js
input.map(group => {
  const answers = group.split('\n').reduce((acc, curr) => {
    if (acc === null) return new Set(curr);
    return new Set(
      [...curr].filter(a => acc.has(a))
    );
  }, null);
  return answers.size;
})
.reduce((a, b) => a + b, 0);
```


# 8: Handheld Halting

```js
let input = `nop +0
acc +1
jmp +4
acc +3
jmp -3
acc -99
acc +1
jmp -4
acc +6`;

let instructions = input.split('\n').map(v => {
  let [cmd, arg] = v.split(' ');
  arg = parseInt(arg);
  return {
    cmd,
    arg,
    visited: false,
  }
});

let value = 0;
for (let i = 0; i < instructions.length; i++) {
  let {cmd, arg, visited} = instructions[i];
  if (visited) break;
  instructions[i].visited = true;
  if (cmd === 'nop') {
    continue;
  } else if (cmd === 'acc') {
    value += arg;
  } else if (cmd === 'jmp') {
    i += arg - 1;
  }
}
console.log(value);
```


# 12: Rain Risk

```js
let input = `F10
N3
F7
R90
F11`;
input = input.split('\n');

let ship = {
  x: 0,
  y: 0,
  dir: 'E',
};

const directions = {
  E: 0,
  N: 90,
  W: 180,
  S: 270,
  0: 'E',
  90: 'N',
  180: 'W',
  270: 'S',
  '-90': 'S',
  '-180': 'W',
  '-270': 'N',
};

let commands = {
  N: v => {ship.y += v},
  S: v => {ship.y -= v},
  E: v => {ship.x += v},
  W: v => {ship.x -= v},
  L: v => {
    const angle = (directions[ship.dir] + v) % 360;
    ship.dir = directions[angle];
  },
  R: v => {
    const angle = (directions[ship.dir] - v) % 360;
    ship.dir = directions[angle];
  },
  F: v => commands[ship.dir](v),
}

input.forEach(cmd => {
  const val = parseInt(cmd.substring(1));
  cmd = cmd.substring(0, 1);
  commands[cmd](val);
});

console.log(Math.abs(ship.x) + Math.abs(ship.y));
```

```js
const deg2rad = deg => deg * Math.PI / 180;
const round2 = (n, p) => Math.round( n * 100 ) / 100;

const rotateVector = function(x, y, angle) {
  angle = deg2rad(angle);
  const cos = Math.cos(angle)
  const sin = Math.sin(angle);
  const newX = x * cos - y * sin;
  const newY = x * sin + y * cos;
  return [round2(newX), round2(newY)];
}

let ship = {
  x: 0,
  y: 0,
  dx: 10,
  dy: 1,
};

let commands = {
  N: v => {ship.dy += v},
  S: v => {ship.dy -= v},
  E: v => {ship.dx += v},
  W: v => {ship.dx -= v},
  L: v => {
    const [dx, dy] = rotateVector(ship.dx, ship.dy, v);
    ship.dx = dx;
    ship.dy = dy;
  },
  R: v => {
    const [dx, dy] = rotateVector(ship.dx, ship.dy, -v);
    ship.dx = dx;
    ship.dy = dy;
  },
  F: v => {
    for (let i = 0; i < v; i++) {
      ship.x += ship.dx;
      ship.y += ship.dy;
    }
  },
};

input.forEach(cmd => {
  const val = parseInt(cmd.substring(1));
  cmd = cmd.substring(0, 1);
  commands[cmd](val);
});

console.log(Math.abs(ship.x) + Math.abs(ship.y));
```


# 13: Shuttle Search

```js
let input = `939
7,13,x,x,59,x,31,19`;
input = input.split('\n');
let ts = parseInt(input[0]);
let ids = input[1].split(',').map(v => parseInt(v)).filter(Boolean);

let remainders = ids.map(n => {
  const mul = Math.floor(ts / n) + 1;
  return mul * n - ts;
});
let bestWait = Math.min(...remainders);
let bestId = ids[remainders.indexOf(bestWait)];

console.log(bestWait * bestId);
```

```js
let ids = '7,13,x,x,59,x,31,19'.split(',').map( v => v === 'x' ? null : parseInt(v) );
let ts = ids[0];
infinity:
while (true) {
  let i = 0;
  for (i = 0; i < ids.length; i++) {
    if (ids[i] === null) continue;
    if ( (ts + i) % ids[i] !== 0 ) {
      break;
    }    
  }
  if (i === ids.length) {
    break infinity;
  }
  ts += ids[0];
}
console.log(ts);
```


# 15: Rambunctious Recitation

```js
let input = `1,3,2`;
let nums = input.split(',').map(v => v | 0);
for (let i = nums.length; i < 2020; i++) {
  const last = nums.pop();
  const iLast = nums.lastIndexOf(last);
  nums.push(last);
  nums.push(iLast === -1 ? 0 : i - iLast - 1);
}
console.log( nums[nums.length - 1] );
```

```js
let input = `1,3,2`;
let pos = new Map();
let nums = input.split(',').map(v => v | 0);
for (let i = 0; i < nums.length - 1; i++) {
  pos.set(nums[i], i);
}

let last = nums[nums.length - 1];
for (let i = nums.length; i < 30000000; i++) {
  const iLast = pos.get(last);
  pos.set(last, i - 1);
  last = isNaN(iLast) ? 0 : i - iLast - 1;
}

console.log(last);
```

