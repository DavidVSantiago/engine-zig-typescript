const std = @import("std");
const ISprite = @import("../../sprites/i_sprite.zig").ISprite;

/// Estrutura base contendo os atributos genéricos de uma camada (Layer) de cena em ponto-fixo (8.8)
pub const SceneLayer = struct {
    pos_x: i32, // posição X da camada na tela em 8.8 (relativa à origem do jogo)
    pos_y: i32, // posição Y da camada na tela em 8.8 (relativa à origem do jogo)
    sprite_list: []ISprite, // lista de sprites pertencentes a essa camada

    /// Construtor de SceneLayer
    pub inline fn init(
        pos_x: i32,
        pos_y: i32,
        sprite_list: []ISprite,
    ) SceneLayer {
        return .{
            .pos_x = pos_x,
            .pos_y = pos_y,
            .sprite_list = sprite_list,
        };
    }

    // ========================================================================
    // GETTERS & SETTERS (INLINE)
    // ========================================================================

    pub inline fn getPosX(self: SceneLayer) i32 {
        return self.pos_x;
    }

    pub inline fn getPosY(self: SceneLayer) i32 {
        return self.pos_y;
    }

    pub inline fn getSpriteList(self: SceneLayer) []ISprite {
        return self.sprite_list;
    }

    pub inline fn setPosX(self: *SceneLayer, pos_x: i32) void {
        self.pos_x = pos_x;
    }

    pub inline fn setPosY(self: *SceneLayer, pos_y: i32) void {
        self.pos_y = pos_y;
    }

    pub inline fn setSpriteList(self: *SceneLayer, sprite_list: []ISprite) void {
        self.sprite_list = sprite_list;
    }

    // ========================================================================
    // MÉTODOS
    // ========================================================================

    /// Descarrega a lista de sprites da camada
    pub inline fn unload(self: *SceneLayer) void {
        self.sprite_list = &.{};
    }
};

// ============================================================================
// TESTES UNITÁRIOS
// ============================================================================

test "SceneLayer.init, getters/setters e unload" {
    var sprites: [0]ISprite = .{};
    var layer = SceneLayer.init(10, 20, &sprites);

    // Valida getters
    try std.testing.expectEqual(@as(i32, 10), layer.getPosX());
    try std.testing.expectEqual(@as(i32, 20), layer.getPosY());
    try std.testing.expectEqual(@as(usize, 0), layer.getSpriteList().len);

    // Valida setters
    layer.setPosX(100);
    layer.setPosY(200);
    try std.testing.expectEqual(@as(i32, 100), layer.getPosX());
    try std.testing.expectEqual(@as(i32, 200), layer.getPosY());

    // Valida unload
    layer.unload();
    try std.testing.expectEqual(@as(usize, 0), layer.sprite_list.len);
}
