/** Representa um sprite único sem caixas de colisões*/
export class Sprite {
    public textureId: number; // ID numérico (hash) que representa o spritesheet no AssetManager
    public posX: number; // posição X em sub-pixels
    public posY: number; // posição Y em sub-pixels
    public prevPosX: number; // posição X no tick anterior
    public prevPosY: number; // posição Y no tick anterior
    public speedX: number; // velocidade X em sub-pixels por tick
    public speedY: number; // velocidade Y em sub-pixels por tick
    public speedBase: number; // velocidade base para movimentação
    public width: number; // largura em pixels do sprite
    public heigth: number; // altura em pixels do sprite
    public drawWidth: number; // largura em pixels em que o sprite será desenhado na tela
    public drawHeigth: number; // altura em pixels em que o sprite será desenhado na tela

    constructor(
        textureId: number,
        posX: number = 0, posY: number = 0,
        speedX: number = 0, speedY: number = 0,
        width: number = 0, heigth: number = 0,
        drawWidth: number = 0, drawHeigth: number = 0
    ) {
        this.textureId = textureId;
        this.posX = posX << 8; // escala para fixed-point 8.8
        this.posY = posY << 8; // escala para fixed-point 8.8
        this.prevPosX = this.posX; // inicializa igual a posição atual
        this.prevPosY = this.posY; // inicializa igual a posição atual
        this.speedX = speedX << 8; // escala para fixed-point 8.8
        this.speedY = speedY << 8; // escala para fixed-point 8.8
        this.width = width << 8; // escala para fixed-point 8.8
        this.heigth = heigth << 8; // escala para fixed-point 8.8
        this.drawWidth = drawWidth << 8; // escala para fixed-point 8.8
        this.drawHeigth = drawHeigth << 8; // escala para fixed-point 8.8
        this.speedBase = 256;
    }

    /**********************************************************/
    /** MÉTODOS */
    /**********************************************************/

    public moveX(): void {
        this.prevPosX = this.posX;
        this.posX += this.speedX;
    }

    public moveY(): void {
        this.prevPosY = this.posY;
        this.posY += this.speedY;
    }
}
