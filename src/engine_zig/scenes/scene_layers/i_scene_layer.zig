const std = @import("std");
const SimpleSceneLayer = @import("simple_scene_layer.zig").SimpleSceneLayer;

pub const LayerType = enum { simple };

/// Implementação da interface ISceneLayer via TAGGED UNION - extremamente performática (Data-Oriented Design)
pub const ISceneLayer = union(LayerType) {
    simple: SimpleSceneLayer,

    // O compilador otimiza esses switches (inlining/branch prediction) e executa na velocidade máxima da CPU:

    pub inline fn moveX(self: *ISceneLayer) void {
        switch (self.*) {
            .simple => |*l| l.moveX(),
        }
    }

    pub inline fn moveY(self: *ISceneLayer) void {
        switch (self.*) {
            .simple => |*l| l.moveY(),
        }
    }

    pub inline fn render(self: *ISceneLayer, alpha: f32) void {
        switch (self.*) {
            .simple => |*l| l.render(alpha),
        }
    }
};
