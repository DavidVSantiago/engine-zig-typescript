import * as Mundo from './core/mundo'
import * as Engine from './core/engine'
import * as SoA from './data/soa'
import * as Reqs from './data/reqs'
import * as Res from './data/resources'
import * as Spr_person_bola from './data/sprites/sprite_person_bola'
import * as Spr_inimigo from './data/sprites/sprite_inimigo'
import * as Spr_fundo from './data/sprites/sprite_fundo'
import * as Sistemas from './sistemas'

// *******************************************************************
// O NASCIMENTO DO JOGO
// *******************************************************************

const TICK_RATE = 1000 / 60; // 60 FPS da Física (16.666ms por frame)
let tempoAnterior = 0;
let acumulador = 0;

function gameloop(tempoAtual: number) {
    requestAnimationFrame(gameloop);

    // para o primeiro quadro, em que tempoAnterior == 0
    if (!tempoAnterior) tempoAnterior = tempoAtual;

    let deltaTime = tempoAtual - tempoAnterior;
    tempoAnterior = tempoAtual;

    // Trava de segurança (Evita a "espiral da morte" caso a aba seja minimizada)
    if (deltaTime > 250) deltaTime = 250;

    acumulador += deltaTime;

    // Consome o acumulador executando a Lógica em blocos fixos
    while (acumulador >= TICK_RATE) {
        Engine.atualizarLogica();
        acumulador -= TICK_RATE;
    }

    // Após processar toda a física devida, renderiza na tela (apenas 1x)
    Engine.atualizarRender();

}

/* cria as entidades */
function criaEntidades() {

    // fundo 0
    const fundoId = Mundo.criarEntidade();
    const mascaraFundo = Reqs.COMP_POSICAO | Reqs.COMP_VELOCIDADE | Reqs.COMP_VISUAL | Reqs.COMP_COLISOR;
    Mundo.addCompMask(fundoId, mascaraFundo);
    Mundo.comps[SoA.ID_POS_X][fundoId] = 0;
    Mundo.comps[SoA.ID_POS_Y][fundoId] = 0;
    Mundo.comps[SoA.ID_SPRITE][fundoId] = Spr_fundo.IMG; // indice do sprite inicial

    // faixas 1 e 2
    const faixaAId = Mundo.criarEntidade();
    const faixaBId = Mundo.criarEntidade();
    const mascaraFaixas = Reqs.COMP_POSICAO | Reqs.COMP_VISUAL;
    Mundo.addCompMask(faixaAId, mascaraFaixas);
    Mundo.addCompMask(faixaBId, mascaraFaixas);
    Mundo.comps[SoA.ID_POS_X][faixaAId] = 420 << 8;
    Mundo.comps[SoA.ID_POS_X][faixaBId] = 215 << 8;
    Mundo.comps[SoA.ID_POS_Y][faixaAId] = 0;
    Mundo.comps[SoA.ID_POS_Y][faixaBId] = 0;
    Mundo.comps[SoA.ID_SPRITE][faixaAId] = Spr_person_bola.FAIXA_A; // indice do sprite inicial
    Mundo.comps[SoA.ID_SPRITE][faixaBId] = Spr_person_bola.FAIXA_B; // indice do sprite inicial

    // jogador 3
    const jogadorId = Mundo.criarEntidade();
    const mascaraJogador = Reqs.COMP_POSICAO | Reqs.COMP_VELOCIDADE | Reqs.COMP_VISUAL | Reqs.COMP_CONTROLE | Reqs.COMP_COLISOR | Reqs.TAG_JOGADOR;
    Mundo.addCompMask(jogadorId, mascaraJogador);
    Mundo.comps[SoA.ID_RAIO][jogadorId] = 50 << 8;
    Mundo.comps[SoA.ID_POS_X][jogadorId] = 440 << 8;
    Mundo.comps[SoA.ID_POS_Y][jogadorId] = (Res.altura_tela >> 1) - Mundo.comps[SoA.ID_RAIO][jogadorId];
    Mundo.comps[SoA.ID_VEL_BASE][jogadorId] = 3 << 8;
    Mundo.comps[SoA.ID_SPRITE][jogadorId] = Spr_person_bola.PARADA; // indice do sprite inicial

    // bola 4
    const bolaId = Mundo.criarEntidade();
    const mascaraBola = Reqs.COMP_POSICAO | Reqs.COMP_VELOCIDADE | Reqs.COMP_VISUAL | Reqs.COMP_COLISOR | Reqs.TAG_BOLA;
    Mundo.addCompMask(bolaId, mascaraBola);
    Mundo.comps[SoA.ID_RAIO][bolaId] = 15 << 8;
    Mundo.comps[SoA.ID_POS_X][bolaId] = 300 << 8;
    Mundo.comps[SoA.ID_POS_Y][bolaId] = (Res.altura_tela >> 1) - Mundo.comps[SoA.ID_RAIO][bolaId];
    Mundo.comps[SoA.ID_VEL_BASE][bolaId] = 3 << 8;
    Mundo.comps[SoA.ID_VEL_X][bolaId] = Mundo.comps[SoA.ID_VEL_BASE][bolaId];
    Mundo.comps[SoA.ID_VEL_Y][bolaId] = Mundo.comps[SoA.ID_VEL_BASE][bolaId];
    Mundo.comps[SoA.ID_SPRITE][bolaId] = Spr_person_bola.BOLA;

    // inimigo 5
    const inimigoId = Mundo.criarEntidade();
    const mascaraInimigo = Reqs.COMP_POSICAO | Reqs.COMP_VELOCIDADE | Reqs.COMP_VISUAL | Reqs.COMP_COLISOR | Reqs.TAG_INIMIGO;
    Mundo.addCompMask(inimigoId, mascaraInimigo);
    Mundo.comps[SoA.ID_RAIO][inimigoId] = 50 << 8;
    Mundo.comps[SoA.ID_POS_X][inimigoId] = 100 << 8;
    Mundo.comps[SoA.ID_POS_Y][inimigoId] = (Res.altura_tela >> 1) - Mundo.comps[SoA.ID_RAIO][inimigoId];
    Mundo.comps[SoA.ID_VEL_BASE][inimigoId] = 3 << 8;
    Mundo.comps[SoA.ID_SPRITE][inimigoId] = Spr_inimigo.PARADA; // indice do sprite inicial
}

