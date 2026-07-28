import { SimpleSceneLayer } from "./simple_scene_layer";

/**
 * Abstrai uma cena simples genérica.
 * O Cliente (ex: MenuScene) deve usar a composição para usar esta classe */
export class SimpleScene {
    public layerList: SimpleSceneLayer[]; // armazena todos os layer da cena

    constructor(layerList: SimpleSceneLayer[]) {
        this.layerList = layerList;
    }

    /**********************************************************/
    /** MÉTODOS */
    /**********************************************************/

    public unload(): void {
        this.layerList = [];
    }

    public update(deltaTime: number): void {
        for (let i = 0; i < this.layerList.length; i++) {
            this.layerList[i].move();
        }
    }

    public render(ctx: CanvasRenderingContext2D): void {
        for (let i = 0; i < this.layerList.length; i++) {
            this.layerList[i].render(ctx);
        }
    }
}
