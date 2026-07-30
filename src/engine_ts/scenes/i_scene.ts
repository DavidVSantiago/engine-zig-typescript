/** lista de function pointers */
export interface IScene {
    init: () => Promise<void>;
    update: () => void;
    render: (ctx: CanvasRenderingContext2D) => void;
}