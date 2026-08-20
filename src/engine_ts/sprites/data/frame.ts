import { CollisionBox } from "./collision_box";

/** Estrutura que representa um único quadro de um Sprite */
export class Frame {
    public cutX!: number;
    public cutY!: number;
    public collisionBoxList: CollisionBox[]; // representa as caixas de colisão do quadro no Sprite

    constructor(cutX: number, cutY: number, collisionBoxList: CollisionBox[] | null) {
        this.cutX = cutX;
        this.cutY = cutY;
        this.collisionBoxList = collisionBoxList ? collisionBoxList : [];
    }
}
