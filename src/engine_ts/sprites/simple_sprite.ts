import { Frame } from "./frame";
import { CollisionBox } from "./collision_box";

/** Representa um sprite estático (1 ou mais frames controlados manualmente) */
export class SimpleSprite {
    public image: HTMLImageElement; // representa o spritesheet
    public posX: number; // posição X em sub-pixels
    public posY: number; // posição Y em sub-pixels
    public speedX: number; // velocidade X em sub-pixels por tick
    public speedY: number; // velocidade Y em sub-pixels por tick
    public speedBase: number; // velocidade base para movimentação
    public frameList: Frame[]; // representa a lista de frames desse Sprite
    public currentFrame: number; // Índice do frame ativo no momento

    constructor(
        image: HTMLImageElement,
        posX: number = 0, posY: number = 0,
        speedX: number = 0, speedY: number = 0,
        frameList: Frame[] = []) {
        this.image = image;
        this.posX = posX << 8; // escala para fixed-point 8.8
        this.posY = posY << 8; // escala para fixed-point 8.8
        this.speedX = speedX << 8; // escala para fixed-point 8.8
        this.speedY = speedY << 8; // escala para fixed-point 8.8
        this.speedBase = 256;
        this.frameList = frameList;
        this.currentFrame = 0; // Começa no frame 0 por padrão
    }

    /**********************************************************/
    /** MÉTODOS */
    /**********************************************************/

    public moveX(): void {
        this.posX += this.speedX;
    }
    public moveY(): void {
        this.posY += this.speedY;
    }

    public getCollisionBoxList(): CollisionBox[] {
        return this.frameList[this.currentFrame].collisionBoxList;
    }

    public getPosX(): number { return this.posX; }
    public getPosY(): number { return this.posY; }
    public getSpeedX(): number { return this.speedX; }
    public getSpeedY(): number { return this.speedY; }

    public setPosX(posX: number): void { this.posX = posX; }
    public setPosY(posY: number): void { this.posY = posY; }
    public setSpeedX(speedX: number): void { this.speedX = speedX; }
    public setSpeedY(speedY: number): void { this.speedY = speedY; }

    public getWidth(): number { return this.frameList[this.currentFrame].cutRect.w; }
    public getHeight(): number { return this.frameList[this.currentFrame].cutRect.h; }

    public getWidthInPixels(): number {
        return this.frameList[this.currentFrame].cutRect.w >> 8;
    }

    public getHeightInPixels(): number {
        return this.frameList[this.currentFrame].cutRect.h >> 8;
    }

    /**********************************************************/
    /** MÉTODOS GAMELOOP */
    /**********************************************************/

    public render(ctx: CanvasRenderingContext2D): void {
        const rect = this.frameList[this.currentFrame].cutRect;
        // Converte sub-pixels para pixels reais na hora de desenhar (>> 8 = dividir por 256)
        const screenX = (this.posX >> 8);
        const screenY = (this.posY >> 8);
        const rectX = (rect.x >> 8);
        const rectY = (rect.y >> 8);
        const rectW = (rect.w >> 8);
        const rectH = (rect.h >> 8);
        ctx.drawImage(
            this.image as CanvasImageSource,
            rectX, rectY, rectW, rectH,
            screenX, screenY, rectW, rectH
        );
    }
}