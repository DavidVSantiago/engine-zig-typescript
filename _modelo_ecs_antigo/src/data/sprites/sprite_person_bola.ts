import * as Mundo from '../../core/mundo';
import * as Res from '../resources';

// Declaração das variáveis globais
export let BOLA: number;
export let FAIXA_A: number;
export let FAIXA_B: number;
export let PARADA: number;
export let CIMA: number;
export let BAIXO: number;
export let DIR: number;
export let ESQ: number;
export let DIR_CIMA: number;
export let DIR_BAIXO: number;
export let ESQ_CIMA: number;
export let ESQ_BAIXO: number;

// Inicialização dos recursos
export function init(): void {
    // 1. Carrega a textura inteira para a memória/GPU uma única vez
    const idSpritesheet = Mundo.loadImage('imgs/sprite_person_bola.png'); // assumindo que a pasta base no cliente seja public/

    // 2. Define os recortes (Mundo.defineSprite(idTextura, sourceX, sourceY, sourceWidth, sourceHeight))
    // Os valores (x, y) abaixo são apenas EXMPLOS. Você precisará ajustar os multiplicadores (0, 1, 2...)
    // de acordo com a posição de cada animação dentro do arquivo sprite_person_bola.png
    PARADA = Mundo.defineSprite(idSpritesheet, 300, 100, 100, 100, 100, 100);
    BAIXO = Mundo.defineSprite(idSpritesheet, 0, 100, 100, 100, 100, 100);
    CIMA = Mundo.defineSprite(idSpritesheet, 100, 0, 100, 100, 100, 100);
    DIR = Mundo.defineSprite(idSpritesheet, 300, 0, 100, 100, 100, 100);
    ESQ = Mundo.defineSprite(idSpritesheet, 200, 100, 100, 100, 100, 100);

    // Animações diagonais (se aplicável na spritesheet, senão podem reutilizar as normais)
    DIR_BAIXO = Mundo.defineSprite(idSpritesheet, 400, 0, 100, 100, 100, 100);
    DIR_CIMA = Mundo.defineSprite(idSpritesheet, 200, 0, 100, 100, 100, 100);
    ESQ_BAIXO = Mundo.defineSprite(idSpritesheet, 100, 100, 100, 100, 100, 100);
    ESQ_CIMA = Mundo.defineSprite(idSpritesheet, 0, 0, 100, 100, 100, 100);

    BOLA = Mundo.defineSprite(idSpritesheet, 400, 100, 30, 30, 30, 30)

    FAIXA_A = Mundo.defineSprite(idSpritesheet, 430, 100, 1, 1, 5, Res.altura_tela)
    FAIXA_B = Mundo.defineSprite(idSpritesheet, 430, 100, 1, 1, 5, Res.altura_tela)
}