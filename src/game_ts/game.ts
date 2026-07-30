import { Engine } from "../engine_ts/engine";
import { GameScene } from "./scenes/game_scene";
import { SplashScene } from "./scenes/splash_scene";

async function startGame() {
    // cria a cena inicial e carrega todos os seus assets em memória
    const startScene = new SplashScene();
    await startScene.init();

    // cria engine
    const engine = new Engine();

    // define a cena (passando os ponteiros para as funções)
    engine.setScene({
        update: () => startScene.update(),
        render: (ctx) => startScene.render(ctx),
    });

    // inicia engine
    engine.startGame();
}

startGame();