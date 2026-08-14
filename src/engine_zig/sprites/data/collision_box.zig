const std = @import("std");

/// Estrutura que representa uma única caixa de colisão
pub const CollisionBox = struct {
    offset_x: i32,
    offset_y: i32,
    w: i32,
    h: i32,

    pub inline fn init(offset_x: i32, offset_y: i32, w: i32, h: i32) CollisionBox {
        return .{
            .offset_x = offset_x << 8,
            .offset_y = offset_y << 8,
            .w = w << 8,
            .h = h << 8,
        };
    }

    /// Testa cada caixa da lista A contra cada caixa da lista B
    pub inline fn checkCollisions(
        a_list: []const CollisionBox,
        a_pos_x: i32,
        a_pos_y: i32,
        b_list: []const CollisionBox,
        b_pos_x: i32,
        b_pos_y: i32,
    ) bool {
        for (a_list) |a_box| {
            // Invariantes calculados apenas 1 vez por caixa A (fora do loop interno B)
            const a_x1 = a_pos_x + a_box.offset_x;
            const a_x2 = a_x1 + a_box.w;
            const a_y1 = a_pos_y + a_box.offset_y;
            const a_y2 = a_y1 + a_box.h;

            for (b_list) |b_box| {
                const b_x1 = b_pos_x + b_box.offset_x;
                const b_x2 = b_x1 + b_box.w;

                // Curto-circuito no eixo X: se não sobrepõe em X, nem processa o eixo Y
                if (a_x1 >= b_x2 or a_x2 <= b_x1) continue;

                const b_y1 = b_pos_y + b_box.offset_y;
                const b_y2 = b_y1 + b_box.h;

                // Se sobrepõe em X e sobrepõe em Y, houve colisão!
                if (a_y1 < b_y2 and a_y2 > b_y1) return true;
            }
        }
        return false;
    }
};

// ============================================================================
// TESTES UNITÁRIOS
// ============================================================================

test "CollisionBox.init conversao para 8.8" {
    const box = CollisionBox.init(10, 20, 30, 40);
    try std.testing.expectEqual(@as(i32, 10 << 8), box.offset_x);
    try std.testing.expectEqual(@as(i32, 20 << 8), box.offset_y);
    try std.testing.expectEqual(@as(i32, 30 << 8), box.w);
    try std.testing.expectEqual(@as(i32, 40 << 8), box.h);
}

test "CollisionBox.checkCollisions com colisao" {
    const a_boxes = [_]CollisionBox{
        CollisionBox.init(0, 0, 16, 16),
    };
    const b_boxes = [_]CollisionBox{
        CollisionBox.init(0, 0, 16, 16),
    };

    // A em (10, 10) e B em (20, 20) -> Sobrepõem-se (10..26 vs 20..36)
    const a_pos_x = 10 << 8;
    const a_pos_y = 10 << 8;
    const b_pos_x = 20 << 8;
    const b_pos_y = 20 << 8;

    const hit = CollisionBox.checkCollisions(&a_boxes, a_pos_x, a_pos_y, &b_boxes, b_pos_x, b_pos_y);
    try std.testing.expect(hit == true);
}

test "CollisionBox.checkCollisions sem colisao" {
    const a_boxes = [_]CollisionBox{
        CollisionBox.init(0, 0, 16, 16),
    };
    const b_boxes = [_]CollisionBox{
        CollisionBox.init(0, 0, 16, 16),
    };

    // A em (10, 10) e B em (50, 50) -> Sem sobreposição
    const a_pos_x = 10 << 8;
    const a_pos_y = 10 << 8;
    const b_pos_x = 50 << 8;
    const b_pos_y = 50 << 8;

    const hit = CollisionBox.checkCollisions(&a_boxes, a_pos_x, a_pos_y, &b_boxes, b_pos_x, b_pos_y);
    try std.testing.expect(hit == false);
}
