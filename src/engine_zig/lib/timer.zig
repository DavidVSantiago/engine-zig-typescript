const std = @import("std");

/// Gerenciador de temporização baseado em ticks de atualização fixa (Fixed Timestep)
pub const Timer = struct {
    ticks_restantes: i32 = 0,
    timer_ativo: bool = false,
    callback: ?*const fn () void = null,
    callback_with_ctx: ?*const fn (ctx: *anyopaque) void = null,
    context: ?*anyopaque = null,

    /// Inicializa um novo Timer
    pub fn init() Timer {
        return .{};
    }

    /// Inicia o timer com uma contagem de ticks e uma função de callback simples (sem parâmetros)
    pub fn start(self: *Timer, ticks: i32, callback: *const fn () void) void {
        self.ticks_restantes = ticks;
        self.callback = callback;
        self.callback_with_ctx = null;
        self.context = null;
        self.timer_ativo = true;
    }

    /// Inicia o timer com um contexto tipado (ex: ponteiro da cena, entidade, etc.)
    pub fn startWithContext(
        self: *Timer,
        ticks: i32,
        comptime T: type,
        context: *T,
        comptime callback: fn (ctx: *T) void,
    ) void {
        self.ticks_restantes = ticks;
        self.callback = null;
        self.context = context;
        self.callback_with_ctx = struct {
            fn wrapper(ctx_ptr: *anyopaque) void {
                const typed_ptr: *T = @ptrCast(@alignCast(ctx_ptr));
                callback(typed_ptr);
            }
        }.wrapper;
        self.timer_ativo = true;
    }

    /// Atualiza o relógio do timer (chamado a cada fixed update tick)
    pub fn tick(self: *Timer) void {
        if (!self.timer_ativo) return; // guard

        self.ticks_restantes -= 1;
        if (self.ticks_restantes <= 0) {
            self.timer_ativo = false;

            if (self.callback) |cb| {
                cb();
            } else if (self.callback_with_ctx) |cb_ctx| {
                if (self.context) |ctx| {
                    cb_ctx(ctx);
                }
            }
        }
    }

    /// Cancela a execução do timer
    pub fn stop(self: *Timer) void {
        self.timer_ativo = false;
        self.ticks_restantes = 0;
        self.callback = null;
        self.callback_with_ctx = null;
        self.context = null;
    }

    /// Retorna se o timer está em contagem ativa
    pub fn isActive(self: Timer) bool {
        return self.timer_ativo;
    }

    /// Retorna a quantidade de ticks restantes
    pub fn getRemainingTicks(self: Timer) i32 {
        return self.ticks_restantes;
    }
};

/// Instância global do timer (Singleton), espelhando o 'export const timer' do TypeScript
pub var global_timer: Timer = .{};

// ============================================================================
// TESTES UNITÁRIOS
// ============================================================================

var test_counter: i32 = 0;
fn testCallbackSimple() void {
    test_counter += 1;
}

test "Timer.start e tick decrementam e disparam callback simples" {
    test_counter = 0;
    var t = Timer.init();

    t.start(3, testCallbackSimple);
    try std.testing.expect(t.isActive());
    try std.testing.expectEqual(@as(i32, 3), t.getRemainingTicks());

    // Tick 1
    t.tick();
    try std.testing.expect(t.isActive());
    try std.testing.expectEqual(@as(i32, 2), t.getRemainingTicks());
    try std.testing.expectEqual(@as(i32, 0), test_counter);

    // Tick 2
    t.tick();
    try std.testing.expect(t.isActive());
    try std.testing.expectEqual(@as(i32, 1), t.getRemainingTicks());
    try std.testing.expectEqual(@as(i32, 0), test_counter);

    // Tick 3 (Disparo)
    t.tick();
    try std.testing.expect(!t.isActive());
    try std.testing.expectEqual(@as(i32, 0), t.getRemainingTicks());
    try std.testing.expectEqual(@as(i32, 1), test_counter);

    // Tick 4 (Inativo, não dispara novamente)
    t.tick();
    try std.testing.expectEqual(@as(i32, 1), test_counter);
}

test "Timer.startWithContext passa contexto e modifica estado" {
    const TestState = struct {
        value: i32 = 10,
        triggered: bool = false,

        fn onTimerExpired(self: *@This()) void {
            self.value += 50;
            self.triggered = true;
        }
    };

    var state = TestState{};
    var t = Timer.init();

    t.startWithContext(2, TestState, &state, TestState.onTimerExpired);
    try std.testing.expect(t.isActive());

    t.tick();
    try std.testing.expectEqual(@as(i32, 10), state.value);
    try std.testing.expect(!state.triggered);

    t.tick();
    try std.testing.expect(!t.isActive());
    try std.testing.expectEqual(@as(i32, 60), state.value);
    try std.testing.expect(state.triggered);
}

test "Timer.stop cancela a contagem imediatamente" {
    test_counter = 0;
    var t = Timer.init();

    t.start(5, testCallbackSimple);
    t.tick();
    t.tick();
    try std.testing.expect(t.isActive());

    t.stop();
    try std.testing.expect(!t.isActive());
    try std.testing.expectEqual(@as(i32, 0), t.getRemainingTicks());

    // Ticks posteriores não devem disparar
    t.tick();
    t.tick();
    try std.testing.expectEqual(@as(i32, 0), test_counter);
}
