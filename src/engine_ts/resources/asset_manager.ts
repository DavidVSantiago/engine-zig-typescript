import { MultiSprite } from "../sprites/multi_sprite";
import { SingleSprite } from "../sprites/single_sprite";
import { FileIO } from "../lib/file_io";
import { Frame } from "../sprites/data/frame";
import { CollisionBox } from "../sprites/data/collision_box";

interface JsonSingleSprite {
    imagePath: string;
    posX: number;
    posY: number;
    speedX: number;
    speedY: number;
    width: number;
    height: number;
    drawWidth: number;
    drawHeight: number;
    cutX: number;
    cutY: number;
}

interface JsonFrame {
    cutX: number;
    cutY: number;
    collisionBoxes?: {
        offsetX: number;
        offsetY: number;
        w: number;
        h: number;
    }[];
}

interface JsonMultiSprite {
    imagePath: string;
    posX: number;
    posY: number;
    speedX: number;
    speedY: number;
    width: number;
    height: number;
    drawWidth: number;
    drawHeight: number;
    frames: JsonFrame[];
}

export class AssetManager {

    /**********************************************************/
    /** ASSETS CARREGADOS */
    /**********************************************************/

    private static textureRegistry = new Map<number, ImageBitmap>();

    /**********************************************************/
    /** GETTERS & SETTERS */
    /**********************************************************/

    /** obtém a textura pelo id (hash da string) */
    public static getTexture(id: number): ImageBitmap | undefined {
        return this.textureRegistry.get(id);
    }

    /**********************************************************/
    /** FUNÇÕES DE CARREGAMENTO */
    /**********************************************************/

    /** Retorna uma lista de SingleSprite prontos */
    public static async loadSingleSprites(paths: string[]): Promise<SingleSprite[]> {
        // Fail-Fast: Garante extensões corretas
        this.validateExtensions(paths, ".spr");

        // Aloca o array de sprites final
        const sprites: SingleSprite[] = new Array<SingleSprite>(paths.length);

        // percorre cada um dos paths dos arquivos
        for (let i = 0; i < paths.length; i++) {
            const path = paths[i];

            // carrega o JSON do SingleSprite
            const json = await FileIO.loadJsonFromFile<JsonSingleSprite>(path);

            // Valida a integridade dos dados no JSON
            this.validateSingleSprite(json, path);

            // Carrega e registra a imagem na memória e obtém o seu ID
            const tex_id = await this.loadAndRegisterTexture(json.imagePath);

            // monta o sprite para o path atual
            const singleSprite = new SingleSprite(
                tex_id,
                json.posX,
                json.posY,
                json.speedX,
                json.speedY,
                json.width,
                json.height,
                json.drawWidth,
                json.drawHeight,
                json.cutX,
                json.cutY
            );

            sprites[i] = singleSprite;
        }
        return sprites;
    }

    /** Retorna uma lista de MultiSprite prontos */
    public static async loadMultiSprites(paths: string[]): Promise<MultiSprite[]> {
        // Fail-Fast: Garante extensões corretas
        this.validateExtensions(paths, ".mspr");

        // Aloca o array de sprites final
        const sprites: MultiSprite[] = new Array<MultiSprite>(paths.length);

        // percorre cada caminho de sprite a ser construído
        for (let i = 0; i < paths.length; i++) {
            const path = paths[i];

            // carrega o JSON do MultiSprite
            const json = await FileIO.loadJsonFromFile<JsonMultiSprite>(path);

            // Valida a integridade semântica dos dados do MultiSprite
            this.validateMultiSprite(json, path);

            // Carrega e registra a imagem na memória e obtém o seu ID
            const tex_id = await this.loadAndRegisterTexture(json.imagePath);

            // monta os frames do MultiSprite
            const frameList: Frame[] = new Array<Frame>(json.frames.length);
            for (let f = 0; f < json.frames.length; f++) {
                const jsonFrame = json.frames[f];
                const collisionBoxList: CollisionBox[] = new Array<CollisionBox>(jsonFrame.collisionBoxes?.length ?? 0);

                if (jsonFrame.collisionBoxes) {
                    for (let c = 0; c < jsonFrame.collisionBoxes.length; c++) {
                        const jsonCollisionBox = jsonFrame.collisionBoxes[c];
                        const collisionBox = new CollisionBox(
                            jsonCollisionBox.offsetX,
                            jsonCollisionBox.offsetY,
                            jsonCollisionBox.w,
                            jsonCollisionBox.h
                        );
                        collisionBoxList[c] = collisionBox;
                    }
                }
                const frame = new Frame(jsonFrame.cutX, jsonFrame.cutY, collisionBoxList);
                frameList[f] = frame;
            }

            // inicializa cada um dos sprites
            const multiSprite = new MultiSprite(
                tex_id,
                json.posX,
                json.posY,
                json.speedX,
                json.speedY,
                json.width,
                json.height,
                json.drawWidth,
                json.drawHeight,
                frameList
            );
            sprites[i] = multiSprite;
        }
        return sprites;
    }

    /**********************************************************/
    /** MÉTODOS INTERNOS */
    /**********************************************************/

