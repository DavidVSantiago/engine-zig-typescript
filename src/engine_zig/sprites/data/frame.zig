const std = @import("std"); // importa a biblioteca padrão
const CollisionBox = @import("collision_box.zig").CollisionBox;

/// Estrutura que representa um único quadro de um sprite
pub const Frame = struct {
    cut_x: i32,
    cut_y: i32,
    collision_box_list: []const CollisionBox,

    /// construtor
    pub inline fn init(cut_x: i32, cut_y: i32, collision_box_list: []const CollisionBox) Frame {
        return .{
            .cut_x = cut_x << 8,
            .cut_y = cut_y << 8,
            .collision_box_list = collision_box_list,
        };
    }
};

// ============================================================================
// TESTES UNITÁRIOS
// ============================================================================
test "Frame.init conversao 8.8 sem caixas de colisao" {
    const frame = Frame.init(32, 64, &.{});
    try std.testing.expectEqual(@as(i32, 32 << 8), frame.cut_x);
    try std.testing.expectEqual(@as(i32, 64 << 8), frame.cut_y);
    try std.testing.expectEqual(@as(usize, 0), frame.collision_box_list.len);
}
test "Frame.init com caixas de colisao" {
    const boxes = [_]CollisionBox{
        CollisionBox.init(0, 0, 16, 16),
        CollisionBox.init(4, 4, 8, 8),
    };
    const frame = Frame.init(0, 0, &boxes);
    try std.testing.expectEqual(@as(usize, 2), frame.collision_box_list.len);
    try std.testing.expectEqual(@as(i32, 16 << 8), frame.collision_box_list[0].w);
    try std.testing.expectEqual(@as(i32, 8 << 8), frame.collision_box_list[1].h);
}
