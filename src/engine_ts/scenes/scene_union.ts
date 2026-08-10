import { GameScene } from "../../game_ts/scenes/game_scene";
import { LoadingScene } from "../../game_ts/scenes/loading_scene";

export type SceneUnion =
    | { type: 'Game', scene: GameScene }
    | { type: 'Loading', scene: LoadingScene };
