const std = @import("std");
const rl = @import("raylib");

pub const FileIO = struct {
    /// Lê arquivos JSON e retorna os dados mapeados para uma struct Zig definida por T.
    pub fn loadSpriteFiles(
        comptime T: type,
        allocator: std.mem.Allocator,
        io: std.Io,
        paths: []const []const u8,
    ) ![]std.json.Parsed(T) {
        // Aloca a slice que vai conter os resultados
        var results = try allocator.alloc(std.json.Parsed(T), paths.len);
        errdefer allocator.free(results);

        for (paths, 0..) |path, i| {
            // Abre o arquivo e garante o fechamento ao final da iteração
            const file = try std.Io.Dir.openFile(.cwd(), io, path, .{});
            defer file.close(io);

            const file_stat = try file.stat(io);
            const buffer = try allocator.alloc(u8, file_stat.size);
            defer allocator.free(buffer);

            _ = try file.readPositionalAll(io, buffer, 0);

            // Faz o parse do JSON a partir da memória.
            // O .ignore_unknown_fields = true ignora chaves no JSON que não existam na struct T.
            // O .allocate = .alloc_always garante que todas as strings sejam copiadas para a heap
            // e não dependam do tempo de vida do buffer temporário!
            const parsed = try std.json.parseFromSlice(T, allocator, buffer, .{
                .ignore_unknown_fields = true,
                .allocate = .alloc_always,
            });

            results[i] = parsed;
        }

        return results;
    }

    /// Carrega as imagens do disco para a memória de vídeo via Raylib.
    pub fn loadImages(
        allocator: std.mem.Allocator,
        paths: []const []const u8,
    ) ![]rl.Texture2D {
        var textures = try allocator.alloc(rl.Texture2D, paths.len); // aloca na heap um array para rl.Texture2D (que armazena enderecos de texturas na vram)
        errdefer allocator.free(textures); // executa APENAS se houver erro!

        for (paths, 0..) |path, i| {
            // Aloca uma cópia da string com sentinela zero '\0' para C
            const z_path = try allocator.dupeSentinel(u8, path, 0);
            defer allocator.free(z_path);

            // z_path.ptr envia o ponteiro puro que as funções do C esperam
            textures[i] = rl.LoadTexture(z_path.ptr); // carrega a imagem no disco -> VRAM, e coloca os endereços no array
        }

        return textures;
    }
};
