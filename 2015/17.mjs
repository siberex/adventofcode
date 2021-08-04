
let inputStr = `43
3
4
10
21
44
4
6
47
41
34
17
17
44
36
31
46
9
27
38`;

let target = 150;

inputStr = `20 15 10 5 5`;
target = 25;


let input = inputStr.split(/[^\d]+/).filter(Boolean).map(n => parseInt(n));
input.sort((a, b) => a - b);

console.log(input, 'Input');

let output = [];

for (let i = 0; i < input.length; i++) {
    let sum = 0;
    let n = input[i];

    sum += n;

    console.log(n);
}


// WIP
function upToTarget(targetSum, currentSum, remainingItems, sumItems) {
    if (currentSum > targetSum) return null;
    if (currentSum === targetSum) return sumItems;
    if (remainingItems.length < 1) return null;

    remainingItems.slice(1)

}
