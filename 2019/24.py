# Script for Golly — http://golly.sourceforge.net/

# Provide Python lib (from brew, etc):
# /Library/Frameworks/Python.framework/Versions/3.9/Python → /usr/local/Cellar/python@3.9/3.9.6/Frameworks/Python.framework/Versions/Current/Python

# sudo mkdir -p /Library/Frameworks/Python.framework/Versions/3.9/
# sudo ln -s "/usr/local/Cellar/python@3.9/3.9.6/Frameworks/Python.framework/Versions/Current/Python" "/Library/Frameworks/Python.framework/Versions/3.9/Python"

# Run with Golly:
# ~/Applications/golly-4.0.1-mac/Golly.app/Contents/MacOS/Golly 2019/24.py

import golly as g

g.open("24.rle")
hashRect = g.getrect()
dx, dy, w, h = hashRect

steps = set()
stepHash = g.hash( hashRect )

print("Searching for repeating pattern...")

while not stepHash in steps:
    #print(stepHash)
    steps.add(stepHash)
    g.step()
    stepHash = g.hash( hashRect )

print("Found repetition at generation:", g.getgen())

cells = g.getcells( hashRect )

sumId = 0
# Coords of all alive cells (0-based X and Y)
# Clustering a flat data series into n-length groups:
# https://docs.python.org/3/library/functions.html#zip
for x, y in zip(*[iter(cells)]*2):
    # 0-base from center-based coords: [-2, 1] → [0, 3], [-1, 2] → [1, 4]
    x = x - dx
    y = y - dy

    # coords to sequence: [0, 3] → 15th tile, [1, 4] → 21nd tile (0-based)
    pos = y * w + x
    print(x, y, pos)

    sumId += 2 ** pos

print("RESULT:", sumId)