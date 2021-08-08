import numpy as np
from scipy.optimize import minimize

import re

inputFile = "input2.txt"

matchRe = re.compile(r'^(?P<name>\w+): '
                     r'capacity (?P<capacity>-?\d+), '
                     r'durability (?P<durability>-?\d+), '
                     r'flavor (?P<flavor>-?\d+), '
                     r'texture (?P<texture>-?\d+), '
                     r'calories (?P<calories>-?\d+)$')


def list_props(str_line: str) -> list:
    m = matchRe.match(str_line)
    return list(map(int, m.groups()[1::]))


with open(inputFile) as f:
    components = list(map(list_props, f))

print(components)

# strip calories
important_components = np.delete(components, 4, 1)
print(important_components)


def calc_score(weights: list) -> int:
    components = important_components
    properties = np.matmul(np.transpose(components), weights)
    return np.prod(properties)


total_score = calc_score([44, 56])
print(total_score)
