import { GameScene } from "./scenes/game_scene";

// 1. Pega o Canvas do HTML
const canvas = document.getElementById("gameCanvas") as HTMLCanvasElement;
const ctx = canvas.getContext("2d")!;

// 2. Variáveis Globais de Estado
let lastTime = 0;
let currentScene: GameScene;

// 3. Função Inicial (Assíncrona para permitir o carregamento das imagens)
async function start() {
    console.log("Iniciando Engine...");
    currentScene = new GameScene();
    await currentScene.init();

    // Dá a largada no Game Loop
    requestAnimationFrame(gameLoop);
}

// 4. O Coração da Engine (Roda 60x por segundo)
function gameLoop(timestamp: number) {
    const deltaTime = (timestamp - lastTime) / 1000;
    lastTime = timestamp;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    currentScene.update(deltaTime);
    currentScene.render(ctx);

    requestAnimationFrame(gameLoop);
}

// Escuta teclado e repassa para a Cena Atual (O Cliente) tratar
window.addEventListener("keydown", (e) => {
    currentScene.handleInput(e);
});

// Começa tudo!
start();
