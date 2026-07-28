const Rectangle = @import("rectangle.zig").Rectangle;
const CollisionBox = @import("collision_box.zig").CollisionBox;

/// Estrutura que representa um único quadro (asset) de um Sprite
pub const Frame = struct {
    cut_rect: Rectangle,
    collision_box_list: []CollisionBox, // Slice nativo do Zig (ponteiro + tamanho)

    pub fn init(cut_rect: Rectangle, collision_box_list: []CollisionBox) Frame {
        return .{
            .cut_rect = cut_rect,
            .collision_box_list = collision_box_list,
        };
    }
};
