const std = @import("std");
const assert = std.debug.assert;
const print = std.debug.print;
const mem = std.mem;
const CircularBuffer = @import("circular_buffer.zig").CircularBuffer;

var gpa = std.heap.GeneralPurposeAllocator(.{}){};

pub fn fmtPanic(allocator: mem.Allocator, comptime fmt: []const u8, args: anytype) noreturn {
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

fn indexOf(needle: *Node, haystack: []*Node) ?usize {
    for (haystack, 0..) |current, i| {
        if (needle == current) {
            return i;
        }
    }
    return null;
}

fn indexOfStrSlice(needle: []const u8, haystack: [][]const u8) ?usize {
    for (haystack, 0..) |current, i| {
        if (mem.eql(u8, needle, current)) {
            return i;
        }
    }
    return null;
}

const ArrMap = std.ArrayHashMap([]const u8, *Node, std.array_hash_map.StringContext, false);

const Map = struct {
    allocator: mem.Allocator,
    map: ArrMap,
    tree: ?*Node,
    list: std.ArrayList([]const u8),

    pub fn init(allocator: mem.Allocator) Map {
        var map = ArrMap.init(allocator);

        // list of node names, preserving node adding order
        var list = std.ArrayList([]const u8).init(allocator);

        // var tree = Node{
        //     .left = null,
        //     .right = null,
        //     .text = undefined,
        // };

        return .{
            .allocator = allocator,
            .map = map,
            .tree = null,
            .list = list,
        };
    }

    pub fn deinit(self: Map) void {
        var map = self.map;

        var it = map.iterator();
        while (it.next()) |kv| {
            self.allocator.destroy(kv.value_ptr.*);
            self.allocator.free(kv.key_ptr.*);
        }

        map.deinit();
        self.list.deinit();
    }

    pub fn display(self: Map) void {
        for (self.map.values()) |node| {
            const text = node.text;
            const left = node.left;
            const right = node.right;
            print("{s} -> {s} | {s}\n", .{ text, left.?.text, right.?.text });
        }
    }

    // First create left and right nodes (if not exists), then create root and attach left and right to it
    pub fn addNode(self: *Map, rootStr: []const u8, leftStr: []const u8, rightStr: []const u8) !void {
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

        try self.list.append(rootStr);

        // Set tree root either to the first added node or to the last added node with the label "AAA"
        if (firstNode or mem.eql(u8, rootStr, "AAA")) {
            self.tree = root;
        }
    }

    pub fn stepsToFinish(self: *const Map, instructions: []const bool) void {
        var start = self.tree.?;
        const finish = self.map.get("ZZZ") orelse start;

        var count: u64 = self.walkFromNodeUntilNode(instructions, start, finish);

        print("Part1: {d}\n", .{count});
    }

    pub fn stepsToFinishAll(self: *const Map, instructions: []const bool) !void {
        var startNodes = std.ArrayList(*Node).init(self.allocator);
        defer startNodes.deinit();

        var endNodes = std.ArrayList(*Node).init(self.allocator);
        defer endNodes.deinit();

        // Find all nodes with labes ending in "..A" or "..Z"
        for (self.map.keys()) |key| {
            if (key.len != 3) continue;
            if (key[2] == 'A') try startNodes.append(self.map.get(key).?);
            if (key[2] == 'Z') try endNodes.append(self.map.get(key).?);
        }
        // for (startNodes.items) |s| print("→ {s}\n", .{s.text});
        // for (endNodes.items) |s| print("← {s}\n", .{s.text});

        const startNodesArr = try startNodes.toOwnedSlice();
        defer self.allocator.free(startNodesArr);

        const endNodesArr = try endNodes.toOwnedSlice();
        defer self.allocator.free(endNodesArr);

        var count: usize = 0;
        var countEnds: usize = 0;

        while (startNodesArr.len != countEnds) {
            for (instructions) |direction| {
                countEnds = 0;
                count += 1;
                for (startNodesArr, 0..) |n, i| {
                    var next = n;

                    switch (direction) {
                        false => next = next.left.?,
                        true => next = next.right.?,
                    }

                    if (indexOf(next, endNodesArr)) |_| {
                        countEnds += 1;
                    }

                    startNodesArr[i] = next;
                }
            }
        }

        print("Part2: {d}\n", .{count});
    }

    fn walkFromNodeUntilNode(self: *const Map, instructions: []const bool, fromNode: *Node, untilNode: *Node) usize {
        _ = self;

        var next = fromNode;
        var count: usize = 0;

        while (next != untilNode) {
            for (instructions) |direction| {
                count += 1;
                switch (direction) {
                    false => next = next.left.?,
                    true => next = next.right.?,
                }
            }
        }

        return count;
    }

    // fn walkSteps(self: *Map, instructions: []const u8, steps: usize) *Node {

    // }

    pub fn walk(self: *const Map, instructions: []const bool) *Node {
        var next = self.tree.?;

        for (instructions) |direction| {
            switch (direction) {
                false => next = next.left.?,
                true => next = next.right.?,
            }
        }

        return next;
    }
}; // Map

/// Converts instrictions string to array of booleans. L = false, R = true
/// Allocates slice of instructions.len, so `defer allocator.free(v);` is a must.
fn parseInstructions(allocator: mem.Allocator, instructions: []const u8) ![]const bool {
    const res = try allocator.alloc(bool, instructions.len);
    // errdefer allocator.free(res);

    for (instructions, 0..) |char, i| {
        switch (char) {
            'L' => res[i] = false,
            'R' => res[i] = true,
            // It is better to panic than to return error here: https://github.com/ziglang/zig/issues/2647
            // Also `zig run` will output useless `Segmentation fault at address 0x0` if error returned and not caught
            else => fmtPanic(allocator, "Unknown instruction '{c}' at index {d}: {s}", .{ char, i, instructions }),
        }
    }

    return res;
}

pub fn parseInput(allocator: mem.Allocator, file_path: []const u8) !struct { map: Map, instructions: []const bool } {
    const file = std.fs.cwd().openFile(file_path, .{ .mode = .read_only }) catch |err| switch (err) {
        error.FileNotFound, error.AccessDenied, error.BadPathName => fmtPanic(allocator, "Could not read file: {s}", .{file_path}),
        else => return err,
    };
    defer file.close();

    var lineIndex: u32 = 0;

    var instructions: []const bool = undefined;
    errdefer allocator.free(instructions);

    var map = Map.init(allocator);
    errdefer map.deinit();

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
            instructions = try parseInstructions(allocator, line);
            continue;
        }

        // "AAA = (BBB, CCC)" → "AAA", "(BBB, CCC)"
        var splitIt = std.mem.splitSequence(u8, line, " = ");
        const root = splitIt.first();
        var strBranches = splitIt.next() orelse "";
        if (strBranches.len == 0) {
            fmtPanic(allocator, "Wrong input on line {d}: {s}", .{ lineIndex, line });
        }

        // "(BBB, CCC)" → "BBB", "CCC"
        strBranches = mem.trimLeft(u8, strBranches, "(");
        strBranches = mem.trimRight(u8, strBranches, ")");
        splitIt = std.mem.splitSequence(u8, strBranches, ", ");
        const left = splitIt.first();
        const right = splitIt.next() orelse "";
        if (right.len == 0) {
            fmtPanic(allocator, "Wrong input on line {d}: {s}", .{ lineIndex, line });
        }

        try map.addNode(try allocator.dupe(u8, root), try allocator.dupe(u8, left), try allocator.dupe(u8, right));

        // print("{d}: {s} -> {s} | {s}\n", .{ lineIndex, root, left, right });
    }

    const SortingContext = struct {
        keys: [][]const u8,
        orderedKeys: [][]const u8,

        pub fn lessThan(ctx: @This(), a_index: usize, b_index: usize) bool {
            const a = ctx.keys[a_index];
            const b = ctx.keys[b_index];
            const a_order = indexOfStrSlice(a, ctx.orderedKeys) orelse 65535;
            const b_order = indexOfStrSlice(b, ctx.orderedKeys) orelse 65535;
            return a_order < b_order;
        }
    };

    map.map.sort(SortingContext{ .orderedKeys = map.list.items, .keys = map.map.keys() });

    return .{ .map = map, .instructions = instructions };
}

pub fn main() !void {
    const allocator = gpa.allocator();

    var args = std.process.args();
    _ = args.skip();

    const file_path = args.next() orelse "input.txt";

    print("Input file: {s}\n", .{file_path});

    const result = try parseInput(allocator, file_path);

    const map = result.map;
    const instructions = result.instructions;
    defer map.deinit();
    defer allocator.free(instructions);

    // map.display();

    // Small test for walk():
    // const nodeGot = map.walk("LR");
    // const nodeExpected = map.tree.?.left.?.right.?;
    // assert(nodeGot == nodeExpected);

    // Part1
    map.stepsToFinish(instructions);

    // Part2
    try map.stepsToFinishAll(instructions);
}
