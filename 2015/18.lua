local g = golly()

numsteps = 100

-- g.autoupdate(true)

g.open("18.rle")

g.run(100)
g.note("Part 1, lights count: " .. g.getpop())

-- Part 2
g.reset()

function lightCorners()
	g.setcell(-50, -50, 1)
	g.setcell(49, -50, 1)
	g.setcell(49, 49, 1)
	g.setcell(-50, 49, 1)
end

for i = 1,numsteps,1 
do
	lightCorners()
	g.step()
end
lightCorners()

g.note("Part 2, lights count: " .. g.getpop())
