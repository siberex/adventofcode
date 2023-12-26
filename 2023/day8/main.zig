const std = @import("std");
const mem = @import("std").mem;

const print = std.debug.print;
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

pub fn parseInput(file_path: []const u8) !void {
    const file = std.fs.cwd().openFile(file_path, .{ .mode = .read_only }) catch |err| switch (err) {
        error.FileNotFound, error.AccessDenied, error.BadPathName => fmtPanic("Could not read file: {s}", .{file_path}),
        else => return err,
    };
    defer file.close();

    var lineIndex: u32 = 0;
    var instructions: []const u8 = "";
    var tree = Node{
        .left = null,
        .right = null,
        .text = undefined,
    };
    var map = std.StringHashMap(*Node).init(allocator);

    _ = map;
    _ = tree;

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
            instructions = line;
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

        var splitBrIt = std.mem.splitSequence(u8, strBranches, ", ");
        const left = splitBrIt.first();
        const right = splitBrIt.next() orelse "";
        if (right.len == 0) {
            fmtPanic("Wrong input on line {d}: {s}", .{ lineIndex, line });
        }

        print("{d}: {s} -> {s} | {s}\n", .{ lineIndex, root, left, right });
    }

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
