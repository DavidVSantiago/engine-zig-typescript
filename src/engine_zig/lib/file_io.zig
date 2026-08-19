const std = @import("std");

pub const FileIO = struct {
    /// lê um arquivo de texto puro e retorna os caracteres desse texto
    pub fn loadTextFile(
        io: std.Io, // o driver que irá ler do disco
        allocator: std.mem.Allocator, // alocador de memoria
        path: []const u8, // caminho do arquivo de texto
    ) ![]u8 {
        return std.Io.Dir.cwd().readFileAlloc(io, path, allocator, .unlimited);
    }

    /// recebe uma string/buffer de texto (na RAM), tenta converter p/ json e retorna uma struct T (formato do json)
    pub fn parseTextToJson(
        comptime T: type, // formato do json que será retornado
        allocator: std.mem.Allocator, // alocador de memoria
        text_buffer: []const u8, // buffer com o texto a ser convertido para json
    ) !T { // retorna a struct T diretamente!
        return std.json.parseFromSliceLeaky(T, allocator, text_buffer, .{
            .ignore_unknown_fields = true,
            .allocate = .alloc_always,
        });
    }

    /// recebe um caminho de um arquivo json, tenta ler, converter e retornar uma struct T (formato do json)
    pub fn loadJsonFromFile(
        comptime T: type, // formato do json que será retornado
        allocator: std.mem.Allocator, // alocador de memoria
        io: std.Io, // driver que irá ler do disco
        path: []const u8, // caminho do arquivo .json
    ) !T { // retorna a struct T diretamente!
        const text_buffer = try loadTextFile(io, allocator, path); // carrega o arquivo como texto puro
        defer allocator.free(text_buffer); // agenda a liberação da string crua
        return parseTextToJson(T, allocator, text_buffer); // retorna direto a struct T preenchida
    }
};

// ============================================================================
// TESTES UNITÁRIOS
// ============================================================================

const testing = std.testing;

// Struct auxiliar para validar os dados do JSON
const DummyStruct = struct {
    name: []const u8,
    age: i32,
};

test "FileIO.loadTextFile lê um arquivo corretamente" {
    // 1. Prepara um arquivo temporário de teste
    var threaded: std.Io.Threaded = .init(testing.allocator, .{});
    defer threaded.deinit();
    const io = threaded.io();

    const cwd = std.Io.Dir.cwd();
    const file_name = "test_file_io.txt";
    const expected_text = "Hello, Zig FileIO!";

    try cwd.writeFile(io, .{ .sub_path = file_name, .data = expected_text });

    // Garante que o arquivo de teste será deletado no final
    defer cwd.deleteFile(io, file_name) catch {};

    // 2. Executa a função
    const buffer = try FileIO.loadTextFile(io, testing.allocator, file_name);
    defer testing.allocator.free(buffer);

    std.debug.print("Buffer: {s}\n", .{buffer});

    // 3. Valida o resultado
    try testing.expectEqualStrings(expected_text, buffer);
}

test "FileIO.parseTextToJson decodifica um JSON válido" {
    var arena = std.heap.ArenaAllocator.init(testing.allocator);
    defer arena.deinit();

    const json_text =
        \\{
        \\    "name": "Heroi",
        \\    "age": 42,
        \\    "extra": "ignorado"
        \\}
    ;

    const hero = try FileIO.parseTextToJson(DummyStruct, arena.allocator(), json_text);
    std.debug.print("Hero: {any}", .{hero});
    // Valida diretamente sem precisar de .value!
    try testing.expectEqualStrings("Heroi", hero.name);
    try testing.expectEqual(@as(i32, 42), hero.age);
}

test "FileIO.loadJsonFromFile integra leitura e decodificação" {
    var arena = std.heap.ArenaAllocator.init(testing.allocator);
    defer arena.deinit();
    const alloc = arena.allocator();

    // 1. Prepara arquivo JSON temporário
    var threaded: std.Io.Threaded = .init(alloc, .{});
    defer threaded.deinit();
    const io = threaded.io();

    const cwd = std.Io.Dir.cwd();
    const file_name = "test_data.json";
    const json_text =
        \\{
        \\    "name": "Inimigo",
        \\    "age": 99
        \\}
    ;

    try cwd.writeFile(io, .{ .sub_path = file_name, .data = json_text });
    defer cwd.deleteFile(io, file_name) catch {};

    // 2. Executa a função maestro (load + parse)
    const enemy = try FileIO.loadJsonFromFile(DummyStruct, alloc, io, file_name);

    // 3. Valida os campos diretamente da struct T
    try testing.expectEqualStrings("Inimigo", enemy.name);
    try testing.expectEqual(@as(i32, 99), enemy.age);
}
