export interface ISprite {
    moveX(): void;
    moveY(): void;
    render(ctx: CanvasRenderingContext2D, alpha: number): void;
}