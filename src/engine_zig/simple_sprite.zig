const std = @import("std");
const Frame = @import("frame.zig").Frame;
const Rectangle = @import("rectangle.zig").Rectangle;
const CollisionBox = @import("collision_box.zig").CollisionBox;

pub const SimpleSprite = struct {
    image: *anyopaque, // Usamos ponteiro opaco para desacoplar a engine da biblioteca gráfica (Raylib)
    pos_x: f32,
    pos_y: f32,
    speed_x: f32,
    speed_y: f32,
    frame: Frame,

    pub fn init(
        image: *anyopaque,
        speed_x: f32,
        speed_y: f32,
        pos_x: f32,
        pos_y: f32,
        cut_rect: Rectangle,
        collision_box_list: []CollisionBox,
    ) SimpleSprite {
        return .{
            .image = image,
            .pos_x = pos_x,
            .pos_y = pos_y,
            .speed_x = speed_x,
            .speed_y = speed_y,
            .frame = Frame.init(cut_rect, collision_box_list),
        };
    }

    pub fn move(self: *SimpleSprite) void {
        self.pos_x += self.speed_x;
        self.pos_y += self.speed_y;
    }
};
