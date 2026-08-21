class Timer {
    public readonly TICKS_PER_SECOND = 60;
    public readonly MS_PER_TICK = 1000 / 60;
    public readonly MAX_CATCH_UP_TICKS = 5;

    private previousTime: number = 0;
    private accumulator: number = 0;

    // Novo registro numérico (sem callbacks)
    private alarmTicks: number = 0;

    public initStartTime(time: number): void {
        this.previousTime = time;
        this.accumulator = 0;
    }

    public update(currentTime: number): void {
        let elapsed = currentTime - this.previousTime;
        this.previousTime = currentTime;
        if (elapsed > this.MS_PER_TICK * this.MAX_CATCH_UP_TICKS) {
            elapsed = this.MS_PER_TICK * this.MAX_CATCH_UP_TICKS;
        }
        this.accumulator += elapsed;
    }

    public isDelay(): boolean { return this.accumulator >= this.MS_PER_TICK; }
    public getAlphaTime(): number { return this.accumulator / this.MS_PER_TICK; }


    public setAlarm(ticks: number): void {
        this.alarmTicks = ticks;
    }

    public isAlarmFinished(): boolean {
        return this.alarmTicks <= 0;
    }

    public tick(): void {
        this.accumulator -= this.MS_PER_TICK;

        // Atualiza o registro a cada tick
        if (this.alarmTicks > 0) {
            this.alarmTicks--;
        }
    }
}
export const timer = new Timer();