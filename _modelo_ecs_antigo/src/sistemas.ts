import * as Mundo from './core/mundo'
import * as SoA from './data/soa'
import * as Reqs from './data/reqs'
import * as Res from './data/resources'
import * as Sprites from './data/sprites/sprite_person_bola'
import * as Keys from './data/keys'

// *******************************************************************
// SISTEMAS DO GAMELOOP
// *******************************************************************

/** muda a velocidade com base no pressionamento das teclas */
export function verificaTeclas() {

    /* percorre cada uma das entidades */
    for (let id = 0; id < Mundo.entidadesAtivas; id++) {
        // se não houver os requisitos para a entidade atual, pula para a próxima entidade
        if ((Mundo.mascaras[id] & Reqs.REQUISITO_TECLAS) != Reqs.REQUISITO_TECLAS) continue;

        const velocidade = SoA.velBase[id];

        SoA.velX[id] = 0;
        SoA.velY[id] = 0;
        SoA.sprite[id] = Sprites.PARADA; // padrão

        if (Keys.input.cima) { // se a tecla para cima estiver pressionada
            SoA.velY[id] = -velocidade;
            SoA.sprite[id] = Sprites.CIMA; // Padrão se for só cima
            if (Keys.input.direita) {
                SoA.velX[id] = velocidade;
                SoA.sprite[id] = Sprites.DIR_CIMA;
            }
            if (Keys.input.esquerda) {
                SoA.velX[id] = -velocidade;
                SoA.sprite[id] = Sprites.ESQ_CIMA;
            }
        } else if (Keys.input.baixo) { // se a tecla para baixo estiver pressionada
            SoA.velY[id] = velocidade;
            SoA.sprite[id] = Sprites.BAIXO; // Padrão se for só baixo
            if (Keys.input.direita) {
                SoA.velX[id] = velocidade;
                SoA.sprite[id] = Sprites.DIR_BAIXO;
            }
            if (Keys.input.esquerda) {
                SoA.velX[id] = -velocidade;
                SoA.sprite[id] = Sprites.ESQ_BAIXO;
            }
        } else if (Keys.input.esquerda) { // se a tecla para esquerda estiver pressionada
            SoA.velX[id] = -velocidade;
            SoA.sprite[id] = Sprites.ESQ;
        } else if (Keys.input.direita) { // se a tecla para direita estiver pressionada
            SoA.velX[id] = velocidade;
            SoA.sprite[id] = Sprites.DIR;
        }
    }
}

/** move a bola com base na velocidade */
export function move() {

    for (let id = 0; id < Mundo.entidadesAtivas; id++) {
        if ((Mundo.mascaras[id] & Reqs.REQUISITO_MOVIMENTO) != Reqs.REQUISITO_MOVIMENTO) continue;
        SoA.posX[id] += SoA.velX[id];
        SoA.posY[id] += SoA.velY[id];
    }
}

/** checa as colisões dos elementos */
export function checaColisoes() {

    for (let id = 0; id < Mundo.entidadesAtivas; id++) {
        if ((Mundo.mascaras[id] & Reqs.REQUISITO_COLISAO) != Reqs.REQUISITO_COLISAO) continue;

        const diametro = SoA.raio[id] * 2;

        if (SoA.posX[id] + diametro >= Res.largura_tela) {
            SoA.posX[id] = Res.largura_tela - diametro;
        }
        if (SoA.posX[id] <= 0) {
            SoA.posX[id] = 0;
        }
        if (SoA.posY[id] + diametro >= Res.altura_tela) {
            SoA.posY[id] = Res.altura_tela - diametro;
        }
        if (SoA.posY[id] <= 0) {
            SoA.posY[id] = 0;
        }
        if ((Mundo.mascaras[id] & Reqs.REQUISITO_COLISAO_JOGADOR) == Reqs.REQUISITO_COLISAO_JOGADOR) {
            if (SoA.posX[id] < 420 << 8) SoA.posX[id] = 420 << 8;
        }
        if ((Mundo.mascaras[id] & Reqs.REQUISITO_COLISAO_INIMIGO) == Reqs.REQUISITO_COLISAO_INIMIGO) {
            if (SoA.posX[id] > (220 << 8) - (SoA.raio[id] << 1)) SoA.posX[id] = (220 << 8) - (SoA.raio[id] << 1);
        }
    }
}

/** renderiza os elementos */
export function render() {

    // Res.ctx.fillStyle = 'lightgray';
    // Res.ctx.fillRect(0, 0, Res.largura_tela >> 8, Res.altura_tela >> 8); // desenha o fundo da tela (volta para pixels)
    for (let id = 0; id < Mundo.entidadesAtivas; id++) {
        if ((Mundo.mascaras[id] & Reqs.REQUISITO_RENDER) != Reqs.REQUISITO_RENDER) continue;

        const defSprite = Mundo.sprites[SoA.sprite[id]]; // obtém os metadados do sprite (recorte) da entidade

        if (defSprite) {
            const texture = Mundo.textures[defSprite.idImagem]; // obtém a textura carregada para o sprite

            // Verifica se a imagem já foi carregada
            if (texture && texture.complete) {
                Res.ctx.drawImage(
                    texture,
                    defSprite.sx, defSprite.sy, defSprite.sw, defSprite.sh, // área de origem na spritesheet
                    SoA.posX[id] >> 8, SoA.posY[id] >> 8, defSprite.dw, defSprite.dh // área de destino na tela (em pixels)
                );
            } else {
                // Fallback: desenha um quadrado se a imagem não existir ou estiver carregando
                Res.ctx.fillStyle = '#' + SoA.cor[id].toString(16).padStart(6, '0');
                Res.ctx.fillRect(
                    SoA.posX[id] >> 8,
                    SoA.posY[id] >> 8,
                    defSprite.sw,
                    defSprite.sh
                );
            }
        }
    }
}

