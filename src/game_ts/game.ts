import { engine } from "../engine_ts/engine";
import { GameScene } from "./scenes/game_scene";
import { LoadingScene } from "./scenes/loading_scene";

async function startGame() {
    // cria a cena inicial e carrega todos os seus assets em memória
    const loadingScene = new LoadingScene();
    await loadingScene.init();

    // cria a cena inicial e carrega todos os seus assets em memória
    const gameScene = new GameScene();
    await gameScene.init();

    engine.init(); // obrigatório chamar antes de usar engine

    engine.setLoadingScene({ type: 'Loading', scene: loadingScene });

    // define a cena inicial
    engine.setScene({ type: 'Game', scene: gameScene });

    // inicia engine
    engine.startGame();
}

startGame();