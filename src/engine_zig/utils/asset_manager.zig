const std = @import("std");
const rl = @import("raylib");
const file_io = @import("file_io.zig");
const FileIO = file_io.FileIO;

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
    pub fn loadSingleSprites(allocator: std.mem.Allocator, paths: []const []const u8) ![]SingleSprite {
        // 1. Lê e decodifica os JSONs
        const parsed_jsons = try FileIO.loadSpriteFiles(JsonSprite, allocator, paths);
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
    pub fn loadMultiSprites(allocator: std.mem.Allocator, paths: []const []const u8) ![]MultiSprite {
        const parsed_jsons = try FileIO.loadSpriteFiles(JsonSprite, allocator, paths);
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

        var image_paths = std.ArrayList([]const u8).init(allocator);
        defer image_paths.deinit();

        var it = unique_images.keyIterator();
        while (it.next()) |key| {
            try image_paths.append(key.*);
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
