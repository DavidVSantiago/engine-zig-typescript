/* indices de cada componente na matriz de dados (as linhas) */
export const ID_POS_X = 0;
export const ID_POS_Y = 1;
export const ID_VEL_X = 2;
export const ID_VEL_Y = 3;
export const ID_RAIO = 4;
export const ID_COR = 5;
export const ID_VEL_BASE = 6;
export const ID_SPRITE = 7;

// *******************************************************************
// ARRAYS DE DADOS (SoA)
// *******************************************************************

export let posX: Int32Array;
export let posY: Int32Array;
export let velX: Int32Array;
export let velY: Int32Array;
export let raio: Int32Array;
export let cor: Uint32Array;
export let velBase: Int32Array;
export let sprite: Uint8Array; // armazena o id do sprite de renderização de cada entidade

// *******************************************************************
// FUNÇÕES
// *******************************************************************

/** Inicializa os SoA */
export function init(maxEntidades: number) {
    // 2. Criamos os arrays das entidades (Específicos do seu jogo!)
    posX = new Int32Array(maxEntidades);
    posY = new Int32Array(maxEntidades);
    velX = new Int32Array(maxEntidades);
    velY = new Int32Array(maxEntidades);
    raio = new Int32Array(maxEntidades);
    cor = new Uint32Array(maxEntidades).fill(0xFF0000); // 0xFF0000 = vermelho
    velBase = new Int32Array(maxEntidades);
    sprite = new Uint8Array(maxEntidades);
}