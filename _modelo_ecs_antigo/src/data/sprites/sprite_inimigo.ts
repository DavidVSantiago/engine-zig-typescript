import * as Mundo from '../../core/mundo';

export let PARADA: number;
export let CIMA: number;
export let BAIXO: number;
export let DIR: number;
export let ESQ: number;
export let DIR_CIMA: number;
export let DIR_BAIXO: number;
export let ESQ_CIMA: number;
export let ESQ_BAIXO: number;

export function init(): void {
    const idSpritesheet = Mundo.loadImage('imgs/sprite_inimigo.png');

    PARADA = Mundo.defineSprite(idSpritesheet, 300, 100, 100, 100, 100, 100);
    BAIXO = Mundo.defineSprite(idSpritesheet, 0, 100, 100, 100, 100, 100);
    CIMA = Mundo.defineSprite(idSpritesheet, 100, 0, 100, 100, 100, 100);
    DIR = Mundo.defineSprite(idSpritesheet, 300, 0, 100, 100, 100, 100);
    ESQ = Mundo.defineSprite(idSpritesheet, 200, 100, 100, 100, 100, 100);

    DIR_BAIXO = Mundo.defineSprite(idSpritesheet, 400, 0, 100, 100, 100, 100);
    DIR_CIMA = Mundo.defineSprite(idSpritesheet, 200, 0, 100, 100, 100, 100);
    ESQ_BAIXO = Mundo.defineSprite(idSpritesheet, 100, 100, 100, 100, 100, 100);
    ESQ_CIMA = Mundo.defineSprite(idSpritesheet, 0, 0, 100, 100, 100, 100);
}