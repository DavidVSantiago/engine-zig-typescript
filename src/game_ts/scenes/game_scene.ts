import { SimpleScene } from "../../engine_ts/scenes/simple_scene";
import { SimpleSceneLayer } from "../../engine_ts/scenes/simple_scene_layer";
import { SimpleSprite, } from "../../engine_ts/sprites/simple_sprite";
import { Rectangle } from "../../engine_ts/structures/rectangle";
import { CollisionBox as CB } from "../../engine_ts/sprites/collision_box";
import { FileIO } from "../../engine_ts/utils/file_io";
import { AssetManager } from "../../engine_ts/utils/asset_manager";
import { InputManager as IM } from "../../engine_ts/utils/input_manager";
import { ISprite } from "../../engine_ts/sprites/i_sprite";

export class GameScene {
    public readonly type = 'Game';

    public base!: SimpleScene;

    public fundo!: SimpleSprite;
    public person!: SimpleSprite;
    public inimigo!: SimpleSprite;
    public bolinha!: SimpleSprite;

    public async init() {
        // carrega os sprites
        const spriteList_01: SimpleSprite[] = await AssetManager.loadSprites([
            'sprites/fundo.json'
        ]);
        const spriteList_02: SimpleSprite[] = await AssetManager.loadSprites([
            'sprites/person.json',
            'sprites/inimigo.json',
            'sprites/bolinha.json'
        ]);
        // armazena as refs dos sprites
        this.fundo = spriteList_01[0];
        this.person = spriteList_02[0];
        this.inimigo = spriteList_02[1];
        this.bolinha = spriteList_02[2];

        // faz ajustes no estado inicial dos sprites
        this.person.currentFrame = 8;
        this.person.speedBase = (3 << 8); // 3 pixels por tick (já em fixed-point)
        this.inimigo.currentFrame = 8;
        this.inimigo.speedBase = (3 << 8); // 3 pixels por tick (já em fixed-point)

        // cria os VTable's dos sprites
        const iSpriteFundo: ISprite = {
            moveX: () => this.fundo.moveX(),
            moveY: () => this.fundo.moveY(),
            render: (ctx) => this.fundo.render(ctx)
        };
        const iSpritePerson: ISprite = {
            moveX: () => this.person.moveX(),
            moveY: () => this.person.moveY(),
            render: (ctx) => this.person.render(ctx)
        };
        const iSpriteInimigo: ISprite = {
            moveX: () => this.inimigo.moveX(),
            moveY: () => this.inimigo.moveY(),
            render: (ctx) => this.inimigo.render(ctx)
        };
        const iSpriteBolinha: ISprite = {
            moveX: () => this.bolinha.moveX(),
            moveY: () => this.bolinha.moveY(),
            render: (ctx) => this.bolinha.render(ctx)
        };

        // cria os layers da cena
        const layerList: SimpleSceneLayer[] = [
            new SimpleSceneLayer(0, 0, [iSpriteFundo]),
            new SimpleSceneLayer(0, 0, [iSpritePerson, iSpriteInimigo, iSpriteBolinha])
        ];

        // adiciona os layers na cena
        this.base = new SimpleScene(layerList);

    }

    /**********************************************************/
    /** MÉTODOS GAMELOOP*/
    /**********************************************************/

    public update(): void {
        this.handleInput();

        this.base.moveX();
        this.checkCollisionsX();
        this.base.moveY();
        this.checkCollisionsY();

    }

    public render(ctx: CanvasRenderingContext2D): void {
        this.base.render(ctx);

    }

    /**********************************************************/
    /** OUTROS MÉTODOS */
    /**********************************************************/

    public handleInput(): void {
        this.person.speedX = 0;
        this.person.speedY = 0;
        this.person.currentFrame = 8; // parada
        if (IM.isKeyDown("ArrowUp")) {
            this.person.speedY = -this.person.speedBase;
            this.person.currentFrame = 1; // cima
            if (IM.isKeyDown("ArrowRight")) {
                this.person.speedX = this.person.speedBase;
                this.person.currentFrame = 2; // cima direita
            } else if (IM.isKeyDown("ArrowLeft")) {
                this.person.speedX = -this.person.speedBase;
                this.person.currentFrame = 0; // cima esquerda
            }
        }
        else if (IM.isKeyDown("ArrowDown")) {
            this.person.speedY = this.person.speedBase;
            this.person.currentFrame = 5; // baixo
            if (IM.isKeyDown("ArrowRight")) {
                this.person.speedX = this.person.speedBase;
                this.person.currentFrame = 4; // baixo direita
            } else if (IM.isKeyDown("ArrowLeft")) {
                this.person.speedX = -this.person.speedBase;
                this.person.currentFrame = 6; // baixo esquerda
            }
        }
        else if (IM.isKeyDown("ArrowLeft")) {
            this.person.speedX = -this.person.speedBase;
            this.person.currentFrame = 7; // esquerda
        }
        else if (IM.isKeyDown("ArrowRight")) {
            this.person.speedX = this.person.speedBase;
            this.person.currentFrame = 3; // direita
        }
    }

    public checkCollisionsX(): void {
        if ((this.person.getPosX() + this.person.getWidth()) > (640 << 8)) this.person.setPosX((640 << 8) - this.person.getWidth());
    }
    public checkCollisionsY(): void {
        if (this.person.getPosY() < 0) this.person.setPosY(0);
        if ((this.person.getPosY() + this.person.getHeight()) > (480 << 8)) this.person.setPosY((480 << 8) - this.person.getHeight());
    }
}