// #![allow(dead_code)]
// #![allow(unused_variables)]

use once_cell::sync::Lazy;
use regex_lite::Regex;
use std::env;
use std::fs;

#[derive(Debug)]
enum Item {
    Dot,
    Digit(u8),
    Symbol,
}

#[derive(Debug)]
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
        val: mat.as_str().parse::<u16>().unwrap(),
        row: row,
        col: mat.start(),
        len: mat.len(),
    }).collect();
}


fn filter_part_numbers(numbers: Vec<Number>, schematic: Vec<Vec<Item>>) -> Vec<Number> {
    let rows_count = schematic.len();
    let cols_count = schematic.get(0).unwrap_or(&Vec::<Item>::new()).len();

    return numbers.into_iter()
        .filter(|num: &Number| -> bool {
        
            for i in (num.row as isize - 1) ..= (num.row as isize + 1) {
                for j in (num.col as isize - 1) ..= (num.col + num.len) as isize {
                    if i < 0 || j < 0 {
                        continue;
                    }
                    if (i == num.row as isize) && (j >= num.col as isize) && j < (num.col + num.len) as isize {
                        continue;
                    }
                    if i >= rows_count as isize || j >= cols_count as isize {
                        continue;
                    }
        
                    match schematic[i as usize][j as usize] {
                        Item::Symbol => return true,
                        _ => continue,
                    }
                }
            }

            return false;
        })
        .collect();
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
        // println!("{}: {}", row, line);

        numbers.append(&mut match_numbers(line, row));

        let mut schematic_line: Vec<Item> = Vec::new();

        for c in line.chars() {
            match c {
                '.' => schematic_line.push(Item::Dot),
                '0'..='9' => schematic_line.push(
                    Item::Digit( c.to_digit(10).unwrap() as u8 )
                ),
                '&' | '+' | '-' | '*' | '@' | '#'  | '$' | '%' | '/' | '=' => schematic_line.push(Item::Symbol),
                _ => panic!("Wrong input: {}", c),
            }
        }

        schematic.push(schematic_line);
    }

    let part_numbers = filter_part_numbers(numbers, schematic);

    // let part_numbers_list: Vec<u16> = part_numbers.into_iter().map(|n| {n.val}).collect();
    // println!("{:?}", part_numbers_list);

    let total: usize = part_numbers.into_iter().map(|n| {n.val as usize}).sum();

    println!("Part1: {}", total);
}
