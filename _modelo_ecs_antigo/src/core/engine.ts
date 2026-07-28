export type Sistema = () => void; /** Modelo das funções a serem recebidas */
export const sistemasLogica: Sistema[] = []; // funções que atualizam o estado do jogo
export const sistemasRender: Sistema[] = []; // funções de renderização

// *******************************************************************
// FUNÇÕES
// *******************************************************************

/** Adiciona função à lista de lógica (executa no tempo fixo) */
export function adicionarSistemaLogica(sistema: Sistema) {
    sistemasLogica.push(sistema);
}

/** Adiciona função à lista de renderização (executa 1x por frame visual) */
export function adicionarSistemaRender(sistema: Sistema) {
    sistemasRender.push(sistema);
}

/** Executa a física e a lógica sequencialmente */
export function atualizarLogica() {
    for (const sistema of sistemasLogica) sistema();
}

/** Executa a renderização sequencialmente */
export function atualizarRender() {
    for (const sistema of sistemasRender) sistema();
}

/** Limpa os sistemas registrados (útil para trocar de cena/fase) */
export function reset() {
    sistemasLogica.length = 0;
    sistemasRender.length = 0;
}