// #![allow(dead_code)]
// #![allow(unused_variables)]
// #![allow(unused_mut)]

use once_cell::sync::Lazy;
use regex_lite::Regex;
use std::collections::HashSet;
use std::env;
use std::fs;

#[derive(Debug)]
enum Item {
    Dot,
    NumberReference(usize),
    Symbol(bool), // true if '*' (aka possible gear)
}

#[derive(Debug, Copy, Clone)]
struct Number {
    val: u16,
    row: usize,
    col: usize,
    len: usize,
}


// Return all matched numbers from provided line
fn match_numbers(line: &str, row: usize) -> Vec<Number> {
    static RE_NUMBERS: Lazy<Regex> = Lazy::new(|| Regex::new(r"(?-u:\d+)").unwrap());

    return RE_NUMBERS.find_iter(line).map(|mat| Number {
        val: mat.as_str().parse::<u16>().unwrap_or(0),
        row: row,
        col: mat.start(),
        len: mat.len(),
    }).collect();
}


fn filter_part_numbers(numbers: &[Number], schematic: &[Vec<Item>]) -> Vec<Number> {
    let rows_count = schematic.len() as isize;
    let cols_count = schematic.get(0).unwrap_or(&Vec::<Item>::new()).len() as isize;

    return numbers.into_iter().copied()
        .filter(|num: &Number| -> bool {
            let row = num.row as isize;
            let col = num.col as isize;
            let pos_after = col + num.len as isize;
        
            for i in (row - 1) ..= (row + 1) {
                for j in (col - 1) ..= pos_after {
                    if i < 0 || j < 0 {
                        continue; // out of bounds
                    }
                    if (i == row) && (j >= col) && j < pos_after {
                        continue; // digits
                    }
                    if i >= rows_count || j >= cols_count {
                        continue; // out of bounds
                    }
        
                    match schematic[i as usize][j as usize] {
                        Item::Symbol(_) => return true,
                        _ => continue,
                    }
                }
            }

            return false;
        })
        .collect();
}


fn get_gear_ratios(numbers: &[Number], schematic: &[Vec<Item>], row: usize, col: usize) -> Option<(u16, u16)> {
    let rows_count = schematic.len() as isize;
    let cols_count = schematic.get(0).unwrap_or(&Vec::<Item>::new()).len() as isize;

    static UNKNOWN_NUMBER: Number = Number{
        val: 0,
        row: 0,
        col: 0,
        len: 0,
    };

    let mut num_indicies: HashSet<usize> = HashSet::new();

    // Look for numbers around [row, col]
    for i in (row - 1) as isize ..= (row + 1) as isize {
        for j in (col - 1) as isize ..= (col + 1) as isize {
            if i < 0 || j < 0 {
                continue; // out of bounds
            }
            if i == row as isize && j == col as isize {
                continue; // '*' symbol position
            }
            if i >= rows_count || j >= cols_count {
                continue; // out of bounds
            }

            match schematic[i as usize][j as usize] {
                Item::NumberReference(index) => {
                    num_indicies.insert(index);
                },
                _ => continue,
            }
        }
    }

    // Exactly two numbers surround gear at [row, col]
    if num_indicies.len() == 2 {
        let nums:Vec<_> = num_indicies.drain()
            .map(|index| numbers.get(index).unwrap_or(&UNKNOWN_NUMBER))
            .map(|n| n.val)
            .collect();

        let cogs: (u16, u16) = (nums[0], nums[1]);
        // println!("{}: {} * {}", row, cogs.0, cogs.1);
        return Some(cogs);
    }

    return None;
}


fn calculate_gear_ratios(numbers: &[Number], schematic: &[Vec<Item>]) -> usize {
    let rows_count = schematic.len();
    let cols_count = schematic.get(0).unwrap_or(&Vec::<Item>::new()).len();

    let mut accumulator: usize = 0;

    for i in 0 .. rows_count {
        for j in 0 .. cols_count {

            match schematic[i][j] {
                Item::Symbol(true) => {
                    // Check numbers around gear symbol '*' to find gear pairs
                    match get_gear_ratios(numbers, schematic, i, j) {
                        Some(gears) => accumulator = accumulator + gears.0 as usize * gears.1 as usize,
                        None => (),
                    }
                },
                _ => continue,
            }
        }
    }

    return accumulator;
}


fn main() {
    let args: Vec<String> = env::args().collect();
    // let default_file_input_path = &String::from("input.sample.txt");
    let default_file_input_path = &String::from("input.txt");
    let input_file_path: &String = args.get(1).unwrap_or(default_file_input_path);

    println!("Input file: {}", input_file_path);

    let contents = fs::read_to_string(input_file_path)
        .expect("Should have been able to read the file");

    let mut schematic: Vec<Vec<Item>> = Vec::new();
    let mut numbers: Vec<Number> = Vec::new();

    for (row, line) in contents.lines().enumerate() {
        if line.trim().len() == 0 {
            continue;
        }
        // println!("{}: {}", row, line);

        let mut nums_matched = match_numbers(line, row);

        let mut schematic_line: Vec<Item> = Vec::new();

        for (col, c) in line.chars().enumerate() {
            match c {
                '.' => schematic_line.push(Item::Dot),
                '0'..='9' => {
                    let number_index = nums_matched.iter().position(|num| {
                        return (col >= num.col) && (col <= num.col + num.len)
                    });
                    match number_index {
                        Some(index) => schematic_line.push(
                            Item::NumberReference( numbers.len() + index )
                        ),
                        None => panic!("Could not match number for [{}, {}] schematic position", row, col),
                    }
                },
                '&' | '+' | '-' | '*' | '@' | '#'  | '$' | '%' | '/' | '=' => schematic_line.push(Item::Symbol(c == '*')),
                _ => panic!("Wrong input: {}", c),
            }
        }

        numbers.append(&mut nums_matched);
        drop(nums_matched);

        schematic.push(schematic_line);
    }

    let part_numbers = filter_part_numbers(&numbers, &schematic);

    // let part_numbers_list: Vec<u16> = part_numbers.iter().map(|n| {n.val}).collect();
    // println!("{:?}", part_numbers_list);

    let total: usize = part_numbers.iter().map(|n| {n.val as usize}).sum();
    println!("Part1: {}", total);

    let ratios = calculate_gear_ratios(&numbers, &schematic);
    println!("Part2: {}", ratios);

}
