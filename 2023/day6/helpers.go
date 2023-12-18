package main

import (
	"log"
	"strconv"
)

type Pair[T, U any] struct {
	Time     T
	Distance U
}

func Zip[T, U any](ts []T, us []U) []Pair[T, U] {
	if len(ts) != len(us) {
		panic("slices have different length")
	}
	pairs := make([]Pair[T, U], len(ts))
	for i := 0; i < len(ts); i++ {
		pairs[i] = Pair[T, U]{ts[i], us[i]}
	}
	return pairs
}

func Map[T, U any](input []T, f func(T) U) []U {
	res := make([]U, len(input))
	for i := range input {
		res[i] = f(input[i])
	}
	return res
}

func Reduce[T, U any](input []T, f func(U, T) U, initial U) U {
	res := initial
	for i := range input {
		res = f(res, input[i])
	}
	return res
}

func Atoi(s string) int {
	res, _ := strconv.Atoi(s)
	return res
}

func CheckErr(e error) {
	if e != nil {
		log.Fatal(e)
	}
}

func MultiplyNonZero(a int, b int) int {
	if a == 0 {
		return b
	}
	if b == 0 {
		return a
	}
	return a * b
}
