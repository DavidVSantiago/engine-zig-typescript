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

    engine.setLoadingScene({
        init: () => loadingScene.init(),
        update: () => loadingScene.update(),
        render: (ctx) => loadingScene.render(ctx),
    });

    // define a cena inicial(passando os ponteiros para as funções)
    engine.setScene({
        init: () => gameScene.init(),
        update: () => gameScene.update(),
        render: (ctx) => gameScene.render(ctx),
    });

    // inicia engine
    engine.startGame();
}

startGame();