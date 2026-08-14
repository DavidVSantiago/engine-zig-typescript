const std = @import("std");
const CollisionBox = @import("data/collision_box.zig").CollisionBox;
const Frame = @import("data/frame.zig").Frame;
const Sprite = @import("sprite.zig").Sprite;

/// Sprite estático com múltiplos quadros
pub const MultiSprite = struct {
    base: Sprite,
    frame_list: []const Frame,
    current_frame: usize,

    /// construtor
    pub inline fn init(
        image: ?*const anyopaque,
        pos_x: i32,
        pos_y: i32,
        speed_x: i32,
        speed_y: i32,
        width: i32,
        height: i32,
        draw_width: i32,
        draw_height: i32,
        frame_list: []const Frame,
    ) MultiSprite {
        return .{
            .base = Sprite.init(image, pos_x, pos_y, speed_x, speed_y, width, height, draw_width, draw_height),
            .frame_list = frame_list,
            .current_frame = 0,
        };
    }

    // ========================================================================
    // GETTERS & SETTERS (INLINE)
    // ========================================================================

    pub inline fn getPosX(self: MultiSprite) i32 {
        return self.base.pos_x;
    }
    pub inline fn getPosY(self: MultiSprite) i32 {
        return self.base.pos_y;
    }
    pub inline fn getSpeedX(self: MultiSprite) i32 {
        return self.base.speed_x;
    }
    pub inline fn getSpeedY(self: MultiSprite) i32 {
        return self.base.speed_y;
    }
    pub inline fn getSpeedBase(self: MultiSprite) i32 {
        return self.base.speed_base;
    }
    pub inline fn getWidth(self: MultiSprite) i32 {
        return self.base.width;
    }
    pub inline fn getHeight(self: MultiSprite) i32 {
        return self.base.height;
    }
    pub inline fn getDrawWidth(self: MultiSprite) i32 {
        return self.base.draw_width;
    }
    pub inline fn getDrawHeight(self: MultiSprite) i32 {
        return self.base.draw_height;
    }
    pub inline fn getCutX(self: MultiSprite) i32 {
        return self.frame_list[self.current_frame].cut_x;
    }
    pub inline fn getCutY(self: MultiSprite) i32 {
        return self.frame_list[self.current_frame].cut_y;
    }
    pub inline fn getCollisionBoxList(self: MultiSprite) []const CollisionBox {
        return self.frame_list[self.current_frame].collision_box_list;
    }

    pub inline fn setPosX(self: *MultiSprite, pos_x: i32) void {
        self.base.pos_x = pos_x;
    }
    pub inline fn setPosY(self: *MultiSprite, pos_y: i32) void {
        self.base.pos_y = pos_y;
    }
    pub inline fn setSpeedX(self: *MultiSprite, speed_x: i32) void {
        self.base.speed_x = speed_x;
    }
    pub inline fn setSpeedY(self: *MultiSprite, speed_y: i32) void {
        self.base.speed_y = speed_y;
    }
    pub inline fn setSpeedBase(self: *MultiSprite, speed_base: i32) void {
        self.base.speed_base = speed_base;
    }
    pub inline fn setWidth(self: *MultiSprite, width: i32) void {
        self.base.width = width;
    }
    pub inline fn setHeight(self: *MultiSprite, height: i32) void {
        self.base.height = height;
    }
    pub inline fn setDrawWidth(self: *MultiSprite, draw_width: i32) void {
        self.base.draw_width = draw_width;
    }
    pub inline fn setDrawHeight(self: *MultiSprite, draw_height: i32) void {
        self.base.draw_height = draw_height;
    }

    // ========================================================================
    // MÉTODOS DE MOVIMENTAÇÃO
    // ========================================================================

    pub inline fn moveX(self: *MultiSprite) void {
        self.base.moveX();
    }

    pub inline fn moveY(self: *MultiSprite) void {
        self.base.moveY();
    }
};

// ============================================================================
// TESTES UNITÁRIOS
// ============================================================================

test "MultiSprite.init getters/setters e metodos" {
    const boxes = [_]CollisionBox{
        CollisionBox.init(0, 0, 16, 16),
    };
    const frames = [_]Frame{
        Frame.init(0, 0, &boxes),
        Frame.init(32, 0, &.{}),
        Frame.init(64, 0, &.{}),
    };

    var multi = MultiSprite.init(null, 10, 20, 1, 2, 32, 32, 64, 64, &frames);

    // Valida getters
    try std.testing.expectEqual(@as(i32, 10 << 8), multi.getPosX());
    try std.testing.expectEqual(@as(i32, 20 << 8), multi.getPosY());
    try std.testing.expectEqual(@as(i32, 1 << 8), multi.getSpeedX());
    try std.testing.expectEqual(@as(i32, 2 << 8), multi.getSpeedY());
    try std.testing.expectEqual(@as(i32, 256), multi.getSpeedBase());
    try std.testing.expectEqual(@as(i32, 32 << 8), multi.getWidth());
    try std.testing.expectEqual(@as(i32, 32 << 8), multi.getHeight());
    try std.testing.expectEqual(@as(i32, 64 << 8), multi.getDrawWidth());
    try std.testing.expectEqual(@as(i32, 64 << 8), multi.getDrawHeight());
    try std.testing.expectEqual(@as(usize, 3), multi.frame_list.len);
    try std.testing.expectEqual(@as(usize, 0), multi.current_frame);
    try std.testing.expectEqual(@as(i32, 0), multi.getCutX());
    try std.testing.expectEqual(@as(usize, 1), multi.getCollisionBoxList().len);

    // Valida setters
    multi.setPosX(490 << 8);
    try std.testing.expectEqual(@as(i32, 490 << 8), multi.getPosX());
    multi.setSpeedBase(3 << 8);
    try std.testing.expectEqual(@as(i32, 3 << 8), multi.getSpeedBase());

    // Muda de frame e valida
    multi.current_frame = 1;
    try std.testing.expectEqual(@as(i32, 32 << 8), multi.getCutX());
    try std.testing.expectEqual(@as(usize, 0), multi.getCollisionBoxList().len);

    // Valida movimentacao delegada
    multi.moveX();
    try std.testing.expectEqual(@as(i32, (490 << 8) + (1 << 8)), multi.getPosX());
}
