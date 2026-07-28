import { SimpleScene } from "../../engine_ts/scenes/simple_scene";
import { SimpleSceneLayer } from "../../engine_ts/scenes/simple_scene_layer";
import { SimpleSprite } from "../../engine_ts/sprites/simple_sprite";
import { Rectangle } from "../../engine_ts/structures/rectangle";
import { CollisionBox } from "../../engine_ts/sprites/collision_box";
import { Memory } from "../../engine_ts/utils/memory";

export class GameScene {
    public readonly type = 'Game';

    // O operador '!' diz ao TypeScript: "Confie em mim, eu vou inicializar isso depois (no init())"
    public scene!: SimpleScene;

    /** Carrega os assets e configura a cena */
    public async init() {
        // Carrega as imagens
        const imageList: HTMLImageElement[] = await Memory.loadImages(['imgs/bg.png', 'imgs/sprite_inimigo.png', 'imgs/sprite_person_bola.png']);

        // cria sprites da cena
        const collisionBoxList_spriteFundo: CollisionBox[] = [
            new CollisionBox(0, 0, 640, 480),
        ];
        const spriteFundo = new SimpleSprite(imageList[0], 0, 0, 0, 0, new Rectangle(0, 0, 640, 480), collisionBoxList_spriteFundo);

        const collisionBoxList_spritePerson: CollisionBox[] = [
            new CollisionBox(0, 0, 100, 100),
        ];
        const person = new SimpleSprite(imageList[1], 0, 0, 350, 200, new Rectangle(300, 100, 100, 100), collisionBoxList_spritePerson);

        const collisionBoxList_spriteInimigo: CollisionBox[] = [
            new CollisionBox(0, 0, 100, 100),
        ];
        const inimigo = new SimpleSprite(imageList[2], 0, 0, 50, 200, new Rectangle(300, 100, 100, 100), collisionBoxList_spriteInimigo);

        // cria os sprites da cena
        const spriteList: SimpleSprite[] = [spriteFundo, person, inimigo];

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