/** Estrutura que representa uma única caixa de colisão */
export class CollisionBox {
    public offsetX: number;
    public offsetY: number;
    public w: number;
    public h: number;

    constructor(offsetX: number, offsetY: number, w: number, h: number) {
        this.offsetX = offsetX;
        this.offsetY = offsetY;
        this.w = w;
        this.h = h;
    }
};