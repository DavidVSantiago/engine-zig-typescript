import { MultiSprite } from "../sprites/multi_sprite";
import { SingleSprite } from "../sprites/single_sprite";
import { FileIO } from "./file_io";
import { Frame } from "../sprites/frame";
import { CollisionBox } from "../sprites/collision_box";

export class AssetManager {

    public static async loadSingleSprites(spritePathList: string[]): Promise<SingleSprite[]> {
        // Carrega todos os arquivos de definição dos sprites
        const jsonList = await FileIO.loadSpriteFiles(spritePathList);

        /** Valida a integridade dos arquivos .spr  */
        for (let i = 0; i < jsonList.length; i++) {
            if (!this.checkSpriteFile(jsonList[i], "single_sprite")) {
                throw new Error(`Arquivo .spr inválido ou corrompido para single_sprite: ${spritePathList[i]}`);
            }
        }

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

        const spriteList: SingleSprite[] = [];
        // cria um sprite para cada arquivo solicitado
        for (let i = 0; i < spritePathList.length; i++) {
            const json = jsonList[i];
            const img = imageMap.get(json.imagePath) as HTMLImageElement;

            const jsonFrame = json.frames[0];
            const frame = new Frame(
                jsonFrame.cutX,
                jsonFrame.cutY,
                null
            );

            const singleSprite = new SingleSprite(img, json.posX, json.posY, json.speedX, json.speedY, json.width, json.height || json.heigth, json.drawWidth, json.drawHeight || json.drawHeigth, frame);
            spriteList.push(singleSprite);
        }
        return spriteList;
    }

    public static async loadMultiSprites(spritePathList: string[]): Promise<MultiSprite[]> {
        // Carrega todos os arquivos de definição dos sprites
        const jsonList = await FileIO.loadSpriteFiles(spritePathList);

        /** Valida a integridade dos arquivos .spr  */
        for (let i = 0; i < jsonList.length; i++) {
            if (!this.checkSpriteFile(jsonList[i], "multi_sprite")) {
                throw new Error(`Arquivo .spr inválido ou corrompido para multi_sprite: ${spritePathList[i]}`);
            }
        }

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

        const spriteList: MultiSprite[] = [];
        // cria um sprite para cada arquivo solicitado
        for (let i = 0; i < spritePathList.length; i++) {
            const json = jsonList[i];
            const img = imageMap.get(json.imagePath) as HTMLImageElement;

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
                const frame = new Frame(
                    jsonFrame.cutX,
                    jsonFrame.cutY,
                    collisionBoxList
                );
                // adiciona o frame na lista de frames
                frameList.push(frame);
            }

            const multiSprite = new MultiSprite(img, json.posX, json.posY, json.speedX, json.speedY, json.width, json.height || json.heigth, json.drawWidth, json.drawHeight || json.drawHeigth, frameList);
            spriteList.push(multiSprite);
        }
        return spriteList;
    }

    /** Verifica a integridade dos arquivos .spr */
    private static checkSpriteFile(json: any, expectedType: string): boolean {
        if (!json || typeof json !== 'object') return false;

        // Verifica campos comuns da raiz
        if (typeof json.type !== 'string') return false;
        if (typeof json.imagePath !== 'string') return false;
        if (typeof json.posX !== 'number' || typeof json.posY !== 'number') return false;
        if (typeof json.speedX !== 'number' || typeof json.speedY !== 'number') return false;
        if (typeof json.drawWidth !== 'number' || (typeof json.drawHeight !== 'number' && typeof json.drawHeigth !== 'number')) return false;
        if (typeof json.width !== 'number' || (typeof json.height !== 'number' && typeof json.heigth !== 'number')) return false;
        if (!Array.isArray(json.frames)) return false;

        if (expectedType === "single_sprite") {
            // single_sprite deve ter exatamente 1 frame sem collisionBoxes
            if (json.frames.length !== 1) return false;
            const frame = json.frames[0];
            if (typeof frame.cutX !== 'number' || typeof frame.cutY !== 'number') return false;
        } else if (expectedType === "multi_sprite") {
            // multi_sprite deve ter pelo menos 1 frame e checar array de colisões
            if (json.frames.length < 1) return false;
            for (const frame of json.frames) {
                if (typeof frame.cutX !== 'number' || typeof frame.cutY !== 'number') return false;
                if (!Array.isArray(frame.collisionBoxes)) return false;

                for (const box of frame.collisionBoxes) {
                    if (typeof box.offsetX !== 'number' || typeof box.offsetY !== 'number') return false;
                    if (typeof box.w !== 'number' || typeof box.h !== 'number') return false;
                }
            }
        } else return false; // o campo type tem um valor inválido

        return true;
    }
}
