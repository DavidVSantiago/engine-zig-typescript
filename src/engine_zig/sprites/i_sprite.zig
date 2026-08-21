const std = @import("std");
const SingleSprite = @import("single_sprite.zig").SingleSprite;
const MultiSprite = @import("multi_sprite.zig").MultiSprite;

pub const SpriteType = enum { single, multi };

/// Implementação da interface via TAGGED UNION - extremamente performática
pub const ISprite = union(SpriteType) {
    single: SingleSprite,
    multi: MultiSprite,

    // O compilador otimiza esses switches (inlining) e roda voando na CPU:

    pub fn render(self: *ISprite, alpha: f32) void {
        switch (self.*) {
            .single => |*s| s.render(alpha),
            .multi => |*m| m.render(alpha),
        }
    }

    pub fn moveX(self: *ISprite) void {
        switch (self.*) {
            .single => |*s| s.moveX(),
            .multi => |*m| m.moveX(),
        }
    }

    pub fn moveY(self: *ISprite) void {
        switch (self.*) {
            .single => |*s| s.moveY(),
            .multi => |*m| m.moveY(),
        }
    }
};
