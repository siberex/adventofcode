package main

import (
	"bufio"
	"fmt"
	"log"
	"os"
	"strings"
)

func main() {
	inputFile, err := os.Open("input.sample.txt")
	// file, err := os.Open("input.txt")
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

	input := Zip(times, distances)
	fmt.Println(input)
}

func race(raceConditions []Pair[int, int]) {

}
