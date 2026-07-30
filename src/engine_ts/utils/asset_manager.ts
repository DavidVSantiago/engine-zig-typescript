import { SimpleSprite } from "../sprites/simple_sprite";
import { FileIO } from "./file_io";
import { Frame } from "../sprites/frame";
import { Rectangle } from "../structures/rectangle";
import { CollisionBox } from "../sprites/collision_box";

export class AssetManager {

    public static async loadSprites(jsonPathList: string[]): Promise<SimpleSprite[]> {
        // Carrega todos os jsons dos sprites
        const jsonList = await FileIO.loadJsons(jsonPathList);
        // Separa os paths das imagens
        const imagePathList = jsonList.map((json) => json.imagePath as string);
        // remove as duplicidades
        const uniqueImagePathList = Array.from(new Set(imagePathList));
        // Carrega todas as imagens sem duplicidade
        const imageList = await FileIO.loadImages(uniqueImagePathList);

        // Mapeia cada caminho de imagem para o objeto HTMLImageElement correspondente
        const imageMap = new Map<string, HTMLImageElement>();
        uniqueImagePathList.forEach((path, index) => {
            imageMap.set(path, imageList[index]);
        });

        const spriteList: SimpleSprite[] = [];
        // cria um sprite para cada json solicitado
        for (let i = 0; i < jsonPathList.length; i++) {
            const json = jsonList[i];
            const img = imageMap.get(json.imagePath) as HTMLImageElement;

            // constói cada sprite, de acordo com o tipo
            switch (json.type) {
                case 'simple':
                    // constrói a lista de Quadros de cada sprite.
                    const frameList: Frame[] = [];
                    // percorre a lista de Frames do Json
                    for (let f = 0; f < json.frames.length; f++) {
                        const jsonFrame = json.frames[f];

                        const collisionBoxList: CollisionBox[] = [];
                        // percorre a lista de collisionBoxes do Json
                        for (let c = 0; c < jsonFrame.collisionBoxes.length; c++) {
                            const jsonCollisionBox = jsonFrame.collisionBoxes[c];
                            const collisionBox = new CollisionBox(
                                jsonCollisionBox.offsetX,
                                jsonCollisionBox.offsetY,
                                jsonCollisionBox.w,
                                jsonCollisionBox.h
                            );
                            collisionBoxList.push(collisionBox);
                        }
                        // cria cada frame e adiciona a lista de colisões
                        const frame = new Frame(new Rectangle(
                            jsonFrame.cutRect.x,
                            jsonFrame.cutRect.y,
                            jsonFrame.cutRect.w,
                            jsonFrame.cutRect.h
                        ), collisionBoxList);
                        // adiciona o frame na lista de frames
                        frameList.push(frame);
                    }

                    const simpleSprite = new SimpleSprite(img, json.posX, json.posY, json.speedX, json.speedY, frameList);
                    spriteList.push(simpleSprite);
                    break;
                default:
                    throw new Error(`Tipo de sprite não suportado: ${json.type}`);
            }
        }
        return spriteList;
    }
}
