const std = @import("std");
const rl = @import("raylib");

const FileIO = @import("../lib/file_io.zig").FileIO;
const Frame = @import("../sprites/data/frame.zig").Frame;
const CollisionBox = @import("../sprites/data/collision_box.zig").CollisionBox;
const SingleSprite = @import("../sprites/single_sprite.zig").SingleSprite;
const MultiSprite = @import("../sprites/multi_sprite.zig").MultiSprite;

// ============================================================================
// ESTRUTURAS JSON
// ============================================================================
// O Parse do Zig exige structs estritas para mapear os dados do arquivo .spr

const JsonCollisionBox = struct {
    offsetX: i32,
    offsetY: i32,
    w: i32,
    h: i32,
};

const JsonFrame = struct {
    cutX: i32,
    cutY: i32,
    collisionBoxes: ?[]JsonCollisionBox = null,
};

const JsonSprite = struct {
    type: []const u8,
    imagePath: []const u8,
    posX: i32,
    posY: i32,
    speedX: i32,
    speedY: i32,
    width: i32,
    height: i32,
    drawWidth: i32,
    drawHeight: i32,
    frames: []JsonFrame,
};

// ============================================================================
// ASSET MANAGER
// ============================================================================

pub const AssetManager = struct {
    /// ASSETS CARREGADOS
    var texture_registry: std.AutoHashMap(u32, rl.Texture2D) = undefined;
    var is_initialized: bool = false;

    /// Inicializa a engine de assets. (Chamado pela GameEngine futuramente)
    pub fn init(allocator: std.mem.Allocator) void {
        if (is_initialized) return;
        texture_registry = std.AutoHashMap(u32, rl.Texture2D).init(allocator);
        is_initialized = true;
    }

    /// Descarrega todos os assets da e limpa a memória da RAM
    pub fn deinit() void {
        if (!is_initialized) return;

        var it = texture_registry.valueIterator();
        while (it.next()) |tex| {
            rl.UnloadTexture(tex.*);
        }

        texture_registry.deinit();
        is_initialized = false;
    }

    /// Algoritmo de Hash FNV-1a de 32-bit.
    pub fn hashString(str: []const u8) u32 {
        var hash: u32 = 2166136261;
        for (str) |c| {
            hash ^= c;
            hash *%= 16777619; // Wrap-around overflow idêntico ao JS
        }
        return hash;
    }

    /// Retorna uma textura baseada no seu Hash ID numérico.
    pub fn getTexture(id: u32) ?rl.Texture2D {
        return texture_registry.get(id);
    }

    // ============================================================================
    // CARREGAMENTO (LOADING)
    // ============================================================================

    /// Carrega SingleSprites síncronamente do disco para a memória.
    pub fn loadSingleSprites(allocator: std.mem.Allocator, io: std.Io, paths: []const []const u8) ![]SingleSprite {
        // 1. Lê e decodifica os JSONs
        const parsed_jsons = try FileIO.loadJsonFromFile(JsonSprite, allocator, io, paths);
        defer {
            // Limpa o lixo de memória do parse JSON ao fim da função!
            for (parsed_jsons) |p| p.deinit();
            allocator.free(parsed_jsons);
        }

        // 2. Resolve dependências de imagens sem duplica-las
        try loadAndRegisterImages(allocator, parsed_jsons);

        // 3. Constrói os Sprites Nativos
        var sprites = try allocator.alloc(SingleSprite, parsed_jsons.len);

        for (parsed_jsons, 0..) |p, i| {
            const json = p.value;
            if (!std.mem.eql(u8, json.type, "single_sprite") or json.frames.len != 1) {
                return error.InvalidSpriteFormat;
            }

            const tex_id = hashString(json.imagePath);
            const frame = Frame.init(json.frames[0].cutX, json.frames[0].cutY, &.{});

            sprites[i] = SingleSprite.init(
                tex_id,
                json.posX,
                json.posY,
                json.speedX,
                json.speedY,
                json.width,
                json.height,
                json.drawWidth,
                json.drawHeight,
                frame,
            );
        }

        return sprites;
    }

    /// Carrega MultiSprites síncronamente do disco para a memória.
    pub fn loadMultiSprites(allocator: std.mem.Allocator, io: std.Io, paths: []const []const u8) ![]MultiSprite {
        const parsed_jsons = try FileIO.loadSpriteFiles(JsonSprite, allocator, io, paths);
        defer {
            for (parsed_jsons) |p| p.deinit();
            allocator.free(parsed_jsons);
        }

        try loadAndRegisterImages(allocator, parsed_jsons);

        var sprites = try allocator.alloc(MultiSprite, parsed_jsons.len);

        for (parsed_jsons, 0..) |p, i| {
            const json = p.value;
            if (!std.mem.eql(u8, json.type, "multi_sprite") or json.frames.len == 0) {
                return error.InvalidSpriteFormat;
            }

            const tex_id = hashString(json.imagePath);

            // Alocação profunda: O MultiSprite exige que a memória dos frames sobreviva à função.
            var frames = try allocator.alloc(Frame, json.frames.len);

            for (json.frames, 0..) |jframe, f| {
                var collision_boxes: []CollisionBox = &.{};

                if (jframe.collisionBoxes) |cboxes| {
                    collision_boxes = try allocator.alloc(CollisionBox, cboxes.len);
                    for (cboxes, 0..) |cb, c| {
                        collision_boxes[c] = CollisionBox.init(cb.offsetX, cb.offsetY, cb.w, cb.h);
                    }
                }

                frames[f] = Frame.init(jframe.cutX, jframe.cutY, collision_boxes);
            }

            sprites[i] = MultiSprite.init(
                tex_id,
                json.posX,
                json.posY,
                json.speedX,
                json.speedY,
                json.width,
                json.height,
                json.drawWidth,
                json.drawHeight,
                frames,
            );
        }

        return sprites;
    }

    // ============================================================================
    // MÉTODOS INTERNOS
    // ============================================================================

    /// Função auxiliar para ler os paths das imagens do JSON, filtrar duplicatas e subir pra VRAM.
    fn loadAndRegisterImages(allocator: std.mem.Allocator, parsed_jsons: []std.json.Parsed(JsonSprite)) !void {
        var unique_images = std.StringHashMap(void).init(allocator);
        defer unique_images.deinit();

        for (parsed_jsons) |p| {
            try unique_images.put(p.value.imagePath, {});
        }

        var image_paths: std.ArrayList([]const u8) = .empty;
        defer image_paths.deinit(allocator);

        var it = unique_images.keyIterator();
        while (it.next()) |key| {
            try image_paths.append(allocator, key.*);
        }

        const loaded_textures = try FileIO.loadImages(allocator, image_paths.items);
        defer allocator.free(loaded_textures);

        for (image_paths.items, 0..) |img_path, i| {
            const id = hashString(img_path);

            // Registra apenas se não existir. Se existir, descarrega a duplicata para limpar a GPU.
            if (!texture_registry.contains(id)) {
                try texture_registry.put(id, loaded_textures[i]);
            } else {
                rl.UnloadTexture(loaded_textures[i]);
            }
        }
    }
};

