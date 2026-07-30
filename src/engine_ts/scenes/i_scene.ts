/** lista de function pointers */
export interface IScene {
    update: () => void;
    render: (ctx: CanvasRenderingContext2D) => void;
}