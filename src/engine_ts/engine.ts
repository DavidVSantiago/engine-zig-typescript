import { IScene } from "./scenes/i_scene";
import { InputManager } from "./utils/input_manager";
import { timer } from "./utils/timer";

class Engine {

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

    public loadingScene!: IScene;

    /**********************************************************/
    /** FUNÇÕES DE INICIALIZAÇÃO */
    /**********************************************************/

    public init() {
        console.log("Iniciando Engine...");
        this.canvas = document.getElementsByTagName('canvas')[0] as HTMLCanvasElement;
        this.ctx = this.canvas.getContext("2d")!;
        this.MS_PER_TICK = 1000 / this.TICKS_PER_SECOND;
        this.accumulator = 0;

        /** para fazer os eventos de teclado serem passados para o InputManager (iguais ao raylib) */
        window.addEventListener("keydown", (e) => InputManager.setKey(e.code, true));
        window.addEventListener("keyup", (e) => InputManager.setKey(e.code, false));
        console.log("Engine iniciada com sucesso!");
    }

    /**********************************************************/
    /** FUNÇÕES */
    /**********************************************************/

    public setScene(scene: IScene) {
        this.currentScene = scene;
    }

    public setLoadingScene(scene: IScene) {
        this.loadingScene = scene;
    }

    public startGame() {
        this.previousTime = performance.now();
        requestAnimationFrame((timestamp) => this.gameLoop(timestamp));
    }

    // engine_ts/engine.ts

    public async changeScene(nextScene: IScene, minTicks: number = 60) {
        this.currentScene = this.loadingScene; // seta cena atual para o loading

        // Converte o minTicks para milissegundos
        const minTime = minTicks * this.MS_PER_TICK;
        const startTime = performance.now(); // tempo inicial do carregamento
        await nextScene.init(); // carrega os recursos da nova cena
        const elapsedTime = performance.now() - startTime; // tempo que levou para carregar os recursos

        // se o tempo para carregar os recursos foi menor, espera a diferença
        if (elapsedTime < minTime) {
            const remainingTime = minTime - elapsedTime;
            await new Promise(resolve => setTimeout(resolve, remainingTime));
        }
        this.currentScene = nextScene; // muda para a próxima cena
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
            timer.tick(); // atualiza o relógio do timer (fixed timestep)
            this.accumulator -= this.MS_PER_TICK;
        }

        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        if (this.currentScene) {
            this.currentScene.render(this.ctx);
        }

        requestAnimationFrame((timestamp) => this.gameLoop(timestamp));
    }

}

export const engine = new Engine(); // instância única