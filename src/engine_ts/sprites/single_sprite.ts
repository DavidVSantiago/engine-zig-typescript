import { Frame } from "./frame";
import { Sprite } from "./sprite";

/** Representa um sprite único sem caixas de colisões*/
export class SingleSprite {
    public base: Sprite; // atributos genericos de todos os tipos de sprites
    public frame: Frame; // representa o frame unico de SingleSprite

    constructor(
        image: HTMLImageElement,
        posX: number = 0, posY: number = 0,
        speedX: number = 0, speedY: number = 0,
        width: number = 0, heigth: number = 0,
        drawWidth: number = 0, drawHeigth: number = 0,
        frame: Frame) {

        // inicializa a base com os atributos genéricos
        this.base = new Sprite(
            image, posX, posY,
            speedX, speedY,
            width, heigth,
            drawWidth, drawHeigth
        );
        this.frame = frame; // atributo específico de SingleSprite
    }

    /**********************************************************/
    /** GETTERS & SETTERS */
    /**********************************************************/

    public getPosX(): number { return this.base.posX; }
    public getPosY(): number { return this.base.posY; }
    public getSpeedX(): number { return this.base.speedX; }
    public getSpeedY(): number { return this.base.speedY; }
    public getSpeedBase(): number { return this.base.speedBase; }
    public getWidth(): number { return this.base.width; }
    public getHeight(): number { return this.base.heigth; }
    public getDrawWidth(): number { return this.base.drawWidth; }
    public getDrawHeigth(): number { return this.base.drawHeigth; }
    public getCutX(): number { return this.frame.cutX; }
    public getCutY(): number { return this.frame.cutY; }

    public setPosX(posX: number): void { this.base.posX = posX; }
    public setPosY(posY: number): void { this.base.posY = posY; }
    public setSpeedX(speedX: number): void { this.base.speedX = speedX; }
    public setSpeedY(speedY: number): void { this.base.speedY = speedY; }
    public setSpeedBase(speedBase: number): void { this.base.speedBase = speedBase; }
    public setWidth(width: number): void { this.base.width = width; }
    public setHeigth(heigth: number): void { this.base.heigth = heigth; }
    public setDrawWidth(drawWidth: number): void { this.base.drawWidth = drawWidth; }
    public setDrawHeigth(drawHeigth: number): void { this.base.drawHeigth = drawHeigth; }
    public setCutX(cutX: number): void { this.frame.cutX = cutX; }
    public setCutY(cutY: number): void { this.frame.cutY = cutY; }

    /**********************************************************/
    /** MÉTODOS */
    /**********************************************************/

    public moveX(): void {
        this.base.posX += this.base.speedX;
    }
    public moveY(): void {
        this.base.posY += this.base.speedY;
    }

    /**********************************************************/
    /** MÉTODOS GAMELOOP */
    /**********************************************************/

    public render(ctx: CanvasRenderingContext2D): void {
        // Converte sub-pixels para pixels reais na hora de desenhar (>> 8 = dividir por 256)
        const cutX = (this.frame.cutX >> 8);
        const cutY = (this.frame.cutY >> 8);
        const cutW = (this.base.width >> 8);
        const cutH = (this.base.heigth >> 8);
        const drawX = (this.base.posX >> 8);
        const drawY = (this.base.posY >> 8);
        const drawW = (this.base.drawWidth >> 8);
        const drawH = (this.base.drawHeigth >> 8);
        ctx.drawImage(
            this.base.image as CanvasImageSource,
            cutX, cutY, cutW, cutH,
            drawX, drawY, drawW, drawH
        );
    }
}