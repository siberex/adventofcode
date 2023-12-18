package main

import (
	"bufio"
	"fmt"
	"log"
	"os"
	"strings"
)

func main() {
	// inputFilePath := "input.sample.txt"
	inputFilePath := "input.txt"

	inputFile, err := os.Open(inputFilePath)
	CheckErr(err)
	defer inputFile.Close()
	var times []int
	var distances []int

	scanner := bufio.NewScanner(inputFile)
	for scanner.Scan() {
		line := scanner.Text()
		if len(line) == 0 {
			continue
		}
		parts := strings.Split(line, ":")
		if len(parts) == 1 {
			log.Fatalf("Wrong input: %s", parts[0])
		}

		switch parts[0] {
		case "Time":
			times = Map(strings.Fields(parts[1]), Atoi)
		case "Distance":
			distances = Map(strings.Fields(parts[1]), Atoi)
		default:
			log.Fatalf("Wrong input: %s", parts[0])
		}
	}
	CheckErr(scanner.Err())

	// fmt.Println(times)
	// fmt.Println(distances)

	raceConditions := Zip(times, distances)
	raceWins := getRaceWins(raceConditions)
	// fmt.Println(raceWins)

	part1 := Reduce(raceWins, MultiplyNonZero, 1)
	fmt.Printf("Part1: %d\n", part1)
}

func getRaceWins(raceConditions []Pair[int, int]) []int {
	waysToWin := make([]int, len(raceConditions))
	for _, r := range raceConditions {
		wins := race(r.Time, r.Distance)
		waysToWin = append(waysToWin, wins)
		//fmt.Println(r, wins)
	}
	return waysToWin
}

func race(timeLimit int, distanceRecord int) int {
	wins := 0

	for tHold := 1; tHold < timeLimit; tHold++ {
		timeToMove := timeLimit - tHold
		acceleration := tHold

		distance := timeToMove * acceleration

		if distance > distanceRecord {
			wins++
		}
	}

	return wins
}
