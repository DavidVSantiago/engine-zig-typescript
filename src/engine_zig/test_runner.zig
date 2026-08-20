const std = @import("std");

pub const collision_box = @import("sprites/data/collision_box.zig");
pub const frame = @import("sprites/data/frame.zig");
pub const sprite = @import("sprites/sprite.zig");
pub const single_sprite = @import("sprites/single_sprite.zig");
pub const multi_sprite = @import("sprites/multi_sprite.zig");
pub const file_io = @import("lib/file_io.zig");
pub const timer = @import("lib/timer.zig");
pub const asset_manager = @import("resources/asset_manager.zig");

test {
    std.testing.refAllDecls(collision_box);
    std.testing.refAllDecls(frame);
    std.testing.refAllDecls(sprite);
    std.testing.refAllDecls(single_sprite);
    std.testing.refAllDecls(multi_sprite);
    std.testing.refAllDecls(file_io);
    std.testing.refAllDecls(timer);
    std.testing.refAllDecls(asset_manager);
}
