const std = @import("std");

pub const collision_box = @import("sprites/data/collision_box.zig");
pub const frame = @import("sprites/data/frame.zig");
pub const sprite = @import("sprites/sprite.zig");
pub const single_sprite = @import("sprites/single_sprite.zig");
pub const multi_sprite = @import("sprites/multi_sprite.zig");
pub const file_io = @import("lib/file_io.zig");
pub const timer = @import("resources/timer.zig");
pub const asset_manager = @import("resources/asset_manager.zig");
pub const scene_layer = @import("scenes/scene_layers/scene_layer.zig");
pub const simple_scene_layer = @import("scenes/scene_layers/simple_scene_layer.zig");
pub const i_scene_layer = @import("scenes/scene_layers/i_scene_layer.zig");
pub const base_scene = @import("scenes/base_scene.zig");
pub const i_scene = @import("scenes/i_scene.zig");

test {
    std.testing.refAllDecls(collision_box);
    std.testing.refAllDecls(frame);
    std.testing.refAllDecls(sprite);
    std.testing.refAllDecls(single_sprite);
    std.testing.refAllDecls(multi_sprite);
    std.testing.refAllDecls(file_io);
    std.testing.refAllDecls(timer);
    std.testing.refAllDecls(asset_manager);
    std.testing.refAllDecls(scene_layer);
    std.testing.refAllDecls(simple_scene_layer);
    std.testing.refAllDecls(i_scene_layer);
    std.testing.refAllDecls(base_scene);
    std.testing.refAllDecls(i_scene);
}
