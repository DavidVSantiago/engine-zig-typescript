export interface IScene {
    init(): void;
    handleInput(): void;
    update(): void;
    render(ctx: CanvasRenderingContext2D, alpha: number): void;
}
