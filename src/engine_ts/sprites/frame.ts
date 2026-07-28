import { Rectangle } from "../structures/rectangle";
import { CollisionBox } from "./collision_box";

/** Estrutura que representa um único quadro de um Sprite */
export class Frame {
    public cutRect: Rectangle; // representa as coordenadas de recorte do quadro no Sprite
    public collisionBoxList: CollisionBox[]; // representa as caixas de colisão do quadro no Sprite

    constructor(cutRect: Rectangle, collisionBoxList: CollisionBox[]) {
        this.cutRect = cutRect;
        this.collisionBoxList = collisionBoxList;
    }
}