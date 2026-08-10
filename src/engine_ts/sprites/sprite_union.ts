import { SingleSprite } from "./single_sprite";
import { MultiSprite } from "./multi_sprite";

export type SpriteUnion = 
    | { type: 'Single', sprite: SingleSprite }
    | { type: 'Multi', sprite: MultiSprite };
