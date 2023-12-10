import re
import functools 
import operator 

# input_filename = 'input.sample2.txt'
input_filename = 'input.txt'

digitsList = 'one, two, three, four, five, six, seven, eight, nine'.split(', ')

digitsDictStr = {val:(idx+1) for idx, val in enumerate(digitsList)}
digitsDictNum = {str(n):n for n in range(0, 10)}

# {'0': 0, '1': 1, '2': 2, '3': 3, '4': 4, '5': 5, '6': 6, '7': 7, '8': 8, '9': 9, 
#   'one': 1, 'two': 2, 'three': 3, 'four': 4, 'five': 5, 'six': 6, 'seven': 7, 'eight': 8, 'nine': 9}
digitsDict = digitsDictNum | digitsDictStr


regexStr = '\d{1}' + '|' + '|'.join(digitsList)

reDigit = re.compile( regexStr )

sum = 0
numsList = []

with open(input_filename) as f:
    for line in f:
        line = line.rstrip('\r\n')

        digitPositionsLeft = {k: line.find(k) for k, _v in digitsDict.items()}
        digitPositionsRight = {k: line.rfind(k) for k, _v in digitsDict.items()}

        digitPositionsLeft = dict(filter(lambda keyVal: keyVal[1] != -1, digitPositionsLeft.items()))
        digitPositionsRight = dict(filter(lambda keyVal: keyVal[1] != -1, digitPositionsRight.items()))

        digitFirst = functools.reduce(lambda kv1, kv2: kv1 if kv1[1] < kv2[1] else kv2, digitPositionsLeft.items())
        digitLast = functools.reduce(lambda kv1, kv2: kv1 if kv1[1] > kv2[1] else kv2, digitPositionsRight.items())
        
        digitFirst = digitsDict[digitFirst[0]]
        digitLast = digitsDict[digitLast[0]]
        
        numsList.append( digitFirst * 10 + digitLast )

sum = functools.reduce(operator.add, numsList)
print(sum)
