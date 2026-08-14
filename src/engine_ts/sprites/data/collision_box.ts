/** Estrutura que representa uma única caixa de colisão */
export class CollisionBox {
    public offsetX: number;
    public offsetY: number;
    public w: number;
    public h: number;

    constructor(offsetX: number, offsetY: number, w: number, h: number) {
        this.offsetX = offsetX << 8; // escala para fixed-point 8.8
        this.offsetY = offsetY << 8; // escala para fixed-point 8.8
        this.w = w << 8; // escala para fixed-point 8.8
        this.h = h << 8; // escala para fixed-point 8.8
    }

    public static checkCollisions(
        aList: CollisionBox[],
        aPosX: number,
        aPosY: number,
        bList: CollisionBox[],
        bPosX: number,
        bPosY: number
    ): boolean {
        // Testa cada caixa da lista A contra cada caixa da lista B
        for (let i = 0; i < aList.length; i++) {
            const aBox = aList[i];
            for (let j = 0; j < bList.length; j++) {
                const bBox = bList[j];

                // Posição global da caixa A (Posição do objeto + offset da caixa)
                const aX = aPosX + aBox.offsetX;
                const aY = aPosY + aBox.offsetY;

                // Posição global da caixa B (Posição do objeto + offset da caixa)
                const bX = bPosX + bBox.offsetX;
                const bY = bPosY + bBox.offsetY;
                // Verificação de AABB
                const intersectX = (aX < bX + bBox.w) && (aX + aBox.w > bX);
                const intersectY = (aY < bY + bBox.h) && (aY + aBox.h > bY);
                if (intersectX && intersectY) return true;
            }
        }
        return false;
    };
}