const std = @import("std");
const assert = std.debug.assert;
const print = std.debug.print;
const mem = std.mem;
const CircularBuffer = @import("circular_buffer.zig").CircularBuffer;

var gpa = std.heap.GeneralPurposeAllocator(.{}){};
const allocator = gpa.allocator();

pub fn fmtPanic(comptime fmt: []const u8, args: anytype) noreturn {
    const errMessage = std.fmt.allocPrint(
        allocator,
        fmt,
        args,
    ) catch fmt;
    defer allocator.free(errMessage);
    @panic(errMessage);
}

const Node = struct {
    left: ?*Node,
    right: ?*Node,
    text: []const u8,
};

const Map = struct {
    allocator: mem.Allocator,
    map: std.StringHashMap(*Node),
    tree: ?*Node,
    // startNodes: []*Node,
    // endNodes: []*Node,

    fn init(memAllocator: mem.Allocator) Map {
        var map = std.StringHashMap(*Node).init(memAllocator);

        // var tree = Node{
        //     .left = null,
        //     .right = null,
        //     .text = undefined,
        // };

        return .{
            .allocator = memAllocator,
            .map = map,
            .tree = null,
        };
    }

    fn deinit(self: Map) void {
        // const memAllocator = self.allocator;
        var map = self.map;

        var it = map.valueIterator();
        while (it.next()) |nodePtr| {
            self.allocator.destroy(nodePtr.*);
        }

        map.deinit();
    }

    fn display(self: Map) void {
        var it = self.map.valueIterator();

        while (it.next()) |nodePtr| {
            const node = nodePtr.*;
            const text = node.text;
            const left = node.left;
            const right = node.right;
            print("{s} -> {s} | {s}\n", .{ text, left.?.text, right.?.text });
        }
    }

    // First create left and right nodes (if not exists), then create root and attach left and right to it
    fn addNode(self: *Map, rootStr: []const u8, leftStr: []const u8, rightStr: []const u8) !void {
        const firstNode = self.map.count() == 0;

        var left = self.map.get(leftStr);
        if (left) |v| {
            // dummy assertion
            assert(mem.eql(u8, v.text, leftStr));
        } else {
            left = try self.allocator.create(Node); // *Node
            left.?.text = leftStr;

            try self.map.put(leftStr, left.?);
        }

        var right = self.map.get(rightStr);
        if (right) |v| {
            // dummy assertion
            assert(mem.eql(u8, v.text, rightStr));
        } else {
            right = try self.allocator.create(Node); // *Node
            right.?.text = rightStr;

            try self.map.put(rightStr, right.?);
        }

        var root = self.map.get(rootStr);
        if (root) |v| {
            // dummy assertion
            assert(mem.eql(u8, v.text, rootStr));
        } else {
            root = try self.allocator.create(Node); // *Node
            root.?.text = rootStr;

            try self.map.put(rootStr, root.?);
        }

        root.?.left = left;
        root.?.right = right;

        // Set tree root either to the first added node or to the last added node with the label "AAA"
        if (firstNode or mem.eql(u8, rootStr, "AAA")) {
            self.tree = root;
        }
    }

    fn stepsToFinish(self: *Map, instructions: []const u8) void {
        var next = self.tree.?;
        const finish = self.map.get("ZZZ") orelse next;

        var count: u64 = 0;

        while (next != finish) {
            for (instructions) |char| {
                count += 1;
                switch (char) {
                    'L' => next = next.left.?,
                    'R' => next = next.right.?,
                    else => fmtPanic("Unknown instruction '{c}': {s}", .{ char, instructions }),
                }
            }
        }

        print("Total steps: {d}\n", .{count});
    }

    fn stepsToFinishAll(self: *Map, instructions: []const u8) void {
        _ = instructions;
        _ = self;
    }

    fn walk(self: *Map, instructions: []const u8) *Node {
        // FIXME: Do I need to check for self-references?
        var next = self.tree.?;

        for (instructions) |char| {
            switch (char) {
                'L' => {
                    next = next.left.?;
                    // print("{s}", .{"←"});
                },
                'R' => {
                    next = next.right.?;
                    // print("{s}", .{"→"});
                },
                else => fmtPanic("Unknown instruction '{c}': {s}", .{ char, instructions }),
            }
        }
        // print("\n", .{});

        return next;
    }
}; // Map

pub fn parseInput(file_path: []const u8) !void {
    const file = std.fs.cwd().openFile(file_path, .{ .mode = .read_only }) catch |err| switch (err) {
        error.FileNotFound, error.AccessDenied, error.BadPathName => fmtPanic("Could not read file: {s}", .{file_path}),
        else => return err,
    };
    defer file.close();

    var lineIndex: u32 = 0;
    var instructions: []const u8 = "";

    var map = Map.init(allocator);
    defer map.deinit();

    var buf_reader = std.io.bufferedReader(file.reader());
    var in_stream = buf_reader.reader();
    var buf: [1024]u8 = undefined;
    while (try in_stream.readUntilDelimiterOrEof(&buf, '\n')) |rawLine| {
        lineIndex += 1;

        const line = mem.trim(u8, rawLine, " ");
        if (line.len == 0) {
            continue;
        }

        if (lineIndex == 1) {
            instructions = try allocator.dupe(u8, line);
            continue;
        }

        // "AAA = (BBB, CCC)" → "AAA", "(BBB, CCC)"
        var splitIt = std.mem.splitSequence(u8, line, " = ");
        const root = splitIt.first();
        var strBranches = splitIt.next() orelse "";
        if (strBranches.len == 0) {
            fmtPanic("Wrong input on line {d}: {s}", .{ lineIndex, line });
        }

        // "(BBB, CCC)" → "BBB", "CCC"
        strBranches = mem.trimLeft(u8, strBranches, "(");
        strBranches = mem.trimRight(u8, strBranches, ")");
        splitIt = std.mem.splitSequence(u8, strBranches, ", ");
        const left = splitIt.first();
        const right = splitIt.next() orelse "";
        if (right.len == 0) {
            fmtPanic("Wrong input on line {d}: {s}", .{ lineIndex, line });
        }

        try map.addNode(try allocator.dupe(u8, root), try allocator.dupe(u8, left), try allocator.dupe(u8, right));

        // print("{d}: {s} -> {s} | {s}\n", .{ lineIndex, root, left, right });
    }
    // map.display();

    // Small test for walk():
    // const nodeGot = map.walk("LR");
    // const nodeExpected = map.tree.?.left.?.right.?;
    // assert(nodeGot == nodeExpected);

    // Part1
    map.stepsToFinish(instructions);

    // Part2...

    return;
}

pub fn main() !void {
    var args = std.process.args();
    _ = args.skip();

    const file_path = args.next() orelse "input.txt";

    print("Input file: {s}\n", .{file_path});

    var result = try parseInput(file_path);
    _ = result;
}
