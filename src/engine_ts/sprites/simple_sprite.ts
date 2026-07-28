import { Frame } from "./frame";

/** Representa um sprite estático (1 ou mais frames controlados manualmente) */
export class SimpleSprite {
    public image: HTMLImageElement; // representa o spritesheet
    public posX: number;
    public posY: number;
    public speedX: number; // velocidade X do sprite
    public speedY: number; // velocidade Y do sprite
    public frameList: Frame[]; // representa a lista de frames desse Sprite
    public currentFrame: number; // Índice do frame ativo no momento

    constructor(
        image: HTMLImageElement,
        posX: number = 0, posY: number = 0,
        speedX: number = 0, speedY: number = 0,
        frameList: Frame[] = []) {
        this.image = image;
        this.posX = posX;
        this.posY = posY;
        this.speedX = speedX;
        this.speedY = speedY;
        this.frameList = frameList;
        this.currentFrame = 0; // Começa no frame 0 por padrão
    }

    /**********************************************************/
    /** MÉTODOS */
    /**********************************************************/

    public move(): void {
        this.posX += this.speedX;
        this.posY += this.speedY;
    }

    /**********************************************************/
    /** MÉTODOS GAMELOOP */
    /**********************************************************/

    public render(ctx: CanvasRenderingContext2D): void {

        ctx.drawImage(
            this.image as CanvasImageSource,
            this.frameList[this.currentFrame].cutRect.x, this.frameList[this.currentFrame].cutRect.y, this.frameList[this.currentFrame].cutRect.w, this.frameList[this.currentFrame].cutRect.h,
            this.posX, this.posY, this.frameList[this.currentFrame].cutRect.w, this.frameList[this.currentFrame].cutRect.h
        );
    }
}