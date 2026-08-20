import { test, expect, describe, beforeAll, afterAll } from "bun:test";
import { AssetManager } from "./asset_manager";
import { SingleSprite } from "../sprites/single_sprite";
import { MultiSprite } from "../sprites/multi_sprite";

// Mock do ambiente de navegador (Image e fetch) para rodar os testes no Bun
beforeAll(() => {
    // 1. Mock de createImageBitmap para o ambiente do Bun
    if (typeof globalThis.createImageBitmap === "undefined") {
        (globalThis as any).createImageBitmap = async (_blob: Blob) => {
            return {
                width: 100,
                height: 100,
                close: () => { },
            } as ImageBitmap;
        };
    }

    // 2. Mock do fetch para ler os arquivos reais de 'public/'
    const originalFetch = globalThis.fetch;
    (globalThis as any).fetch = async (input: string | URL | Request) => {
        const urlStr = input.toString();
        let filePath = urlStr;
        if (filePath.startsWith("sprites/")) {
            filePath = "public/" + filePath;
        }
        try {
            const file = Bun.file(filePath);
            const exists = await file.exists();
            if (!exists) {
                return new Response("Not Found", { status: 404 });
            }
            const text = await file.text();
            return new Response(text, { status: 200 });
        } catch {
            return new Response("Error", { status: 500 });
        }
    };
});

describe("AssetManager TypeScript Tests", () => {
    test("hashString produz hash determinístico idêntico ao Zig", () => {
        const id1 = (AssetManager as any).hashString("imgs/sprite_person_bola.png");
        const id2 = (AssetManager as any).hashString("imgs/sprite_person_bola.png");
        const id3 = (AssetManager as any).hashString("imgs/outro_sprite.png");

        expect(id1).toBe(id2);
        expect(id1).not.toBe(id3);
        expect(typeof id1).toBe("number");
        expect(id1).toBe(3876680355); // Hash FNV-1a idêntico ao Zig
    });

    test("SingleSprite getters e construtor com cutX e cutY em fixed-point 8.8", () => {
        const sprite = new SingleSprite(
            123,
            10, 20,
            3, 4,
            16, 16,
            32, 32,
            5, 10
        );

        expect(sprite.getPosX()).toBe(10 << 8);
        expect(sprite.getPosY()).toBe(20 << 8);
        expect(sprite.getSpeedX()).toBe(3 << 8);
        expect(sprite.getSpeedY()).toBe(4 << 8);
        expect(sprite.getWidth()).toBe(16 << 8);
        expect(sprite.getHeight()).toBe(16 << 8);
        expect(sprite.getDrawWidth()).toBe(32 << 8);
        expect(sprite.getDrawHeigth()).toBe(32 << 8);
        expect(sprite.getCutX()).toBe(5);
        expect(sprite.getCutY()).toBe(10);
    });

    test("loadSingleSprites carrega, valida e instancia SingleSprite em 8.8", async () => {
        const paths = [
            "sprites/faixa.spr",
        ];

        const sprites = await AssetManager.loadSingleSprites(paths);

        expect(sprites.length).toBe(1);
        const faixa = sprites[0];

        // Valida conversão para 8.8 fixed-point (idêntico ao teste do Zig)
        expect(faixa.getWidth()).toBe(5 << 8);
        expect(faixa.getHeight()).toBe(1 << 8);
        expect(faixa.getDrawWidth()).toBe(5 << 8);
        expect(faixa.getDrawHeigth()).toBe(640 << 8);
        expect(faixa.getCutX()).toBe(430);
        expect(faixa.getCutY()).toBe(100);
        expect(faixa.base.textureId).toBe(3876680355);
    });

    test("loadSingleSprites rejeita extensão inválida com Fail-Fast", async () => {
        const invalidPaths = [
            "sprites/person.mspr", // extensão incorreta para SingleSprite
        ];

        expect(AssetManager.loadSingleSprites(invalidPaths)).rejects.toThrow("Extensão de arquivo inválida");
    });

    test("loadMultiSprites carrega, valida e instancia MultiSprite com frames e collision boxes em 8.8", async () => {
        const paths = [
            "sprites/person.mspr",
        ];

        const sprites = await AssetManager.loadMultiSprites(paths);

        expect(sprites.length).toBe(1);
        const person = sprites[0];

        expect(person.getPosX()).toBe(490 << 8);
        expect(person.getPosY()).toBe(190 << 8);
        expect(person.getWidth()).toBe(100 << 8);
        expect(person.getHeight()).toBe(100 << 8);
        expect(person.frameList.length).toBe(9);

        // Frame 0
        expect(person.frameList[0].cutX).toBe(0);
        expect(person.frameList[0].cutY).toBe(0);
        expect(person.frameList[0].collisionBoxList.length).toBe(1);
        expect(person.frameList[0].collisionBoxList[0].w).toBe(100 << 8);
        expect(person.frameList[0].collisionBoxList[0].h).toBe(100 << 8);

        // Frame 8
        expect(person.frameList[8].cutX).toBe(300);
        expect(person.frameList[8].cutY).toBe(100);
    });

    test("loadMultiSprites rejeita extensão inválida com Fail-Fast", async () => {
        const invalidPaths = [
            "sprites/faixa.spr", // extensão incorreta para MultiSprite
        ];

        expect(AssetManager.loadMultiSprites(invalidPaths)).rejects.toThrow("Extensão de arquivo inválida");
    });

    test("validateSingleSprite rejeita dados corrompidos ou inválidos", () => {
        const invalidJson: any = {
            imagePath: "",
            posX: 0,
            posY: 0,
            speedX: 0,
            speedY: 0,
            width: -10, // inválido
            height: 10,
            drawWidth: 10,
            drawHeight: 10,
            cutX: 0,
            cutY: 0,
        };

        expect(() => {
            (AssetManager as any).validateSingleSprite(invalidJson, "test_invalid.spr");
        }).toThrow("com 'imagePath' vazio ou inválido");
    });

    test("validateMultiSprite rejeita frames vazios", () => {
        const invalidJson: any = {
            imagePath: "imgs/test.png",
            posX: 0,
            posY: 0,
            speedX: 0,
            speedY: 0,
            width: 10,
            height: 10,
            drawWidth: 10,
            drawHeight: 10,
            frames: [], // Sem frames
        };

        expect(() => {
            (AssetManager as any).validateMultiSprite(invalidJson, "test_empty.mspr");
        }).toThrow("não possui nenhum frame definido");
    });
});
