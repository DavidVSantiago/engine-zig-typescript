const std = @import("std");
const Frame = @import("data/frame.zig").Frame;
const Sprite = @import("sprite.zig").Sprite;
const AssetManager = @import("../resources/asset_manager.zig").AssetManager;
const rt = @import("raylib");

/// Sprite estático com um único quadro
pub const SingleSprite = struct {
    base: Sprite,
    cut_x: i32,
    cut_y: i32,

    /// construtor
    pub inline fn init(
        texture_id: u32,
        pos_x: i32,
        pos_y: i32,
        speed_x: i32,
        speed_y: i32,
        width: i32,
        height: i32,
        draw_width: i32,
        draw_height: i32,
        cut_x: i32,
        cut_y: i32,
    ) SingleSprite {
        return .{
            .base = Sprite.init(texture_id, pos_x, pos_y, speed_x, speed_y, width, height, draw_width, draw_height),
            .cut_x = cut_x,
            .cut_y = cut_y,
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
        return self.cut_x;
    }
    pub inline fn getCutY(self: SingleSprite) i32 {
        return self.cut_y;
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
        self.cut_x = cut_x;
    }
    pub inline fn setCutY(self: *SingleSprite, cut_y: i32) void {
        self.cut_y = cut_y;
    }

    // ========================================================================
    // MÉTODOS
    // ========================================================================

    pub inline fn moveX(self: *SingleSprite) void {
        self.base.moveX();
    }

    pub inline fn moveY(self: *SingleSprite) void {
        self.base.moveY();
    }

    // ========================================================================
    // MÉTODOS GAMELOOP
    // ========================================================================

    pub inline fn render(self: SingleSprite, alpha: f32) void {
        const rl = @import("raylib");

        // 1. Busca a textura carregada na VRAM usando o ID do AssetManager
        const texture = AssetManager.getTexture(self.base.texture_id) orelse return;

        // 2. Converte o alpha para fixed-point 8.8
        const alpha_fixed: i32 = @intFromFloat(alpha * 256.0);

        // 3. Interpolação puramente inteira no domínio dos sub-pixels
        const delta_x = self.base.pos_x - self.base.prev_pos_x;
        const interp_x_sub = self.base.prev_pos_x + @divTrunc(delta_x * alpha_fixed, 256);

        const delta_y = self.base.pos_y - self.base.prev_pos_y;
        const interp_y_sub = self.base.prev_pos_y + @divTrunc(delta_y * alpha_fixed, 256);

        // 4. Converte dimensões estáticas para pixels
        const cut_x: f32 = @floatFromInt(self.cut_x);
        const cut_y: f32 = @floatFromInt(self.cut_y);
        const cut_w: f32 = @floatFromInt(self.base.width >> 8);
        const cut_h: f32 = @floatFromInt(self.base.height >> 8);

        const draw_w: f32 = @floatFromInt(self.base.draw_width >> 8);
        const draw_h: f32 = @floatFromInt(self.base.draw_height >> 8);

        // 5. Monta as structs do Raylib
        const source_rec = rl.Rectangle{
            .x = cut_x,
            .y = cut_y,
            .width = cut_w,
            .height = cut_h,
        };

        const dest_rec = rl.Rectangle{
            // O "pulo do gato": divisão final por float para manter suavização subpixel na GPU
            .x = @as(f32, @floatFromInt(interp_x_sub)) / 256.0,
            .y = @as(f32, @floatFromInt(interp_y_sub)) / 256.0,
            .width = draw_w,
            .height = draw_h,
        };

        const origin = rl.Vector2{ .x = 0.0, .y = 0.0 };

        // 6. Desenha na tela via GPU
        rl.DrawTexturePro(texture, source_rec, dest_rec, origin, 0.0, rl.WHITE);
    }
};

// ============================================================================
// TESTES UNITÁRIOS
// ============================================================================

test "SingleSprite.init e getters/setters" {
    var single = SingleSprite.init(42, 1, 2, 3, 4, 16, 16, 32, 32, 10, 20);

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
    try std.testing.expectEqual(@as(i32, 10), single.getCutX());
    try std.testing.expectEqual(@as(i32, 20), single.getCutY());

    // Valida setters
    single.setPosX(500);
    try std.testing.expectEqual(@as(i32, 500), single.getPosX());
    single.setSpeedBase(1024);
    try std.testing.expectEqual(@as(i32, 1024), single.getSpeedBase());
}

test "SingleSprite moveX e moveY delegam para base" {
    var single = SingleSprite.init(42, 10, 20, 5, -2, 16, 16, 16, 16, 0, 0);

    single.moveX();
    try std.testing.expectEqual(@as(i32, 15 << 8), single.getPosX());

    single.moveY();
    try std.testing.expectEqual(@as(i32, 18 << 8), single.getPosY());
}
