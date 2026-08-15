const std = @import("std");
const rl = @import("raylib");

pub const FileIO = struct {
    /// Lê arquivos JSON e retorna os dados mapeados para uma struct Zig definida por T.
    pub fn loadSpriteFiles(
        comptime T: type,
        allocator: std.mem.Allocator,
        paths: []const []const u8,
    ) ![]std.json.Parsed(T) {
        // Aloca a slice que vai conter os resultados
        var results = try allocator.alloc(std.json.Parsed(T), paths.len);
        errdefer allocator.free(results);

        for (paths, 0..) |path, i| {
            // Abre o arquivo e garante o fechamento ao final da iteração
            const file = try std.fs.cwd().openFile(path, .{}); // abre o arquivo .spr, alocada na stack (file descriptor)
            defer file.close(); // agendamos o fechamento ao final da iteração

            const file_size = try file.getEndPos(); // Descobre o tamanho do arquivo para alocar um buffer exato na RAM
            const buffer = try allocator.alloc(u8, file_size); // aloca o buffer na memória RAM para os arquivos .spr
            defer allocator.free(buffer);

            _ = try file.readAll(buffer); // lê todo o arquivo e joga no buffer (disco para a RAM)

            // Faz o parse do JSON a partir da memória.
            // O .ignore_unknown_fields = true ignora chaves no JSON que não existam na struct T.
            const parsed = try std.json.parseFromSlice(T, allocator, buffer, .{
                .ignore_unknown_fields = true,
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
            // O Zig dupeZ aloca uma cópia da string original e adiciona o '\0' de segurança no fim.
            const z_path = try allocator.dupeZ(u8, path); // dupeZ aloca memoria para strings e adiciona o '\0' ao final
            defer allocator.free(z_path); // agenda a liberação da memória alocada por dupeZ

            // z_path.ptr envia o ponteiro puro que as funções do C esperam
            textures[i] = rl.LoadTexture(z_path.ptr); // carrega a imagem no disco -> VRAM, e coloca os endereços no array
        }

        return textures;
    }
};
