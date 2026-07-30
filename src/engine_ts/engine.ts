import { IScene } from "./scenes/i_scene";
import { InputManager } from "./utils/input_manager";

export class Engine {

    /**********************************************************/
    /** ATRIBUTOS */
    /**********************************************************/

    public canvas!: HTMLCanvasElement;
    public ctx!: CanvasRenderingContext2D;

    public readonly TICKS_PER_SECOND = 60;
    public MS_PER_TICK!: number;
    public readonly MAX_CATCH_UP_TICKS = 5;

    public previousTime!: number;
    public accumulator!: number;
    public currentScene!: IScene;

    /**********************************************************/
    /** FUNÇÕES DE INICIALIZAÇÃO */
    /**********************************************************/

    constructor() {
        console.log("Iniciando Engine...");
        this.canvas = document.getElementById("gameCanvas") as HTMLCanvasElement;
        this.ctx = this.canvas.getContext("2d")!;
        this.MS_PER_TICK = 1000 / this.TICKS_PER_SECOND;
        this.accumulator = 0;

        /** para fazer os eventos de teclado serem passados para o InputManager (iguais ao raylib) */
        window.addEventListener("keydown", (e) => InputManager.setKey(e.code, true));
        window.addEventListener("keyup", (e) => InputManager.setKey(e.code, false));
    }



    /**********************************************************/
    /** FUNÇÕES */
    /**********************************************************/

    public setScene(scene: IScene) {
        this.currentScene = scene;
    }

    public startGame() {
        this.previousTime = performance.now();
        requestAnimationFrame((timestamp) => this.gameLoop(timestamp));
    }

    /**********************************************************/
    /** GETTERS & SETTERS */
    /**********************************************************/

    /**********************************************************/
    /** FUNÇÕES GAMELOOP */
    /**********************************************************/

    public gameLoop(currentTime: number) {
        let elapsed = currentTime - this.previousTime;
        this.previousTime = currentTime;

        if (elapsed > this.MS_PER_TICK * this.MAX_CATCH_UP_TICKS) {
            elapsed = this.MS_PER_TICK * this.MAX_CATCH_UP_TICKS;
        }

        this.accumulator += elapsed;
        while (this.accumulator >= this.MS_PER_TICK) {
            if (this.currentScene) {
                this.currentScene.update();
            }
            this.accumulator -= this.MS_PER_TICK;
        }

        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        if (this.currentScene) {
            this.currentScene.render(this.ctx);
        }

        requestAnimationFrame((timestamp) => this.gameLoop(timestamp));
    }

}