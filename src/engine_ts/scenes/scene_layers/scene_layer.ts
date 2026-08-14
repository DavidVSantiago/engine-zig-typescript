
import { ISprite } from "../../sprites/i_sprite";

export class SceneLayer {
    public posX: number; // posição x do layer na tela (relativa à origem do jogo)
    public posY: number; // posição y do layer na tela (relativa à origem do jogo)
    public spriteList: ISprite[]; // array de sprites desse layer

    constructor(posX: number = 0, posY: number = 0, spriteList: ISprite[]) {
        this.posX = posX;
        this.posY = posY;
        this.spriteList = spriteList;
    }

    public unload(): void {
        this.spriteList = [];
    }
}
