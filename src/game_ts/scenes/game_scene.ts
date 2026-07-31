import { SimpleScene } from "../../engine_ts/scenes/simple_scene";
import { SimpleSceneLayer } from "../../engine_ts/scenes/simple_scene_layer";
import { MultiSprite } from "../../engine_ts/sprites/multi_sprite";
import { SingleSprite } from "../../engine_ts/sprites/single_sprite";
import { AssetManager } from "../../engine_ts/utils/asset_manager";
import { InputManager as IM } from "../../engine_ts/utils/input_manager";
import { ISprite } from "../../engine_ts/sprites/i_sprite";
import { engine } from "../../engine_ts/engine";
import { timer } from "../../engine_ts/utils/timer";

export class GameScene {
    public readonly type = 'Game';

    public base!: SimpleScene;

    public fundo!: SingleSprite;
    public faixa_E!: SingleSprite;
    public faixa_D!: SingleSprite;
    public person!: MultiSprite;
    public inimigo!: MultiSprite;
    public bolinha!: MultiSprite;
    public agendou = false;
    public readonly LIMITE_DIREITO = 420 << 8;
    public readonly LIMITE_ESQUERDO = 220 << 8;

    public async init() {
        // carrega os sprites
        const spriteList_01: SingleSprite[] = await AssetManager.loadSingleSprites([
            'sprites/fundo.spr',
            'sprites/faixa.spr',
            'sprites/faixa.spr'
        ]);
        const spriteList_02: MultiSprite[] = await AssetManager.loadMultiSprites([
            'sprites/person.spr',
            'sprites/inimigo.spr',
            'sprites/bolinha.spr'
        ]);
        // armazena as refs dos sprites
        this.fundo = spriteList_01[0];
        this.faixa_E = spriteList_01[1];
        this.faixa_D = spriteList_01[2];
        this.person = spriteList_02[0];
        this.inimigo = spriteList_02[1];
        this.bolinha = spriteList_02[2];

        // faz ajustes no estado inicial dos sprites
        this.faixa_E.setPosX(this.LIMITE_ESQUERDO);
        this.faixa_D.setPosX(this.LIMITE_DIREITO - (this.faixa_D.getDrawWidth()));

        this.person.currentFrame = 8;
        this.person.setSpeedBase(3 << 8); // 3 pixels por tick (já em fixed-point)
        this.person.setPosX(490 << 8);
        this.person.setPosY(190 << 8);
        this.inimigo.currentFrame = 8;
        this.inimigo.setSpeedBase(3 << 8); // 3 pixels por tick (já em fixed-point)

        // cria os VTable's dos sprites
        const iSpriteFundo: ISprite = {
            moveX: () => this.fundo.moveX(),
            moveY: () => this.fundo.moveY(),
            render: (ctx) => this.fundo.render(ctx)
        };
        const iSpriteFaixa_E: ISprite = {
            moveX: () => this.faixa_E.moveX(),
            moveY: () => this.faixa_E.moveY(),
            render: (ctx) => this.faixa_E.render(ctx)
        };
        const iSpriteFaixa_D: ISprite = {
            moveX: () => this.faixa_D.moveX(),
            moveY: () => this.faixa_D.moveY(),
            render: (ctx) => this.faixa_D.render(ctx)
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
            new SimpleSceneLayer(0, 0, [iSpriteFundo, iSpriteFaixa_E, iSpriteFaixa_D]),
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

        // if (!this.agendou) {
        //     this.agendou = true;
        //     timer.start(120, () => {
        //         const nextScene = new GameScene();
        //         engine.changeScene(nextScene, 60);
        //     });
        // }
    }

    public render(ctx: CanvasRenderingContext2D): void {
        this.base.render(ctx);

    }

    /**********************************************************/
    /** OUTROS MÉTODOS */
    /**********************************************************/

    public handleInput(): void {
        this.person.setSpeedX(0);
        this.person.setSpeedY(0);
        this.person.currentFrame = 8; // parada
        if (IM.isKeyDown("ArrowUp")) {
            this.person.setSpeedY(-this.person.getSpeedBase());
            this.person.currentFrame = 1; // cima
            if (IM.isKeyDown("ArrowRight")) {
                this.person.setSpeedX(this.person.getSpeedBase());
                this.person.currentFrame = 2; // cima direita
            } else if (IM.isKeyDown("ArrowLeft")) {
                this.person.setSpeedX(-this.person.getSpeedBase());
                this.person.currentFrame = 0; // cima esquerda
            }
        }
        else if (IM.isKeyDown("ArrowDown")) {
            this.person.setSpeedY(this.person.getSpeedBase());
            this.person.currentFrame = 5; // baixo
            if (IM.isKeyDown("ArrowRight")) {
                this.person.setSpeedX(this.person.getSpeedBase());
                this.person.currentFrame = 4; // baixo direita
            } else if (IM.isKeyDown("ArrowLeft")) {
                this.person.setSpeedX(-this.person.getSpeedBase());
                this.person.currentFrame = 6; // baixo esquerda
            }
        }
        else if (IM.isKeyDown("ArrowLeft")) {
            this.person.setSpeedX(-this.person.getSpeedBase());
            this.person.currentFrame = 7; // esquerda
        }
        else if (IM.isKeyDown("ArrowRight")) {
            this.person.setSpeedX(this.person.getSpeedBase());
            this.person.currentFrame = 3; // direita
        }
    }

    public checkCollisionsX(): void {
        if ((this.person.getPosX() + this.person.getWidth()) > (640 << 8)) this.person.setPosX((640 << 8) - this.person.getWidth());

        // colisão do jogador com o limite direito do campo ------------------------------
        if (this.person.getPosX() <= this.LIMITE_DIREITO) {
            this.person.setPosX(this.LIMITE_DIREITO);
        } ''
    }
    public checkCollisionsY(): void {
        if (this.person.getPosY() < 0) this.person.setPosY(0);
        if ((this.person.getPosY() + this.person.getHeight()) > (480 << 8)) this.person.setPosY((480 << 8) - this.person.getHeight());
    }
}