const std = @import("std");
const ISceneLayer = @import("scene_layers/i_scene_layer.zig").ISceneLayer;

/// Estrutura base contendo a lista de camadas (Layers) da cena e seus ciclos de vida e gameloop
pub const BaseScene = struct {
    layer_list: []ISceneLayer, // armazena todas as camadas (layers) da cena

    /// Construtor de BaseScene
    pub inline fn init(layer_list: []ISceneLayer) BaseScene {
        return .{
            .layer_list = layer_list,
        };
    }

    // ========================================================================
    // GETTERS & SETTERS (INLINE)
    // ========================================================================

    pub inline fn getLayerList(self: BaseScene) []ISceneLayer {
        return self.layer_list;
    }

    pub inline fn setLayerList(self: *BaseScene, layer_list: []ISceneLayer) void {
        self.layer_list = layer_list;
    }

    // ========================================================================
    // MÉTODOS
    // ========================================================================

    /// Descarrega todas as camadas da cena
    pub inline fn unload(self: *BaseScene) void {
        self.layer_list = &.{};
    }

    // ========================================================================
    // MÉTODOS GAMELOOP
    // ========================================================================

    pub inline fn moveX(self: *BaseScene) void {
        for (self.layer_list) |*layer| {
            layer.moveX();
        }
    }

    pub inline fn moveY(self: *BaseScene) void {
        for (self.layer_list) |*layer| {
            layer.moveY();
        }
    }

    pub inline fn render(self: *BaseScene, alpha: f32) void {
        for (self.layer_list) |*layer| {
            layer.render(alpha);
        }
    }
};

// ============================================================================
// TESTES UNITÁRIOS
// ============================================================================

test "BaseScene.init, getters/setters, gameloop e unload" {
    var layers: [0]ISceneLayer = .{};
    var scene = BaseScene.init(&layers);

    // Valida getters
    try std.testing.expectEqual(@as(usize, 0), scene.getLayerList().len);

    // Valida gameloop
    scene.moveX();
    scene.moveY();
    scene.render(0.5);

    // Valida unload
    scene.unload();
    try std.testing.expectEqual(@as(usize, 0), scene.layer_list.len);
}
