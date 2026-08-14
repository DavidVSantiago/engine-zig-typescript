const std = @import("std");
const Frame = @import("data/frame.zig").Frame;
const Sprite = @import("sprite.zig").Sprite;

/// Sprite estático com um único quadro
pub const SingleSprite = struct {
    base: Sprite,
    frame: Frame,

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
        frame: Frame,
    ) SingleSprite {
        return .{
            .base = Sprite.init(image, pos_x, pos_y, speed_x, speed_y, width, height, draw_width, draw_height),
            .frame = frame,
        };
    }

    // ========================================================================
    // GETTERS & SETTERS (INLINE)
    // ========================================================================

    pub inline fn getPosX(self: SingleSprite) i32 {
        return self.base.pos_x;
    }
    pub inline fn getPosY(self: SingleSprite) i32 {
        return self.base.pos_y;
    }
    pub inline fn getSpeedX(self: SingleSprite) i32 {
        return self.base.speed_x;
    }
    pub inline fn getSpeedY(self: SingleSprite) i32 {
        return self.base.speed_y;
    }
    pub inline fn getSpeedBase(self: SingleSprite) i32 {
        return self.base.speed_base;
    }
    pub inline fn getWidth(self: SingleSprite) i32 {
        return self.base.width;
    }
    pub inline fn getHeight(self: SingleSprite) i32 {
        return self.base.height;
    }
    pub inline fn getDrawWidth(self: SingleSprite) i32 {
        return self.base.draw_width;
    }
    pub inline fn getDrawHeight(self: SingleSprite) i32 {
        return self.base.draw_height;
    }
    pub inline fn getCutX(self: SingleSprite) i32 {
        return self.frame.cut_x;
    }
    pub inline fn getCutY(self: SingleSprite) i32 {
        return self.frame.cut_y;
    }

    pub inline fn setPosX(self: *SingleSprite, pos_x: i32) void {
        self.base.pos_x = pos_x;
    }
    pub inline fn setPosY(self: *SingleSprite, pos_y: i32) void {
        self.base.pos_y = pos_y;
    }
    pub inline fn setSpeedX(self: *SingleSprite, speed_x: i32) void {
        self.base.speed_x = speed_x;
    }
    pub inline fn setSpeedY(self: *SingleSprite, speed_y: i32) void {
        self.base.speed_y = speed_y;
    }
    pub inline fn setSpeedBase(self: *SingleSprite, speed_base: i32) void {
        self.base.speed_base = speed_base;
    }
    pub inline fn setWidth(self: *SingleSprite, width: i32) void {
        self.base.width = width;
    }
    pub inline fn setHeight(self: *SingleSprite, height: i32) void {
        self.base.height = height;
    }
    pub inline fn setDrawWidth(self: *SingleSprite, draw_width: i32) void {
        self.base.draw_width = draw_width;
    }
    pub inline fn setDrawHeight(self: *SingleSprite, draw_height: i32) void {
        self.base.draw_height = draw_height;
    }
    pub inline fn setCutX(self: *SingleSprite, cut_x: i32) void {
        self.frame.cut_x = cut_x;
    }
    pub inline fn setCutY(self: *SingleSprite, cut_y: i32) void {
        self.frame.cut_y = cut_y;
    }

    // ========================================================================
    // MÉTODOS DE MOVIMENTAÇÃO
    // ========================================================================

    pub inline fn moveX(self: *SingleSprite) void {
        self.base.moveX();
    }

    pub inline fn moveY(self: *SingleSprite) void {
        self.base.moveY();
    }
};

// ============================================================================
// TESTES UNITÁRIOS
// ============================================================================

test "SingleSprite.init e getters/setters" {
    const frame = Frame.init(10, 20, &.{});
    var single = SingleSprite.init(null, 1, 2, 3, 4, 16, 16, 32, 32, frame);

    // Valida getters
    try std.testing.expectEqual(@as(i32, 1 << 8), single.getPosX());
    try std.testing.expectEqual(@as(i32, 2 << 8), single.getPosY());
    try std.testing.expectEqual(@as(i32, 3 << 8), single.getSpeedX());
    try std.testing.expectEqual(@as(i32, 4 << 8), single.getSpeedY());
    try std.testing.expectEqual(@as(i32, 256), single.getSpeedBase());
    try std.testing.expectEqual(@as(i32, 16 << 8), single.getWidth());
    try std.testing.expectEqual(@as(i32, 16 << 8), single.getHeight());
    try std.testing.expectEqual(@as(i32, 32 << 8), single.getDrawWidth());
    try std.testing.expectEqual(@as(i32, 32 << 8), single.getDrawHeight());
    try std.testing.expectEqual(@as(i32, 10 << 8), single.getCutX());
    try std.testing.expectEqual(@as(i32, 20 << 8), single.getCutY());

    // Valida setters
    single.setPosX(500);
    try std.testing.expectEqual(@as(i32, 500), single.getPosX());
    single.setSpeedBase(1024);
    try std.testing.expectEqual(@as(i32, 1024), single.getSpeedBase());
}

test "SingleSprite moveX e moveY delegam para base" {
    const frame = Frame.init(0, 0, &.{});
    var single = SingleSprite.init(null, 10, 20, 5, -2, 16, 16, 16, 16, frame);

    single.moveX();
    try std.testing.expectEqual(@as(i32, 15 << 8), single.getPosX());

    single.moveY();
    try std.testing.expectEqual(@as(i32, 18 << 8), single.getPosY());
}
