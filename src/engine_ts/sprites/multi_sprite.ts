import { Frame } from "./frame";
import { CollisionBox } from "./collision_box";
import { Sprite } from "./sprite";

/** Representa um sprite estático com caixas de colisões(1 ou mais frames controlados manualmente) */
export class MultiSprite {
    public base: Sprite; // atributos genericos de todos os tipos de sprites
    public frameList: Frame[]; // representa a lista de frames de MultiSprite
    public currentFrame: number; // Índice do frame ativo no momento

    constructor(
        image: HTMLImageElement,
        posX: number = 0, posY: number = 0,
        speedX: number = 0, speedY: number = 0,
        width: number = 0, heigth: number = 0,
        drawWidth: number = 0, drawHeigth: number = 0,
        frameList: Frame[] = []) {

        // inicializa a base com os atributos genéricos
        this.base = new Sprite(
            image, posX, posY,
            speedX, speedY,
            width, heigth,
            drawWidth, drawHeigth
        );
        this.frameList = frameList;
        this.currentFrame = 0; // Começa no frame 0 por padrão
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
    public getCutX(): number { return this.frameList[this.currentFrame].cutX; }
    public getCutY(): number { return this.frameList[this.currentFrame].cutY; }

    public setPosX(posX: number): void { this.base.posX = posX; }
    public setPosY(posY: number): void { this.base.posY = posY; }
    public setSpeedX(speedX: number): void { this.base.speedX = speedX; }
    public setSpeedY(speedY: number): void { this.base.speedY = speedY; }
    public setSpeedBase(speedBase: number): void { this.base.speedBase = speedBase; }
    public setWidth(width: number): void { this.base.width = width; }
    public setHeigth(heigth: number): void { this.base.heigth = heigth; }
    public setDrawWidth(drawWidth: number): void { this.base.drawWidth = drawWidth; }
    public setDrawHeigth(drawHeigth: number): void { this.base.drawHeigth = drawHeigth; }
    public setCutX(cutX: number): void { this.frameList[this.currentFrame].cutX = cutX; }
    public setCutY(cutY: number): void { this.frameList[this.currentFrame].cutY = cutY; }

    /**********************************************************/
    /** MÉTODOS */
    /**********************************************************/

    public moveX(): void {
        this.base.posX += this.base.speedX;
    }
    public moveY(): void {
        this.base.posY += this.base.speedY;
    }

    public getCollisionBoxList(): CollisionBox[] {
        return this.frameList[this.currentFrame].collisionBoxList;
    }

    /**********************************************************/
    /** MÉTODOS GAMELOOP */
    /**********************************************************/

    public render(ctx: CanvasRenderingContext2D): void {
        const frame = this.frameList[this.currentFrame];
        // Converte sub-pixels para pixels reais na hora de desenhar (>> 8 = dividir por 256)
        const cutX = (frame.cutX >> 8);
        const cutY = (frame.cutY >> 8);
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