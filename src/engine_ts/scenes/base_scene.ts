import { ISceneLayer } from "./scene_layers/i_scene_layer";

export class BaseScene {
    public layerList: ISceneLayer[]; // armazena todos os layer da cena

    constructor(layerList: ISceneLayer[]) {
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

    public render(ctx: CanvasRenderingContext2D, alpha: number): void {
        for (let i = 0; i < this.layerList.length; i++) {
            this.layerList[i].render(ctx, alpha);
        }
    }
}
