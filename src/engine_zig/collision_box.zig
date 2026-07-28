/// Estrutura que representa uma única caixa de colisão relativa à posição da entidade
pub const CollisionBox = struct {
    offset_x: f32,
    offset_y: f32,
    w: f32,
    h: f32,
};
