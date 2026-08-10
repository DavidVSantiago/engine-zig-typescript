
import { SpriteUnion } from "../sprites/sprite_union";

export class SimpleSceneLayer {
    public posX: number; // posição x do layer na tela (relativa à origem do jogo)
    public posY: number; // posição y do layer na tela (relativa à origem do jogo)
    private spriteList: SpriteUnion[]; // array de união de sprites desse layer

    constructor(posX: number = 0, posY: number = 0, spriteList: SpriteUnion[]) {
        this.posX = posX;
        this.posY = posY;
        this.spriteList = spriteList;
    }

    /**********************************************************/
    /** MÉTODOS */
    /**********************************************************/

    public moveX(): void {
        for (let i = 0; i < this.spriteList.length; i++) {
            const u = this.spriteList[i];
            switch (u.type) {
                case 'Single': u.sprite.moveX(); break;
                case 'Multi': u.sprite.moveX(); break;
            }
        }
    }
    public moveY(): void {
        for (let i = 0; i < this.spriteList.length; i++) {
            const u = this.spriteList[i];
            switch (u.type) {
                case 'Single': u.sprite.moveY(); break;
                case 'Multi': u.sprite.moveY(); break;
            }
        }
    }

    /**********************************************************/
    /** MÉTODOS GAMELOOP */
    /**********************************************************/

    public render(ctx: CanvasRenderingContext2D, alpha: number): void {
        ctx.save(); // salva o estado da matriz de transformação do canvas
        ctx.translate(this.posX, this.posY); // move a origem do canvas para a posição da layer

        // Renderiza os sprites nas suas posições locais (relativas ao layer)
        for (let i = 0; i < this.spriteList.length; i++) {
            const u = this.spriteList[i];
            switch (u.type) {
                case 'Single': u.sprite.render(ctx, alpha); break;
                case 'Multi': u.sprite.render(ctx, alpha); break;
            }
        }

        ctx.restore(); // Restaura a matriz para não afetar as próximas Layers que forem desenhadas
    }
}
