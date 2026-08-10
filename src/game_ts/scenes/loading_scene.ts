import { SimpleScene } from "../../engine_ts/scenes/simple_scene";
import { SimpleSceneLayer } from "../../engine_ts/scenes/simple_scene_layer";
import { MultiSprite, } from "../../engine_ts/sprites/multi_sprite";
import { AssetManager } from "../../engine_ts/utils/asset_manager";
import { SpriteUnion } from "../../engine_ts/sprites/sprite_union";
import { SingleSprite } from "../../engine_ts/sprites/single_sprite";

export class LoadingScene {
    public readonly type = 'Loading';

    public base!: SimpleScene;

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

        // cria a tag da união
        const uFundo: SpriteUnion = { type: 'Single', sprite: this.fundo };

        // cria os layers da cena
        const layerList: SimpleSceneLayer[] = [
            new SimpleSceneLayer(0, 0, [uFundo]),
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

    public render(ctx: CanvasRenderingContext2D, alpha: number): void {
        this.base.render(ctx, alpha);
    }

    /**********************************************************/
    /** OUTROS MÉTODOS */
    /**********************************************************/

}