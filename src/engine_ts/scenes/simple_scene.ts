import { SimpleSceneLayer } from "./simple_scene_layer";

/**
 * Abstrai uma cena simples genérica.
 * O Cliente (ex: MenuScene) deve usar a composição para usar esta classe */
export class SimpleScene {
    private layerList: SimpleSceneLayer[]; // armazena todos os layer da cena

    constructor(layerList: SimpleSceneLayer[]) {
        this.layerList = layerList;
    }

    public unload(): void {
        this.layerList = [];
    }


    /**********************************************************/
    /** MÉTODOS GAMELOOP */
    /**********************************************************/

    public moveX(): void {
        for (let i = 0; i < this.layerList.length; i++) {
            this.layerList[i].moveX();
        }
    }
    public moveY(): void {
        for (let i = 0; i < this.layerList.length; i++) {
            this.layerList[i].moveY();
        }
    }

    public render(ctx: CanvasRenderingContext2D): void {
        for (let i = 0; i < this.layerList.length; i++) {
            this.layerList[i].render(ctx);
        }
    }
}
