// Valores de tela
export let canvas: HTMLCanvasElement;
export let ctx: CanvasRenderingContext2D;
export let largura_tela: number;
export let altura_tela: number;

export function init(): void {
    // Inicialização da tela
    canvas = document.getElementById('gameCanvas') as HTMLCanvasElement;
    ctx = canvas.getContext('2d') as CanvasRenderingContext2D;
    largura_tela = canvas.width << 8;
    altura_tela = canvas.height << 8;
}
