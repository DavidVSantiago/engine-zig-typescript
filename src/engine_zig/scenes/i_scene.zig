const std = @import("std");

/// VTable (Virtual Method Table) que define a interface para qualquer Cena do jogo.
/// Como a engine processa apenas 1 (ou pouquíssimas) cenas ativas por vez, 
/// o uso de ponteiros opacos (type erasure) e vtables não causa impacto 
/// perceptível no cache da CPU, sendo a abordagem ideal de arquitetura aqui.
pub const IScene = struct {
    ptr: *anyopaque,
    vtable: *const VTable,

    pub const VTable = struct {
        init: *const fn (ptr: *anyopaque) anyerror!void,
        handleInput: *const fn (ptr: *anyopaque) void,
        update: *const fn (ptr: *anyopaque) void,
        render: *const fn (ptr: *anyopaque, alpha: f32) void,
    };

    // ========================================================================
    // MÉTODOS DE DISPATCH (Chamados pela Engine)
    // ========================================================================

    pub inline fn init(self: IScene) !void {
        return self.vtable.init(self.ptr);
    }

    pub inline fn handleInput(self: IScene) void {
        self.vtable.handleInput(self.ptr);
    }

    pub inline fn update(self: IScene) void {
        self.vtable.update(self.ptr);
    }

    pub inline fn render(self: IScene, alpha: f32) void {
        self.vtable.render(self.ptr, alpha);
    }

    // ========================================================================
    // HELPERS DE CRIAÇÃO DA INTERFACE (Chamados pelo código do Jogo)
    // ========================================================================

    /// Cria uma interface IScene a partir de um ponteiro para um objeto concreto.
    pub fn create(obj: anytype) IScene {
        const Ptr = @TypeOf(obj);
        const ptr_info = @typeInfo(Ptr);
        
        // Validações em tempo de compilação
        if (ptr_info != .pointer) @compileError("obj deve ser um ponteiro (ex: &minha_cena)");
        if (ptr_info.pointer.size != .one) @compileError("obj deve ser um ponteiro para um único item");

        const T = ptr_info.pointer.child;
        const vtable = comptime &createVTable(T);

        return .{
            .ptr = obj,
            .vtable = vtable,
        };
    }

    /// Helper interno em comptime que gera automaticamente a vtable para o tipo T
    fn createVTable(comptime T: type) VTable {
        return .{
            .init = struct {
                fn impl(ptr: *anyopaque) anyerror!void {
                    const self: *T = @ptrCast(@alignCast(ptr));
                    return self.init();
                }
            }.impl,
            .handleInput = struct {
                fn impl(ptr: *anyopaque) void {
                    const self: *T = @ptrCast(@alignCast(ptr));
                    self.handleInput();
                }
            }.impl,
            .update = struct {
                fn impl(ptr: *anyopaque) void {
                    const self: *T = @ptrCast(@alignCast(ptr));
                    self.update();
                }
            }.impl,
            .render = struct {
                fn impl(ptr: *anyopaque, alpha: f32) void {
                    const self: *T = @ptrCast(@alignCast(ptr));
                    self.render(alpha);
                }
            }.impl,
        };
    }
};

// ============================================================================
// TESTES UNITÁRIOS
// ============================================================================

test "IScene interface usando vtable (Type Erasure)" {
    // 1. Criamos uma cena mock concreta que implementa a interface
    const MockScene = struct {
        init_called: bool = false,
        update_called: bool = false,

        pub fn init(self: *@This()) anyerror!void {
            self.init_called = true;
        }
        
        pub fn handleInput(self: *@This()) void {
            _ = self;
        }
        
        pub fn update(self: *@This()) void {
            self.update_called = true;
        }
        
        pub fn render(self: *@This(), alpha: f32) void {
            _ = self;
            _ = alpha;
        }
    };

    // 2. Instanciamos a cena e empacotamos na interface
    var my_scene = MockScene{};
    var iscene = IScene.create(&my_scene);

    // 3. Chamamos os métodos via vtable
    try iscene.init();
    iscene.update();

    // 4. Validamos que o objeto original foi modificado corretamente
    try std.testing.expect(my_scene.init_called == true);
    try std.testing.expect(my_scene.update_called == true);
}