function initGame() {
    Res.init(); // inicializa os recursos e constantes de tela
    Mundo.init(1000); // inicializa o mundo com o máx. de entidades
    Spr_person_bola.init();
    Spr_inimigo.init();
    Spr_fundo.init();

    // inicialização dos sistemas de Lógica (Física)
    Engine.adicionarSistemaLogica(Sistemas.verificaTeclas);
    Engine.adicionarSistemaLogica(Sistemas.move);
    Engine.adicionarSistemaLogica(Sistemas.checaColisoes);

    // inicialização dos sistemas Visuais (Render)
    Engine.adicionarSistemaRender(Sistemas.render);

    /* inicialização do SoA */
    SoA.init(1000); // aloca os SoAs com o max de 1000 entidades
    // registra das um dos SoAs no Mundo
    Mundo.registraComp(SoA.ID_POS_X, SoA.posX);
    Mundo.registraComp(SoA.ID_POS_Y, SoA.posY);
    Mundo.registraComp(SoA.ID_VEL_X, SoA.velX);
    Mundo.registraComp(SoA.ID_VEL_Y, SoA.velY);
    Mundo.registraComp(SoA.ID_RAIO, SoA.raio);
    Mundo.registraComp(SoA.ID_COR, SoA.cor);
    Mundo.registraComp(SoA.ID_VEL_BASE, SoA.velBase);
    Mundo.registraComp(SoA.ID_SPRITE, SoA.sprite);

    criaEntidades();

    requestAnimationFrame(gameloop); //inicia a simulação
}

initGame();