    /** Carrega a imagem na memória (DOM Image), registra no mapa de texturas e retorna a chave de registro (Hash ID) */
    private static async loadAndRegisterTexture(imagePath: string): Promise<number> {
        const tex_id = this.hashString(imagePath); // obtém o hash único da imagem a partir do caminho

        // só registra se a imagem ainda não existir no registro
        if (!this.textureRegistry.has(tex_id)) {
            // Baixa o arquivo binário da imagem
            const response = await fetch(imagePath);
            // Transforma o conteúdo em Blob (buffer de dados binários)
            const blob = await response.blob();
            // Converte diretamente em um Bitmap pronto para renderização na GPU
            const bitmap = await createImageBitmap(blob);
            // Adiciona no registro de texturas
            this.textureRegistry.set(tex_id, bitmap);
        }
        return tex_id;
    }

    /// Valida se todos os caminhos da lista terminam com a extensão esperada
    private static validateExtensions(paths: string[], expectedExt: string) {
        for (const path of paths) {
            if (!path.endsWith(expectedExt)) {
                const msg = `[AssetManager Error] Extensão de arquivo inválida: '${path}'. O loader esperava arquivos com extensão '${expectedExt}'.`;
                console.error(msg);
                throw new Error(msg);
            }
        }
    }

    /// Valida a integridade semântica dos dados do SingleSprite
    private static validateSingleSprite(json: any, path: string): asserts json is JsonSingleSprite {
        if (typeof json.imagePath !== 'string' || json.imagePath.length === 0) {
            const msg = `[AssetManager Error] Arquivo '${path}' com 'imagePath' vazio ou inválido!`;
            console.error(msg); throw new Error(msg);
        }
        if (typeof json.width !== 'number' || json.width <= 0 || typeof json.height !== 'number' || json.height <= 0) {
            const msg = `[AssetManager Error] Arquivo '${path}' com dimensões lógicas inválidas. Devem ser > 0!`;
            console.error(msg); throw new Error(msg);
        }
        if (typeof json.drawWidth !== 'number' || json.drawWidth <= 0 || typeof json.drawHeight !== 'number' || json.drawHeight <= 0) {
            const msg = `[AssetManager Error] Arquivo '${path}' com dimensões de desenho inválidas. Devem ser > 0!`;
            console.error(msg); throw new Error(msg);
        }
        if (typeof json.cutX !== 'number' || json.cutX < 0 || typeof json.cutY !== 'number' || json.cutY < 0) {
            const msg = `[AssetManager Error] Arquivo '${path}' com coordenadas de recorte inválidas (cutX, cutY). Devem ser >= 0!`;
            console.error(msg); throw new Error(msg);
        }
    }

    /// Valida a integridade semântica dos dados do MultiSprite
    private static validateMultiSprite(json: any, path: string): asserts json is JsonMultiSprite {
        if (typeof json.imagePath !== 'string' || json.imagePath.length === 0) {
            const msg = `[AssetManager Error] Arquivo '${path}' com 'imagePath' vazio ou inválido!`;
            console.error(msg); throw new Error(msg);
        }
        if (typeof json.width !== 'number' || json.width <= 0 || typeof json.height !== 'number' || json.height <= 0) {
            const msg = `[AssetManager Error] Arquivo '${path}' com dimensões lógicas inválidas. Devem ser > 0!`;
            console.error(msg); throw new Error(msg);
        }
        if (typeof json.drawWidth !== 'number' || json.drawWidth <= 0 || typeof json.drawHeight !== 'number' || json.drawHeight <= 0) {
            const msg = `[AssetManager Error] Arquivo '${path}' com dimensões de desenho inválidas. Devem ser > 0!`;
            console.error(msg); throw new Error(msg);
        }
        if (!Array.isArray(json.frames) || json.frames.length === 0) {
            const msg = `[AssetManager Error] Arquivo MultiSprite '${path}' não possui nenhum frame definido!`;
            console.error(msg); throw new Error(msg);
        }

        for (let f = 0; f < json.frames.length; f++) {
            const frame = json.frames[f];
            if (typeof frame.cutX !== 'number' || frame.cutX < 0 || typeof frame.cutY !== 'number' || frame.cutY < 0) {
                const msg = `[AssetManager Error] Arquivo '${path}', frame [${f}] com coordenadas de recorte inválidas. Devem ser >= 0!`;
                console.error(msg); throw new Error(msg);
            }
            if (Array.isArray(frame.collisionBoxes)) {
                for (let c = 0; c < frame.collisionBoxes.length; c++) {
                    const cb = frame.collisionBoxes[c];
                    if (typeof cb.w !== 'number' || cb.w <= 0 || typeof cb.h !== 'number' || cb.h <= 0) {
                        const msg = `[AssetManager Error] Arquivo '${path}', frame [${f}], collisionBox [${c}] com dimensões inválidas (w, h). Devem ser > 0!`;
                        console.error(msg); throw new Error(msg);
                    }
                }
            }
        }
    }

    /// Algoritmo de Hash FNV-1a de 32-bit (idêntico ao Zig)
    private static hashString(str: string): number {
        let hash = 2166136261; // FNV offset basis
        for (let i = 0; i < str.length; i++) {
            hash ^= str.charCodeAt(i);
            hash = Math.imul(hash, 16777619); // FNV prime
        }
        return hash >>> 0; // garante inteiro unsigned de 32 bits
    }
}
