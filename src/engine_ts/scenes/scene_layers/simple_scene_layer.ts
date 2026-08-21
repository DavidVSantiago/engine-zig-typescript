import { ISprite } from "../../sprites/i_sprite";
import { SceneLayer } from "./scene_layer";

export class SimpleSceneLayer {
    public base: SceneLayer;

    constructor(posX: number = 0, posY: number = 0, spriteList: ISprite[]) {
        this.base = new SceneLayer(posX, posY, spriteList);
    }

    /**********************************************************/
    /** GETTERS & SETTERS */
    /**********************************************************/

    public getPosX(): number { return this.base.getPosX(); }
    public getPosY(): number { return this.base.getPosY(); }
    public getSpriteList(): ISprite[] { return this.base.getSpriteList(); }

    public setPosX(posX: number): void { this.base.setPosX(posX); }
    public setPosY(posY: number): void { this.base.setPosY(posY); }
    public setSpriteList(spriteList: ISprite[]): void { this.base.setSpriteList(spriteList); }

    /**********************************************************/
    /** MÉTODOS */
    /**********************************************************/

    public unload(): void {
        this.base.unload();
    }

    public moveX(): void {
        for (let i = 0; i < this.base.spriteList.length; i++) {
            this.base.spriteList[i].moveX();
        }
    }
    public moveY(): void {
        for (let i = 0; i < this.base.spriteList.length; i++) {
            this.base.spriteList[i].moveY();
        }
    }

    /**********************************************************/
    /** MÉTODOS GAMELOOP */
    /**********************************************************/

    public render(ctx: CanvasRenderingContext2D, alpha: number): void {
        ctx.save(); // salva o estado da matriz de transformação do canvas
        ctx.translate(this.base.posX, this.base.posY); // move a origem do canvas para a posição da layer

        // Renderiza os sprites nas suas posições locais (relativas ao layer)
        for (let i = 0; i < this.base.spriteList.length; i++) {
            const u = this.base.spriteList[i].render(ctx, alpha);
        }

        ctx.restore(); // Restaura a matriz para não afetar as próximas Layers que forem desenhadas
    }
}
