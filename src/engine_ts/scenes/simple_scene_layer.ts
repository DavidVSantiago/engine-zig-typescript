
import { ISprite } from "../sprites/i_sprite";

export class SimpleSceneLayer {
    public posX: number; // posição x do layer na tela (relativa à origem do jogo)
    public posY: number; // posição y do layer na tela (relativa à origem do jogo)
    private spriteList: ISprite[]; // interface dos sprites desse layer

    constructor(posX: number = 0, posY: number = 0, spriteList: ISprite[]) {
        this.posX = posX;
        this.posY = posY;
        this.spriteList = spriteList;
    }

    /**********************************************************/
    /** MÉTODOS */
    /**********************************************************/

    public moveX(): void {
        for (let i = 0; i < this.spriteList.length; i++) {
            this.spriteList[i].moveX();
        }
    }
    public moveY(): void {
        for (let i = 0; i < this.spriteList.length; i++) {
            this.spriteList[i].moveY();
        }
    }

    /**********************************************************/
    /** MÉTODOS GAMELOOP */
    /**********************************************************/

    public render(ctx: CanvasRenderingContext2D): void {
        ctx.save(); // salva o estado da matriz de transformação do canvas
        ctx.translate(this.posX, this.posY); // move a origem do canvas para a posição da layer

        // Renderiza os sprites nas suas posições locais (relativas ao layer)
        for (let i = 0; i < this.spriteList.length; i++) {
            this.spriteList[i].render(ctx);
        }

        ctx.restore(); // Restaura a matriz para não afetar as próximas Layers que forem desenhadas
    }
}
