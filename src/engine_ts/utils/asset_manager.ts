import { SimpleSprite } from "../sprites/simple_sprite";
import { Memory } from "./memory";

export class AssetManager {

    public static async loadSprites(jsonPathList: string[]): Promise<SimpleSprite[]> {
        // TODO: carregar todos os jsons
        // TODO: separar os paths das imagens
        // TODO: remover duplicidades nos paths das imagens
        // TODO: carregar todas as imagens
        // TODO: separar as imagens por sprite
        // TODO: para cada Sprite:
        //       Verificar o tipo de sprite (simple, multiple, animated, etc...)
        //       criar a lista das caixas de colisões
        //       obter a imagem (já pre carregada) do sprite
        //       obter as informações de recorte (frames)
        //       criar a lista de frames, com base nessas informações de recortes
        //       criar o sprite
        // TODO: adicionar o sprite na lista
        // TODO: retornar a lista de sprites


        const spriteList: SimpleSprite[] = [];


        return spriteList;
    }
}
