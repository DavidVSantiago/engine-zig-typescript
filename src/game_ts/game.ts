import { Engine } from "../engine_ts/engine";
import { GameScene } from "./scenes/game_scene";

async function startGame() {
    // cria a cena e carrega todos os seus assets em memória
    const gameScene = new GameScene();
    await gameScene.init();

    // cria engine
    const engine = new Engine();

    // define a cena
    engine.setScene({
        init: () => gameScene.init(),
        update: () => gameScene.update(),
        render: (ctx) => gameScene.render(ctx),
    });

    // inicia engine
    engine.startGame();
}

startGame();