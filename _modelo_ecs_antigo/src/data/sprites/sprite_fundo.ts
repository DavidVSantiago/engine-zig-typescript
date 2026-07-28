import * as Mundo from '../../core/mundo';

export let IMG: number;

export function init(): void {
    const idSpritesheet = Mundo.loadImage('imgs/bg.png');
    IMG = Mundo.defineSprite(idSpritesheet, 0, 0, 640, 480, 640, 480);
}