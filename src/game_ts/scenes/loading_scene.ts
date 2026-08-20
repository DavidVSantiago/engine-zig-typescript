import { SimpleSceneLayer } from "../../engine_ts/scenes/scene_layers/simple_scene_layer";
import { AssetManager } from "../../engine_ts/resources/asset_manager";
import { SingleSprite } from "../../engine_ts/sprites/single_sprite";
import { ISceneLayer } from "../../engine_ts/scenes/scene_layers/i_scene_layer";
import { ISprite } from "../../engine_ts/sprites/i_sprite";
import { BaseScene } from "../../engine_ts/scenes/base_scene";

export class LoadingScene {
    public base!: BaseScene;

    public fundo!: SingleSprite;

    public async init() {
        // carrega os sprites
        const spriteList: SingleSprite[] = await AssetManager.loadSingleSprites([
            'sprites/splash.spr'
        ]);

        // armazena as refs dos sprites
        this.fundo = spriteList[0];
        this.fundo.setPosX((320 << 8) - (this.fundo.getDrawWidth() >> 1));
        this.fundo.setPosY((240 << 8) - (this.fundo.getDrawHeigth() >> 1));

        // cria os layers da cena
        const layerList: ISceneLayer[] = [
            new SimpleSceneLayer(0, 0, [this.fundo]),
        ];

        // adiciona os layers na cena
        this.base = new BaseScene(layerList);

    }

    /**********************************************************/
    /** MÉTODOS GAMELOOP*/
    /**********************************************************/

    public handleInput(): void { }

    public update(): void {
        this.base.moveX();
        this.base.moveY();

    }

    public render(ctx: CanvasRenderingContext2D, alpha: number): void {
        this.base.render(ctx, alpha);
    }

}
