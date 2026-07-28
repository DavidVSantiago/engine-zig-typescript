import { SimpleScene } from "../../engine_ts/scenes/simple_scene";
import { SimpleSceneLayer } from "../../engine_ts/scenes/simple_scene_layer";
import { SimpleSprite } from "../../engine_ts/sprites/simple_sprite";
import { Rectangle } from "../../engine_ts/structures/rectangle";
import { CollisionBox } from "../../engine_ts/sprites/collision_box";
import { Memory } from "../../engine_ts/utils/memory";
import { AssetManager } from "../../engine_ts/utils/asset_manager";

export class GameScene {
    public readonly type = 'Game';

    // O operador '!' diz ao TypeScript: "Confie em mim, eu vou inicializar isso depois (no init())"
    public scene!: SimpleScene;

    /** Carrega os assets e configura a cena */
    public async init() {

        // cria os sprites da cena
        const spriteList: SimpleSprite[] = await AssetManager.loadSprites([
            'imgs/fundo.json',
            'imgs/person.json',
            'imgs/inimigo.json'
        ]);

        // cria os layers da cena
        const layerList: SimpleSceneLayer[] = [
            new SimpleSceneLayer(0, 0, spriteList),
        ];

        // adiciona os layers na cena
        this.scene = new SimpleScene(layerList);

    }
    public handleInput(event: Event): void {

    }

    public update(deltaTime: number): void {
        this.scene.update(deltaTime);
    }
    public render(ctx: CanvasRenderingContext2D): void {
        this.scene.render(ctx);
    }
}