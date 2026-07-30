/** lista de function pointers */
export interface ISprite {
    moveX: () => void;
    moveY: () => void;
    render: (ctx: CanvasRenderingContext2D) => void;
}