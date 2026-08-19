const std = @import("std");

pub const Texture2D = extern struct {
    id: c_uint = 0,
    width: c_int = 0,
    height: c_int = 0,
    mipmaps: c_int = 1,
    format: c_int = 0,
};

pub const Rectangle = extern struct {
    x: f32 = 0,
    y: f32 = 0,
    width: f32 = 0,
    height: f32 = 0,
};

pub const Vector2 = extern struct {
    x: f32 = 0,
    y: f32 = 0,
};

pub const Color = extern struct {
    r: u8 = 255,
    g: u8 = 255,
    b: u8 = 255,
    a: u8 = 255,
};

pub const WHITE = Color{ .r = 255, .g = 255, .b = 255, .a = 255 };

pub fn LoadTexture(fileName: [*:0]const u8) Texture2D {
    _ = fileName;
    return .{ .id = 1, .width = 100, .height = 100 };
}

pub fn UnloadTexture(texture: Texture2D) void {
    _ = texture;
}

pub fn DrawTexturePro(
    texture: Texture2D,
    source: Rectangle,
    dest: Rectangle,
    origin: Vector2,
    rotation: f32,
    tint: Color,
) void {
    _ = texture;
    _ = source;
    _ = dest;
    _ = origin;
    _ = rotation;
    _ = tint;
}
