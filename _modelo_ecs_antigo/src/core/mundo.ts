let isInitialized = false;

export let maxEntidades = 0;
export let entidadesAtivas = 0;

export let mascaras: BigUint64Array = new BigUint64Array(0);
// A matriz de dados, armazena arrays de entidades para cada atributo
export let comps: any[] = [];
// A matriz de texturas (textures base/spritesheets) carregadas na memória
export let textures: HTMLImageElement[] = [];

/* Estrutura que  */
export interface DefSprite {
    idImagem: number;
    sx: number; // x na spritesheet
    sy: number; // y na spritesheet
    sw: number; // largura do recorte
    sh: number; // altura do recorte
    dw: number; // largura do desenho
    dh: number; // altura do desenho
}

// A matriz de definições de sprites, armazena os recortes
export let sprites: DefSprite[] = [];

// *******************************************************************
// FUNÇÕES DE INICIALIZAÇÃO
// *******************************************************************

/** Construtor */
export function init(max: number) {
    if (isInitialized) throw new Error("[Mundo] Tentativa de inicialização múltipla. O mundo já está rodando.");

    maxEntidades = max;
    entidadesAtivas = 0;
    mascaras = new BigUint64Array(maxEntidades);
    comps = [];
    textures = [];
    sprites = [];

    isInitialized = true;
}

/** Destrutor: Libera a memória e reseta o estado do módulo (útil para reiniciar o jogo) */
export function reset() {
    if (!isInitialized) return; // Aqui o retorno silencioso é aceitável, pois o objetivo já é estar limpo

    maxEntidades = 0;
    entidadesAtivas = 0;
    mascaras = new BigUint64Array(0); // Libera a referência antiga para o Garbage Collector
    comps = [];
    textures = [];
    sprites = [];

    isInitialized = false;
}

// *******************************************************************
// FUNÇÕES
// *******************************************************************

/** Cria uma nova entidade retornando o seu ID (índice transversal) */
export function criarEntidade(): number {
    const id = entidadesAtivas;
    entidadesAtivas++;
    return id;
}

/** Adiciona a flag de bits do componente à máscara da entidade */
export function addCompMask(id: number, componenteBitmask: bigint) {
    mascaras[id] |= componenteBitmask;
}

/** Injeta um array denso de atributos na linha correspondente ao ID do componente */
export function registraComp(idComponente: number, arrayTyped: any) {
    comps[idComponente] = arrayTyped; // Correção da atribuição dos dados
}

/** carrega a imagem (spritesheet) e retorna o ID da textura */
export function loadImage(caminho: string): number {
    const img = new Image();
    img.src = caminho;
    const id = textures.length;
    textures.push(img);
    return id; // Retorna o ID que essa imagem ocupou no array
}

/** registra um novo recorte (sprite) a partir de uma textura já carregada */
export function defineSprite(idImagem: number, sx: number, sy: number, sw: number, sh: number, dw: number, dh: number): number {
    const id = sprites.length;
    sprites.push({ idImagem, sx, sy, sw, sh, dw, dh });
    return id; // Retorna o ID do sprite registrado
}