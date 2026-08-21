const std = @import("std");
const SceneLayer = @import("scene_layer.zig").SceneLayer;
const ISprite = @import("../../sprites/i_sprite.zig").ISprite;

/// Camada simples de cena contendo sprites e gerenciando seus ciclos de atualização e renderização
pub const SimpleSceneLayer = struct {
    base: SceneLayer,

    /// Construtor de SimpleSceneLayer
    pub inline fn init(
        pos_x: i32,
        pos_y: i32,
        sprite_list: []ISprite,
    ) SimpleSceneLayer {
        return .{
            .base = SceneLayer.init(pos_x, pos_y, sprite_list),
        };
    }

    // ========================================================================
    // GETTERS & SETTERS (INLINE)
    // ========================================================================

    pub inline fn getPosX(self: SimpleSceneLayer) i32 {
        return self.base.getPosX();
    }

    pub inline fn getPosY(self: SimpleSceneLayer) i32 {
        return self.base.getPosY();
    }

    pub inline fn setPosX(self: *SimpleSceneLayer, pos_x: i32) void {
        self.base.setPosX(pos_x);
    }

    pub inline fn setPosY(self: *SimpleSceneLayer, pos_y: i32) void {
        self.base.setPosY(pos_y);
    }

    pub inline fn getSpriteList(self: SimpleSceneLayer) []ISprite {
        return self.base.getSpriteList();
    }

    pub inline fn setSpriteList(self: *SimpleSceneLayer, sprite_list: []ISprite) void {
        self.base.setSpriteList(sprite_list);
    }

    pub inline fn unload(self: *SimpleSceneLayer) void {
        self.base.unload();
    }

    // ========================================================================
    // MÉTODOS DE MOVIMENTAÇÃO
    // ========================================================================

    pub inline fn moveX(self: *SimpleSceneLayer) void {
        for (self.base.sprite_list) |*sprite| {
            sprite.moveX();
        }
    }

    pub inline fn moveY(self: *SimpleSceneLayer) void {
        for (self.base.sprite_list) |*sprite| {
            sprite.moveY();
        }
    }

    // ========================================================================
    // MÉTODOS GAMELOOP
    // ========================================================================

    pub inline fn render(self: *SimpleSceneLayer, alpha: f32) void {
        for (self.base.sprite_list) |*sprite| {
            sprite.render(alpha);
        }
    }
};
