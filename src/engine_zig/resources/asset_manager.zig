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
// O Parse do Zig exige structs estritas para mapear os dados dos arquivos .spr e .mspr

const JsonSingleSprite = struct {
    imagePath: []const u8,
    posX: i32,
    posY: i32,
    speedX: i32,
    speedY: i32,
    width: i32,
    height: i32,
    drawWidth: i32,
    drawHeight: i32,
    cutX: i32,
    cutY: i32,
};

const JsonCollisionBox = struct {
    offsetX: i32,
    offsetY: i32,
    w: i32,
    h: i32,
};

const JsonFrame = struct {
    cutX: i32,
    cutY: i32,
    collisionBoxes: ?[]const JsonCollisionBox = null,
};

const JsonMultiSprite = struct {
    imagePath: []const u8,
    posX: i32,
    posY: i32,
    speedX: i32,
    speedY: i32,
    width: i32,
    height: i32,
    drawWidth: i32,
    drawHeight: i32,
    frames: []const JsonFrame,
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

    // ============================================================================
    // GETTERS & SETTERS
    // ============================================================================

    /// Retorna uma textura baseada no seu Hash ID numérico.
    pub fn getTexture(id: u32) ?rl.Texture2D {
        return texture_registry.get(id);
    }

    // ============================================================================
    // CARREGAMENTO (LOADING)
    // ============================================================================

    /// Carrega SingleSprites síncronamente do disco para a memória.
    pub fn loadSingleSprites(allocator: std.mem.Allocator, io: std.Io, paths: []const []const u8) ![]SingleSprite {
        // Fail-Fast: Garante que TODOS os arquivos são .spr antes de tocar no disco ou na RAM!
        try validateExtensions(paths, ".spr");

        // Arena temporária: limpa todo o lixo do parse JSON no final da função de uma só vez!
        var arena = std.heap.ArenaAllocator.init(allocator);
        defer arena.deinit();

        // Aloca o array de sprites final
        var sprites = try allocator.alloc(SingleSprite, paths.len);
        errdefer allocator.free(sprites);

        // percorre cada um dos paths das imagens
        for (paths, 0..) |path, i| {
            // carrega o JSON com a tipagem estrita do SingleSprite
            const json = try FileIO.loadJsonFromFile(JsonSingleSprite, arena.allocator(), io, path);

            // Valida a integridade dos dados no JSON
            try validateSingleSprite(json, path);

            // Carrega a imagem na GPU e obtém o ID da textura
            const tex_id = try loadAndRegisterTexture(allocator, json.imagePath);

            // monta o sprite para o path atual
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
                json.cutX,
                json.cutY,
            );
        }

        // após montar todos os sprites, retorna-os
        return sprites;
    }

    /// Carrega MultiSprites síncronamente do disco para a memória.
    pub fn loadMultiSprites(allocator: std.mem.Allocator, io: std.Io, paths: []const []const u8) ![]MultiSprite {
        // Fail-Fast: Garante que TODOS os arquivos são .mspr antes de tocar no disco ou na RAM!
        try validateExtensions(paths, ".mspr");

        // Arena temporária: limpa todo o lixo do parse JSON no final da função de uma só vez!
        var arena = std.heap.ArenaAllocator.init(allocator);
        defer arena.deinit();

        // Aloca o array de sprites final
        var sprites = try allocator.alloc(MultiSprite, paths.len);

        // Inicializa com slices vazios para que o errdefer possa iterar de forma segura
        for (sprites) |*s| {
            s.* = MultiSprite.init(0, 0, 0, 0, 0, 0, 0, 0, 0, &.{});
        }
        errdefer {
            for (sprites) |s| {
                for (s.frame_list) |f| {
                    if (f.collision_box_list.len > 0) {
                        allocator.free(f.collision_box_list);
                    }
                }
                if (s.frame_list.len > 0) {
                    allocator.free(s.frame_list);
                }
            }
            allocator.free(sprites);
        }

        // percorre cada caminho de sprite a ser construído
        for (paths, 0..) |path, i| {
            // carrega o JSON do MultiSprite
            const json = try FileIO.loadJsonFromFile(JsonMultiSprite, arena.allocator(), io, path);

            // Valida a integridade semântica dos dados do MultiSprite
            try validateMultiSprite(json, path);

            // Carrega e registra a textura na GPU obtendo seu tex_id
            const tex_id = try loadAndRegisterTexture(allocator, json.imagePath);

            // Alocação profunda: O MultiSprite exige que a memória dos frames sobreviva à função.
            var frames = try allocator.alloc(Frame, json.frames.len);
            for (frames) |*f| {
                f.* = Frame.init(0, 0, &.{});
            }
            errdefer {
                for (frames) |f| {
                    if (f.collision_box_list.len > 0) {
                        allocator.free(f.collision_box_list);
                    }
                }
                allocator.free(frames);
            }

            // monta os frames do MultiSprite
            for (json.frames, 0..) |jframe, f| {
                // cria um slice de collision boxes vazio
                var collision_boxes: []CollisionBox = &.{};

                // se existir collision boxes, aloca memória para eles
                if (jframe.collisionBoxes) |cboxes| {
                    collision_boxes = try allocator.alloc(CollisionBox, cboxes.len);
                    for (cboxes, 0..) |cb, c| {
                        collision_boxes[c] = CollisionBox.init(cb.offsetX, cb.offsetY, cb.w, cb.h);
                    }
                }
                // inicializa cada uma dos frames
                frames[f] = Frame.init(jframe.cutX, jframe.cutY, collision_boxes);
            }
            // inicializa cada um dos sprites
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

    /// Carrega a imagem na VRAM, registra no mapa de texturas e retorna a chave de registro
    fn loadAndRegisterTexture(allocator: std.mem.Allocator, image_path: []const u8) !u32 {
        const tex_id = hashString(image_path); // obtém o hash único da imagem a partir do caminho

        // só registra se a imagem ainda não existir no registro
        if (!texture_registry.contains(tex_id)) {
            // Converte o path da imagem para string terminada em zero, para o Raylib (C-ABI)
            const path_z = try allocator.dupeSentinel(u8, image_path, 0);
            defer allocator.free(path_z);

            const tex = rl.LoadTexture(path_z); // carrega a imagem para a VRAM
            try texture_registry.put(tex_id, tex); // registra a imagem
        }

        return tex_id; // retorna o id da imagem registrada
    }

    /// Valida se todos os caminhos da lista terminam com a extensão esperada.
    fn validateExtensions(paths: []const []const u8, comptime expected_ext: []const u8) !void {
        for (paths) |path| {
            if (!std.mem.endsWith(u8, path, expected_ext)) {
                std.debug.print(
                    "\n[AssetManager Error] Extensão de arquivo inválida: '{s}'. O loader esperava arquivos com extensão '{s}'.\n",
                    .{ path, expected_ext },
                );
                return error.InvalidFileExtension;
            }
        }
    }

    /// Valida a integridade semântica dos dados do SingleSprite
    fn validateSingleSprite(json: JsonSingleSprite, path: []const u8) !void {
        if (json.imagePath.len == 0) {
            std.debug.print("\n[AssetManager Error] Arquivo '{s}' com 'imagePath' vazio!\n", .{path});
            return error.InvalidSpriteFormat;
        }
        if (json.width <= 0 or json.height <= 0) {
            std.debug.print(
                "\n[AssetManager Error] Arquivo '{s}' com dimensões lógicas inválidas (width: {d}, height: {d}). Devem ser > 0!\n",
                .{ path, json.width, json.height },
            );
            return error.InvalidSpriteFormat;
        }
        if (json.drawWidth <= 0 or json.drawHeight <= 0) {
            std.debug.print(
                "\n[AssetManager Error] Arquivo '{s}' com dimensões de desenho inválidas (drawWidth: {d}, drawHeight: {d}). Devem ser > 0!\n",
                .{ path, json.drawWidth, json.drawHeight },
            );
            return error.InvalidSpriteFormat;
        }
        if (json.cutX < 0 or json.cutY < 0) {
            std.debug.print(
                "\n[AssetManager Error] Arquivo '{s}' com coordenadas de recorte inválidas (cutX: {d}, cutY: {d}). Devem ser >= 0!\n",
                .{ path, json.cutX, json.cutY },
            );
            return error.InvalidSpriteFormat;
        }
    }

    /// Valida a integridade semântica dos dados do MultiSprite (frames e collision boxes)
    fn validateMultiSprite(json: JsonMultiSprite, path: []const u8) !void {
        if (json.imagePath.len == 0) {
            std.debug.print("\n[AssetManager Error] Arquivo '{s}' com 'imagePath' vazio!\n", .{path});
            return error.InvalidSpriteFormat;
        }
        if (json.width <= 0 or json.height <= 0) {
            std.debug.print(
                "\n[AssetManager Error] Arquivo '{s}' com dimensões lógicas inválidas (width: {d}, height: {d}). Devem ser > 0!\n",
                .{ path, json.width, json.height },
            );
            return error.InvalidSpriteFormat;
        }
        if (json.drawWidth <= 0 or json.drawHeight <= 0) {
            std.debug.print(
                "\n[AssetManager Error] Arquivo '{s}' com dimensões de desenho inválidas (drawWidth: {d}, drawHeight: {d}). Devem ser > 0!\n",
                .{ path, json.drawWidth, json.drawHeight },
            );
            return error.InvalidSpriteFormat;
        }
        if (json.frames.len == 0) {
            std.debug.print("\n[AssetManager Error] Arquivo MultiSprite '{s}' não possui nenhum frame definido!\n", .{path});
            return error.InvalidSpriteFormat;
        }

        for (json.frames, 0..) |frame, f| {
            if (frame.cutX < 0 or frame.cutY < 0) {
                std.debug.print(
                    "\n[AssetManager Error] Arquivo '{s}', frame [{d}] com coordenadas de recorte inválidas (cutX: {d}, cutY: {d}). Devem ser >= 0!\n",
                    .{ path, f, frame.cutX, frame.cutY },
                );
                return error.InvalidSpriteFormat;
            }

            if (frame.collisionBoxes) |cboxes| {
                for (cboxes, 0..) |cb, c| {
                    if (cb.w <= 0 or cb.h <= 0) {
                        std.debug.print(
                            "\n[AssetManager Error] Arquivo '{s}', frame [{d}], collisionBox [{d}] com dimensões inválidas (w: {d}, h: {d}). Devem ser > 0!\n",
                            .{ path, f, c, cb.w, cb.h },
                        );
                        return error.InvalidSpriteFormat;
                    }
                }
            }
        }
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

test "FileIO.loadJsonFromFile decodifica .spr e .mspr do disco" {
    var arena = std.heap.ArenaAllocator.init(std.testing.allocator);
    defer arena.deinit();
    const alloc = arena.allocator();

    var threaded: std.Io.Threaded = .init(std.testing.allocator, .{});
    defer threaded.deinit();
    const io = threaded.io();

    // 1. Valida faixa.spr (JsonSingleSprite)
    const faixa = try FileIO.loadJsonFromFile(JsonSingleSprite, alloc, io, "public/sprites/faixa.spr");
    try std.testing.expectEqualStrings("imgs/sprite_person_bola.png", faixa.imagePath);
    try std.testing.expectEqual(@as(i32, 5), faixa.width);
    try std.testing.expectEqual(@as(i32, 1), faixa.height);
    try std.testing.expectEqual(@as(i32, 5), faixa.drawWidth);
    try std.testing.expectEqual(@as(i32, 640), faixa.drawHeight);
    try std.testing.expectEqual(@as(i32, 430), faixa.cutX);
    try std.testing.expectEqual(@as(i32, 100), faixa.cutY);

    // 2. Valida person.mspr (JsonMultiSprite)
    const person = try FileIO.loadJsonFromFile(JsonMultiSprite, alloc, io, "public/sprites/person.mspr");
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

    try std.testing.expectEqual(@as(usize, 1), sprites.len);
    const faixa = sprites[0];

    // Valida conversão para 8.8 fixed-point
    try std.testing.expectEqual(@as(i32, 5 << 8), faixa.getWidth());
    try std.testing.expectEqual(@as(i32, 1 << 8), faixa.getHeight());
    try std.testing.expectEqual(@as(i32, 5 << 8), faixa.getDrawWidth());
    try std.testing.expectEqual(@as(i32, 640 << 8), faixa.getDrawHeight());
    try std.testing.expectEqual(@as(i32, 430), faixa.getCutX());
    try std.testing.expectEqual(@as(i32, 100), faixa.getCutY());
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
        "public/sprites/person.mspr",
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
    try std.testing.expectEqual(@as(i32, 300), person.frame_list[8].cut_x);
    try std.testing.expectEqual(@as(i32, 100), person.frame_list[8].cut_y);
}

test "AssetManager.loadSingleSprites rejeita extensão errada com Fail-Fast" {
    const allocator = std.testing.allocator;
    var threaded: std.Io.Threaded = .init(allocator, .{});
    defer threaded.deinit();
    const io = threaded.io();

    const invalid_paths = [_][]const u8{
        "public/sprites/person.mspr", // extensão incorreta para SingleSprite
    };

    const result = AssetManager.loadSingleSprites(allocator, io, &invalid_paths);
    try std.testing.expectError(error.InvalidFileExtension, result);
}

test "AssetManager.validateSingleSprite rejeita valores semânticos inválidos" {
    const invalid_json = JsonSingleSprite{
        .imagePath = "",
        .posX = 0,
        .posY = 0,
        .speedX = 0,
        .speedY = 0,
        .width = -10, // inválido
        .height = 10,
        .drawWidth = 10,
        .drawHeight = 10,
        .cutX = 0,
        .cutY = 0,
    };

    const result = AssetManager.validateSingleSprite(invalid_json, "test_invalid.spr");
    try std.testing.expectError(error.InvalidSpriteFormat, result);
}

test "AssetManager.loadMultiSprites rejeita extensão errada com Fail-Fast" {
    const allocator = std.testing.allocator;
    var threaded: std.Io.Threaded = .init(allocator, .{});
    defer threaded.deinit();
    const io = threaded.io();

    const invalid_paths = [_][]const u8{
        "public/sprites/faixa.spr", // extensão incorreta para MultiSprite
    };

    const result = AssetManager.loadMultiSprites(allocator, io, &invalid_paths);
    try std.testing.expectError(error.InvalidFileExtension, result);
}

test "AssetManager.validateMultiSprite rejeita frames vazios ou inválidos" {
    // 1. Sem frames
    const no_frames = JsonMultiSprite{
        .imagePath = "imgs/test.png",
        .posX = 0,
        .posY = 0,
        .speedX = 0,
        .speedY = 0,
        .width = 10,
        .height = 10,
        .drawWidth = 10,
        .drawHeight = 10,
        .frames = &.{},
    };
    try std.testing.expectError(error.InvalidSpriteFormat, AssetManager.validateMultiSprite(no_frames, "empty.mspr"));

    // 2. Frame com cutX negativo
    const invalid_cut = JsonMultiSprite{
        .imagePath = "imgs/test.png",
        .posX = 0,
        .posY = 0,
        .speedX = 0,
        .speedY = 0,
        .width = 10,
        .height = 10,
        .drawWidth = 10,
        .drawHeight = 10,
        .frames = &.{
            .{ .cutX = -5, .cutY = 0 },
        },
    };
    try std.testing.expectError(error.InvalidSpriteFormat, AssetManager.validateMultiSprite(invalid_cut, "invalid_cut.mspr"));
}
