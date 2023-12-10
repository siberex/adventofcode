import re
import functools 
import operator 

# input_filename = 'input.sample1.txt'
input_filename = 'input.txt'

reDigit = re.compile('\d{1}')
sum = 0
numsList = []

with open(input_filename) as f:
    for line in f:
        line = line.rstrip('\r\n')
        digits = reDigit.findall(line)
        count = len(digits)
        numStr = f'{digits[0]}{digits[count-1]}'
        # print(f'{line:s}: {",".join(digits)}: {numStr:s}')
        numsList.append(int(numStr))

print(functools.reduce(operator.add, numsList)) 
