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

while not stepHash in steps:
    #print(stepHash)
    steps.add(stepHash)
    g.step()
    stepHash = g.hash( hashRect )

cells = g.getcells( hashRect )

for x, y in zip(*[iter(cells)]*2):
    print(x - dx, y - dy)
