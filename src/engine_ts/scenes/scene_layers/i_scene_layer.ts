export interface ISceneLayer {
    moveX(): void;
    moveY(): void;
    render(ctx: CanvasRenderingContext2D, alpha: number): void;
}
