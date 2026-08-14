const std = @import("std");

/// Estrutura base contendo os atributos genéricos de todos os tipos de sprites em ponto-fixo (8.8)
pub const Sprite = struct {
    image: ?*const anyopaque = null, // ponteiro para a textura do sprite
    pos_x: i32,
    pos_y: i32,
    prev_pos_x: i32,
    prev_pos_y: i32,
    speed_x: i32,
    speed_y: i32,
    speed_base: i32,
    width: i32,
    height: i32,
    draw_width: i32,
    draw_height: i32,

    /// construtor de Sprite
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
    ) Sprite {
        const px = pos_x << 8;
        const py = pos_y << 8;

        return .{
            .image = image,
            .pos_x = px,
            .pos_y = py,
            .prev_pos_x = px,
            .prev_pos_y = py,
            .speed_x = speed_x << 8,
            .speed_y = speed_y << 8,
            .speed_base = 256,
            .width = width << 8,
            .height = height << 8,
            .draw_width = draw_width << 8,
            .draw_height = draw_height << 8,
        };
    }

    /// Atualiza o histórico e move a posição X com base na velocidade
    pub inline fn moveX(self: *Sprite) void {
        self.prev_pos_x = self.pos_x;
        self.pos_x += self.speed_x;
    }

    /// Atualiza o histórico e move a posição Y com base na velocidade
    pub inline fn moveY(self: *Sprite) void {
        self.prev_pos_y = self.pos_y;
        self.pos_y += self.speed_y;
    }
};

// ============================================================================
// TESTES UNITÁRIOS
// ============================================================================

test "Sprite layout e tamanho em memoria" {
    try std.testing.expectEqual(@as(usize, 56), @sizeOf(Sprite));
    try std.testing.expectEqual(@as(usize, 8), @alignOf(Sprite));

    try std.testing.expectEqual(@as(usize, 0), @offsetOf(Sprite, "image"));
    try std.testing.expectEqual(@as(usize, 8), @offsetOf(Sprite, "pos_x"));
    try std.testing.expectEqual(@as(usize, 12), @offsetOf(Sprite, "pos_y"));
    try std.testing.expectEqual(@as(usize, 16), @offsetOf(Sprite, "prev_pos_x"));
    try std.testing.expectEqual(@as(usize, 20), @offsetOf(Sprite, "prev_pos_y"));
    try std.testing.expectEqual(@as(usize, 24), @offsetOf(Sprite, "speed_x"));
    try std.testing.expectEqual(@as(usize, 28), @offsetOf(Sprite, "speed_y"));
    try std.testing.expectEqual(@as(usize, 32), @offsetOf(Sprite, "speed_base"));
    try std.testing.expectEqual(@as(usize, 36), @offsetOf(Sprite, "width"));
    try std.testing.expectEqual(@as(usize, 40), @offsetOf(Sprite, "height"));
    try std.testing.expectEqual(@as(usize, 44), @offsetOf(Sprite, "draw_width"));
    try std.testing.expectEqual(@as(usize, 48), @offsetOf(Sprite, "draw_height"));
}

test "Sprite.moveX e Sprite.moveY" {
    var sprite = Sprite.init(null, 10, 20, 5, -2, 16, 16, 16, 16);

    sprite.moveX();
    try std.testing.expectEqual(@as(i32, 10 << 8), sprite.prev_pos_x);
    try std.testing.expectEqual(@as(i32, 15 << 8), sprite.pos_x);

    sprite.moveY();
    try std.testing.expectEqual(@as(i32, 20 << 8), sprite.prev_pos_y);
    try std.testing.expectEqual(@as(i32, 18 << 8), sprite.pos_y);
}
