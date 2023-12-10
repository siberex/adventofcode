import re
import functools 
import operator 

# input_filename = 'input.sample2.txt'
input_filename = 'input.txt'

digitsList = 'one, two, three, four, five, six, seven, eight, nine'.split(', ')

digitsDict = {val:str(idx+1) for idx, val in enumerate(digitsList)}

reDigit = re.compile( '\d{1}' + '|' + '|'.join(digitsList) )

sum = 0
numsList = []

with open(input_filename) as f:
    for line in f:
        line = line.rstrip('\r\n')
        digits = reDigit.findall(line)
        digits = list(map(lambda x: digitsDict.get(x, x), digits))
        count = len(digits)
        numStr = f'{digits[0]}{digits[count-1]}'
        # print(f'{line:s}: {",".join(digits)}: {numStr:s}')
        numsList.append(int(numStr))

print(functools.reduce(operator.add, numsList)) 
