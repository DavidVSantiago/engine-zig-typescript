import { SimpleScene } from "../../engine_ts/scenes/simple_scene";
import { SimpleSceneLayer } from "../../engine_ts/scenes/simple_scene_layer";
import { MultiSprite } from "../../engine_ts/sprites/multi_sprite";
import { SingleSprite } from "../../engine_ts/sprites/single_sprite";
import { AssetManager } from "../../engine_ts/utils/asset_manager";
import { InputManager as IM } from "../../engine_ts/utils/input_manager";
import { SpriteUnion } from "../../engine_ts/sprites/sprite_union";
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
        this.inimigo.setSpeedBase(3 << 8); // 3 pixels por tick (já em fixed-point)
        this.inimigo.currentFrame = 8;
        this.bolinha.setSpeedBase(5 << 8);
        this.bolinha.setSpeedX(this.bolinha.getSpeedBase() >> 1);
        this.bolinha.setSpeedY(this.bolinha.getSpeedBase() >> 1);
        this.bolinha.setPosX((320 << 8) - (this.bolinha.getWidth() >> 1));
        this.bolinha.setPosY((240 << 8) - (this.bolinha.getWidth() >> 1));

        // cria as tags da união dos sprites
        const uFundo: SpriteUnion = { type: 'Single', sprite: this.fundo };
        const uFaixa_E: SpriteUnion = { type: 'Single', sprite: this.faixa_E };
        const uFaixa_D: SpriteUnion = { type: 'Single', sprite: this.faixa_D };
        
        const uPerson: SpriteUnion = { type: 'Multi', sprite: this.person };
        const uInimigo: SpriteUnion = { type: 'Multi', sprite: this.inimigo };
        const uBolinha: SpriteUnion = { type: 'Multi', sprite: this.bolinha };

        // cria os layers da cena
        const layerList: SimpleSceneLayer[] = [
            new SimpleSceneLayer(0, 0, [uFundo, uFaixa_E, uFaixa_D]),
            new SimpleSceneLayer(0, 0, [uPerson, uInimigo, uBolinha])
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

        // Colisões entre entidades (radiais, que dependem de X e Y simultaneamente)
        this.checkCollisionsEntities();

        // if (!this.agendou) {
        //     this.agendou = true;
        //     timer.start(120, () => {
        //         const nextScene = new GameScene();
        //         engine.changeScene(nextScene, 60);
        //     });
        // }
    }

    public render(ctx: CanvasRenderingContext2D, alpha: number): void {
        this.base.render(ctx, alpha);

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
        // colisão do jogador com o lado direito da tela
        if ((this.person.getPosX() + this.person.getWidth()) > (640 << 8)) this.person.setPosX((640 << 8) - this.person.getWidth());

        // colisão do jogador com o limite direito do campo ------------------------------
        if (this.person.getPosX() <= this.LIMITE_DIREITO) {
            this.person.setPosX(this.LIMITE_DIREITO);
        }

        // colisão da bolinha com os lados dir. e esq. da tela ------------------------------
        if (this.bolinha.getPosX() < 0) {
            this.bolinha.setPosX(0);
            this.bolinha.setSpeedX(Math.abs(this.bolinha.getSpeedX())); // garante que a velocidade seja positiva
        } else if ((this.bolinha.getPosX() + this.bolinha.getWidth()) > (640 << 8)) {
            this.bolinha.setPosX((640 << 8) - this.bolinha.getWidth());
            this.bolinha.setSpeedX(-Math.abs(this.bolinha.getSpeedX())); // garante que a velocidade seja negativa
        }
    }
    public checkCollisionsY(): void {
        if (this.person.getPosY() < 0) this.person.setPosY(0);
        if ((this.person.getPosY() + this.person.getHeight()) > (480 << 8)) this.person.setPosY((480 << 8) - this.person.getHeight());

        // colisão da bolinha com os lados sup. e inf. da tela ------------------------------
        if (this.bolinha.getPosY() < 0) {
            this.bolinha.setPosY(0);
            this.bolinha.setSpeedY(Math.abs(this.bolinha.getSpeedY()));
        } else if ((this.bolinha.getPosY() + this.bolinha.getHeight()) > (480 << 8)) {
            this.bolinha.setPosY((480 << 8) - this.bolinha.getHeight());
            this.bolinha.setSpeedY(-Math.abs(this.bolinha.getSpeedY()));
        }
    }

    public checkCollisionsEntities(): void {
        // Assume que a largura e altura são iguais e definem o diâmetro do círculo
        const personRadius = this.person.getWidth() >> 1;
        const bolinhaRadius = this.bolinha.getWidth() >> 1;

        // Ponto central de cada sprite (posição atual + raio)
        const personCenterX = this.person.getPosX() + personRadius;
        const personCenterY = this.person.getPosY() + personRadius;

        const bolinhaCenterX = this.bolinha.getPosX() + bolinhaRadius;
        const bolinhaCenterY = this.bolinha.getPosY() + bolinhaRadius;

        const ladoHorizontal = personCenterX - bolinhaCenterX;
        const ladoVertical = personCenterY - bolinhaCenterY;

        const hipotenusa = Math.sqrt((ladoHorizontal ** 2) + (ladoVertical ** 2));

        const bolinhaVelBase = this.bolinha.getSpeedBase();

        // Se a distância entre os centros for menor que a soma dos raios (Person vs Bolinha)
        if (hipotenusa <= personRadius + bolinhaRadius) {
            // Desfaz o movimento do personagem no tick atual
            this.person.setPosX(this.person.getPosX() - this.person.getSpeedX());
            this.person.setPosY(this.person.getPosY() - this.person.getSpeedY());

            const seno = ladoVertical / hipotenusa;
            const cosseno = ladoHorizontal / hipotenusa;

            // Recalcula as velocidades da bolinha (mantendo o fixed-point 8.8 com Math.round)
            this.bolinha.setSpeedX(Math.round(-bolinhaVelBase * cosseno));
            this.bolinha.setSpeedY(Math.round(-bolinhaVelBase * seno));
        }

        // --- COLISÃO DA BOLINHA COM O INIMIGO ---
        const inimigoRadius = this.inimigo.getWidth() >> 1;
        const inimigoCenterX = this.inimigo.getPosX() + inimigoRadius;
        const inimigoCenterY = this.inimigo.getPosY() + inimigoRadius;

        const ladoHorizontalInimigo = inimigoCenterX - bolinhaCenterX;
        const ladoVerticalInimigo = inimigoCenterY - bolinhaCenterY;

        const hipotenusaInimigo = Math.sqrt((ladoHorizontalInimigo ** 2) + (ladoVerticalInimigo ** 2));

        // Se a distância entre os centros for menor que a soma dos raios (Inimigo vs Bolinha)
        if (hipotenusaInimigo <= inimigoRadius + bolinhaRadius) {
            // Desfaz o movimento do inimigo no tick atual
            this.inimigo.setPosX(this.inimigo.getPosX() - this.inimigo.getSpeedX());
            this.inimigo.setPosY(this.inimigo.getPosY() - this.inimigo.getSpeedY());

            const senoInimigo = ladoVerticalInimigo / hipotenusaInimigo;
            const cossenoInimigo = ladoHorizontalInimigo / hipotenusaInimigo;

            // Recalcula as velocidades da bolinha
            this.bolinha.setSpeedX(Math.round(-bolinhaVelBase * cossenoInimigo));
            this.bolinha.setSpeedY(Math.round(-bolinhaVelBase * senoInimigo));
        }
    }
}