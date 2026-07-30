import { SimpleScene } from "../../engine_ts/scenes/simple_scene";
import { SimpleSceneLayer } from "../../engine_ts/scenes/simple_scene_layer";
import { SimpleSprite, } from "../../engine_ts/sprites/simple_sprite";
import { AssetManager } from "../../engine_ts/utils/asset_manager";
import { ISprite } from "../../engine_ts/sprites/i_sprite";

export class SplashScene {
    public readonly type = 'Splash';

    public base!: SimpleScene;

    public fundo!: SimpleSprite;

    public async init() {
        // carrega os sprites
        const spriteList: SimpleSprite[] = await AssetManager.loadSprites([
            'sprites/splash.json'
        ]);
        // armazena as refs dos sprites
        this.fundo = spriteList[0];
        this.fundo.setPosX((320 << 8) - (this.fundo.getWidth() >> 1));
        this.fundo.setPosY((240 << 8) - (this.fundo.getHeight() >> 1));

        // cria os VTable's dos sprites
        const iSpriteFundo: ISprite = {
            moveX: () => this.fundo.moveX(),
            moveY: () => this.fundo.moveY(),
            render: (ctx) => this.fundo.render(ctx)
        };

        // cria os layers da cena
        const layerList: SimpleSceneLayer[] = [
            new SimpleSceneLayer(0, 0, [iSpriteFundo]),
        ];

        // adiciona os layers na cena
        this.base = new SimpleScene(layerList);

    }

    /**********************************************************/
    /** MÉTODOS GAMELOOP*/
    /**********************************************************/

    public update(): void {
        this.base.moveX();
        this.base.moveY();

    }

    public render(ctx: CanvasRenderingContext2D): void {
        this.base.render(ctx);
    }

    /**********************************************************/
    /** OUTROS MÉTODOS */
    /**********************************************************/

}