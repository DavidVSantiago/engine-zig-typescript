const std = @import("std");

/// Gerenciador de temporização central da Engine (Fixed Timestep e Polling)
pub const Timer = struct {
    pub const TICKS_PER_SECOND: f32 = 60.0;
    pub const MS_PER_TICK: f32 = 1000.0 / 60.0;
    pub const MAX_CATCH_UP_TICKS: f32 = 5.0;

    previous_time: f32 = 0,
    accumulator: f32 = 0,
    alarm_ticks: i32 = 0,

    /// Inicializa a marcação de tempo (útil para o começo do gameloop)
    pub fn initStartTime(self: *Timer, time: f32) void {
        self.previous_time = time;
        self.accumulator = 0;
        self.alarm_ticks = 0;
    }

    /// Atualiza o acumulador de tempo com o tempo atual em milissegundos
    pub fn update(self: *Timer, current_time: f32) void {
        var elapsed = current_time - self.previous_time;
        self.previous_time = current_time;

        // Previne a "Espiral da Morte" (Death Spiral) se a thread engasgar
        const max_elapsed = MS_PER_TICK * MAX_CATCH_UP_TICKS;
        if (elapsed > max_elapsed) {
            elapsed = max_elapsed;
        }

        self.accumulator += elapsed;
    }

    /// Retorna se há tempo acumulado suficiente para processar um tick físico
    pub fn isDelay(self: *Timer) bool {
        return self.accumulator >= MS_PER_TICK;
    }

    /// Retorna o fator de interpolação (alpha) para renderização suave
    pub fn getAlphaTime(self: *Timer) f32 {
        return self.accumulator / MS_PER_TICK;
    }

    /// Inicia uma contagem regressiva de ticks em background (polling)
    pub fn setAlarm(self: *Timer, ticks: i32) void {
        self.alarm_ticks = ticks;
    }

    /// Verifica se o alarme estourou (0 ou menos ticks restantes)
    pub fn isAlarmFinished(self: *Timer) bool {
        return self.alarm_ticks <= 0;
    }

    /// Consome um tick físico do acumulador e decrementa o alarme
    pub fn tick(self: *Timer) void {
        self.accumulator -= MS_PER_TICK;

        if (self.alarm_ticks > 0) {
            self.alarm_ticks -= 1;
        }
    }
};

/// Instância global do timer
pub var global_timer: Timer = .{};

// ============================================================================
// TESTES UNITÁRIOS
// ============================================================================

test "Timer: update limita o catch-up (Death Spiral clamp)" {
    var t = Timer{};
    t.initStartTime(1000.0);

    // Simula um engasgo monstruoso de 2000ms
    t.update(3000.0);

    // O acumulador não pode ser 2000, deve ser travado em MAX_CATCH_UP_TICKS * MS_PER_TICK
    const expected_max = Timer.MS_PER_TICK * Timer.MAX_CATCH_UP_TICKS;
    try std.testing.expectEqual(expected_max, t.accumulator);
    try std.testing.expectEqual(@as(f32, 3000.0), t.previous_time);
}

test "Timer: isDelay e tick funcionam corretamente no fluxo do gameloop" {
    var t = Timer{};
    t.initStartTime(0.0);

    // Adiciona tempo equivalente a 2.5 ticks
    t.update(Timer.MS_PER_TICK * 2.5);

    try std.testing.expect(t.isDelay());
    t.tick(); // consome tick 1

    try std.testing.expect(t.isDelay());
    t.tick(); // consome tick 2

    // Sobrou 0.5 tick no acumulador
    try std.testing.expect(!t.isDelay());
    try std.testing.expectApproxEqAbs(@as(f32, 0.5), t.getAlphaTime(), 0.001);
}

test "Timer: Sistema de alarme por polling" {
    var t = Timer{};
    t.initStartTime(0.0);
    
    t.setAlarm(3);
    try std.testing.expect(!t.isAlarmFinished());

    // Simulando frames
    t.update(Timer.MS_PER_TICK * 3.0); // dá direito a 3 ticks
    
    t.tick(); // alarme cai para 2
    try std.testing.expect(!t.isAlarmFinished());

    t.tick(); // alarme cai para 1
    try std.testing.expect(!t.isAlarmFinished());

    t.tick(); // alarme cai para 0
    try std.testing.expect(t.isAlarmFinished());
}