// ============================================================================
// TESTES UNITÁRIOS
// ============================================================================

test "AssetManager.hashString consistencia e determinismo" {
    const id1 = AssetManager.hashString("imgs/sprite_person_bola.png");
    const id2 = AssetManager.hashString("imgs/sprite_person_bola.png");
    const id3 = AssetManager.hashString("imgs/outro_sprite.png");

    try std.testing.expectEqual(id1, id2);
    try std.testing.expect(id1 != id3);
    try std.testing.expect(id1 != 0);
}

test "FileIO.loadSpriteFiles decodifica .spr (JSON) do disco" {
    const allocator = std.testing.allocator;
    var threaded: std.Io.Threaded = .init(allocator, .{});
    defer threaded.deinit();
    const io = threaded.io();

    const paths = [_][]const u8{
        "public/sprites/faixa.spr",
        "public/sprites/person.spr",
    };

    const parsed_list = try FileIO.loadSpriteFiles(JsonSprite, allocator, io, &paths);
    defer {
        for (parsed_list) |p| p.deinit();
        allocator.free(parsed_list);
    }

    try std.testing.expectEqual(@as(usize, 2), parsed_list.len);

    // 1. Valida faixa.spr (single_sprite)
    const faixa = parsed_list[0].value;
    try std.testing.expectEqualStrings("single_sprite", faixa.type);
    try std.testing.expectEqualStrings("imgs/sprite_person_bola.png", faixa.imagePath);
    try std.testing.expectEqual(@as(i32, 5), faixa.width);
    try std.testing.expectEqual(@as(i32, 1), faixa.height);
    try std.testing.expectEqual(@as(i32, 5), faixa.drawWidth);
    try std.testing.expectEqual(@as(i32, 640), faixa.drawHeight);
    try std.testing.expectEqual(@as(usize, 1), faixa.frames.len);
    try std.testing.expectEqual(@as(i32, 430), faixa.frames[0].cutX);
    try std.testing.expectEqual(@as(i32, 100), faixa.frames[0].cutY);

    // 2. Valida person.spr (multi_sprite)
    const person = parsed_list[1].value;
    try std.testing.expectEqualStrings("multi_sprite", person.type);
    try std.testing.expectEqualStrings("imgs/sprite_person_bola.png", person.imagePath);
    try std.testing.expectEqual(@as(i32, 490), person.posX);
    try std.testing.expectEqual(@as(i32, 190), person.posY);
    try std.testing.expectEqual(@as(i32, 100), person.width);
    try std.testing.expectEqual(@as(i32, 100), person.height);
    try std.testing.expectEqual(@as(usize, 9), person.frames.len);
    try std.testing.expect(person.frames[0].collisionBoxes != null);
    try std.testing.expectEqual(@as(usize, 1), person.frames[0].collisionBoxes.?.len);
    try std.testing.expectEqual(@as(i32, 100), person.frames[0].collisionBoxes.?[0].w);
    try std.testing.expectEqual(@as(i32, 100), person.frames[0].collisionBoxes.?[0].h);
}

