class Timer {
    private ticksRestantes: number = 0;
    private timerAtivo: boolean = false;
    private callback: (() => void) | null = null;

    public start(ticks: number, callback: () => void): void {
        this.ticksRestantes = ticks;
        this.callback = callback;
        this.timerAtivo = true;
    }

    public tick(): void {
        if (!this.timerAtivo) return; // guard
        this.ticksRestantes--;
        if (this.ticksRestantes <= 0) {
            this.timerAtivo = false;
            if (this.callback) this.callback();
        }
    }
}
export const timer = new Timer(); // Singleton global
