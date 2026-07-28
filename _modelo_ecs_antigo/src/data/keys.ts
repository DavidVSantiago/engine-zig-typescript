/** Estado do teclado */
export type States = {
    cima: boolean,
    baixo: boolean,
    esquerda: boolean,
    direita: boolean,
}

// Pega os inputs (você já tem os listeners de window.addEventListener)
export const input: States = { cima: false, baixo: false, esquerda: false, direita: false };

window.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowUp') input.cima = true;
    if (e.key === 'ArrowDown') input.baixo = true;
    if (e.key === 'ArrowLeft') input.esquerda = true;
    if (e.key === 'ArrowRight') input.direita = true;
});
window.addEventListener('keyup', (e) => {
    if (e.key === 'ArrowUp') input.cima = false;
    if (e.key === 'ArrowDown') input.baixo = false;
    if (e.key === 'ArrowLeft') input.esquerda = false;
    if (e.key === 'ArrowRight') input.direita = false;
});