test "AssetManager.loadSingleSprites carrega e instancia SingleSprite em 8.8" {
    const allocator = std.testing.allocator;
    var threaded: std.Io.Threaded = .init(allocator, .{});
    defer threaded.deinit();
    const io = threaded.io();

    AssetManager.init(allocator);
    defer AssetManager.deinit();

    const paths = [_][]const u8{
        "public/sprites/faixa.spr",
    };

    const sprites = try AssetManager.loadSingleSprites(allocator, io, &paths);
    defer allocator.free(sprites);

    std.debug.print("\nSprites: {any}", .{sprites});

    try std.testing.expectEqual(@as(usize, 1), sprites.len);
    const faixa = sprites[0];

    // Valida conversão para 8.8 fixed-point
    try std.testing.expectEqual(@as(i32, 5 << 8), faixa.getWidth());
    try std.testing.expectEqual(@as(i32, 1 << 8), faixa.getHeight());
    try std.testing.expectEqual(@as(i32, 5 << 8), faixa.getDrawWidth());
    try std.testing.expectEqual(@as(i32, 640 << 8), faixa.getDrawHeight());
    try std.testing.expectEqual(@as(i32, 430 << 8), faixa.getCutX());
    try std.testing.expectEqual(@as(i32, 100 << 8), faixa.getCutY());
    try std.testing.expectEqual(AssetManager.hashString("imgs/sprite_person_bola.png"), faixa.base.texture_id);
}

test "AssetManager.loadMultiSprites carrega e instancia MultiSprite com frames e collision boxes em 8.8" {
    const allocator = std.testing.allocator;
    var threaded: std.Io.Threaded = .init(allocator, .{});
    defer threaded.deinit();
    const io = threaded.io();

    AssetManager.init(allocator);
    defer AssetManager.deinit();

    const paths = [_][]const u8{
        "public/sprites/person.spr",
    };

    const sprites = try AssetManager.loadMultiSprites(allocator, io, &paths);
    defer {
        for (sprites) |s| {
            for (s.frame_list) |f| {
                if (f.collision_box_list.len > 0) {
                    allocator.free(f.collision_box_list);
                }
            }
            allocator.free(s.frame_list);
        }
        allocator.free(sprites);
    }

    try std.testing.expectEqual(@as(usize, 1), sprites.len);
    const person = sprites[0];

    try std.testing.expectEqual(@as(i32, 490 << 8), person.getPosX());
    try std.testing.expectEqual(@as(i32, 190 << 8), person.getPosY());
    try std.testing.expectEqual(@as(i32, 100 << 8), person.getWidth());
    try std.testing.expectEqual(@as(i32, 100 << 8), person.getHeight());
    try std.testing.expectEqual(@as(usize, 9), person.frame_list.len);

    // Frame 0
    try std.testing.expectEqual(@as(i32, 0), person.frame_list[0].cut_x);
    try std.testing.expectEqual(@as(i32, 0), person.frame_list[0].cut_y);
    try std.testing.expectEqual(@as(usize, 1), person.frame_list[0].collision_box_list.len);
    try std.testing.expectEqual(@as(i32, 100 << 8), person.frame_list[0].collision_box_list[0].w);
    try std.testing.expectEqual(@as(i32, 100 << 8), person.frame_list[0].collision_box_list[0].h);

    // Frame 8
    try std.testing.expectEqual(@as(i32, 300 << 8), person.frame_list[8].cut_x);
    try std.testing.expectEqual(@as(i32, 100 << 8), person.frame_list[8].cut_y);
}
