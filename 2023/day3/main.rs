use std::env;
use std::fs;

#[derive(Debug)]
enum Item {
    Dot,
    Digit(u8),
    Symbol
}

fn main() {
    let args: Vec<String> = env::args().collect();
    let default_file_input_path = &String::from("input.sample.txt");
    let input_file_path: &String = args.get(1).unwrap_or(default_file_input_path);

    println!("Input file: {}", input_file_path);

    let contents = fs::read_to_string(input_file_path)
        .expect("Should have been able to read the file");

    let mut schematic: Vec<Vec<Item>> = Vec::new();

    for (_i, line) in contents.lines().enumerate() {
        // println!("{}: {}", _i, line);

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

    // println!("{:?}", schematic);

    for l in schematic {
        for c in l {
            // ... do stuff
        }
    }



    


}
