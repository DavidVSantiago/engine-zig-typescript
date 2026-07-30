/** Representa um retangulo*/
export class Rectangle {
    public x: number;
    public y: number;
    public w: number;
    public h: number;
    constructor(x: number, y: number, w: number, h: number) {
        this.x = x << 8; // escala para fixed-point 8.8
        this.y = y << 8; // escala para fixed-point 8.8
        this.w = w << 8; // escala para fixed-point 8.8
        this.h = h << 8; // escala para fixed-point 8.8
    }
}