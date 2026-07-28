/**  Requisitos das márcaras para acessar os componentes das entidades*/
export const COMP_POSICAO = 1n << 0n;     // 00000001
export const COMP_VELOCIDADE = 1n << 1n;  // 00000010
export const COMP_COLISOR = 1n << 2n;     // 00000100
export const COMP_VISUAL = 1n << 3n;      // 00001000
export const COMP_CONTROLE = 1n << 4n;    // 00010000

// TAGS identificadoras
export const TAG_JOGADOR = 1n << 5n;      // 00100000
export const TAG_INIMIGO = 1n << 6n;      // 00100000
export const TAG_BOLA = 1n << 7n;         // 01000000

export const REQUISITO_MOVIMENTO = COMP_POSICAO | COMP_VELOCIDADE;              // 00000011
export const REQUISITO_COLISAO = COMP_POSICAO | COMP_VELOCIDADE | COMP_COLISOR; // 00000111
export const REQUISITO_RENDER = COMP_POSICAO | COMP_VISUAL;                     // 00001101
export const REQUISITO_TECLAS = COMP_VELOCIDADE | COMP_VISUAL | COMP_CONTROLE;  // 00011010

export const REQUISITO_COLISAO_JOGADOR = REQUISITO_COLISAO | TAG_JOGADOR;       // 00100111
export const REQUISITO_COLISAO_INIMIGO = REQUISITO_COLISAO | TAG_INIMIGO;       // 01000111
export const REQUISITO_COLISAO_BOLA = REQUISITO_COLISAO | TAG_BOLA;             // 10000111