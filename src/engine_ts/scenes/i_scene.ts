export interface IScene {
    init(): Promise<void> | void;
    handleInput(): void;
    update(): void;
    render(ctx: CanvasRenderingContext2D, alpha: number): void;
}