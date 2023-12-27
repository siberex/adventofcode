const std = @import("std");
const Allocator = std.mem.Allocator;

pub fn CircularBuffer(
    comptime V: type,
) type {
    return struct {
        allocator: Allocator,

        const Self = @This();

        pub fn fromList(list: []V) Self {
            _ = list;
        }

        pub fn next() V {}

        // Dummy init
        pub fn init(allocator: Allocator) Self {
            return .{
                .allocator = allocator,
            };
        }

        // Dummy deinit
        pub fn deinit(self: *Self) void {
            self.deallocate(self.allocator);
            self.* = undefined;
        }
    };
}
