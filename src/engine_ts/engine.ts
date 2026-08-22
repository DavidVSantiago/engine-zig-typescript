import { IScene } from "./scenes/i_scene";
import { InputManager } from "./resources/input_manager";
import { timer } from "./resources/timer";
import { GameScene } from "../game_ts/scenes/game_scene";

class Engine {

    /**********************************************************/
    /** ATRIBUTOS */
    /**********************************************************/

    public canvas!: HTMLCanvasElement;
    public ctx!: CanvasRenderingContext2D;

    public currentScene!: IScene;
    public loadingScene!: IScene;

    private isSceneLoading: boolean = false;
    private isSceneReady: boolean = false;

    /**********************************************************/
    /** FUNÇÕES DE INICIALIZAÇÃO */
    /**********************************************************/

    public init() {
        console.log("Iniciando Engine...");
        this.canvas = document.getElementsByTagName('canvas')[0] as HTMLCanvasElement;
        this.ctx = this.canvas.getContext("2d")!;

        /** para fazer os eventos de teclado serem passados para o InputManager (iguais ao raylib) */
        window.addEventListener("keydown", (e) => {
            // Atalhos de resolução de vídeo
            if (e.code === "F1") { e.preventDefault(); this.setVideoMode('1x'); }
            else if (e.code === "F2") { e.preventDefault(); this.setVideoMode('2x'); }
            else if (e.code === "F3") {
                e.preventDefault();
                const gameScene = new GameScene();
                this.changeScene(gameScene, 60);
            }
            else if (e.code === "F11") {
                e.preventDefault();
                if (document.fullscreenElement) {
                    this.setVideoMode('1x');
                } else {
                    this.setVideoMode('fullscreen');
                }
            }

            InputManager.setKey(e.code, true);
        });
        window.addEventListener("keyup", (e) => InputManager.setKey(e.code, false));
        console.log("Engine iniciada com sucesso!");
    }

    private setVideoMode(mode: '1x' | '2x' | '3x' | 'fullscreen') {
        const baseWidth = this.canvas.width;
        const baseHeight = this.canvas.height;

        // Remove estilos antigos
        this.canvas.style.width = '';
        this.canvas.style.height = '';
        this.canvas.style.objectFit = '';
        document.body.style.overflow = 'hidden'; // Evita scrollbars em resoluções grandes

        if (mode === '1x') {
            if (document.fullscreenElement) document.exitFullscreen().catch(() => { });
            this.canvas.style.width = `${baseWidth}px`;
            this.canvas.style.height = `${baseHeight}px`;
        } else if (mode === '2x') {
            if (document.fullscreenElement) document.exitFullscreen().catch(() => { });
            this.canvas.style.width = `${baseWidth * 2}px`;
            this.canvas.style.height = `${baseHeight * 2}px`;
        } else if (mode === '3x') {
            if (document.fullscreenElement) document.exitFullscreen().catch(() => { });
            this.canvas.style.width = `${baseWidth * 3}px`;
            this.canvas.style.height = `${baseHeight * 3}px`;
        } else if (mode === 'fullscreen') {
            this.canvas.style.width = '100vw';
            this.canvas.style.height = '100vh';
            this.canvas.style.objectFit = 'contain';
            if (!document.fullscreenElement) {
                document.documentElement.requestFullscreen().catch(err => console.log(err));
            }
        }
    }

    /**********************************************************/
    /** FUNÇÕES */
    /**********************************************************/

    /** Recebe a interface VTable da cena atual */
    public setScene(scene: IScene) {
        this.currentScene = scene;
    }

    /** Recebe a interface VTable da cena de loading */
    public setLoadingScene(scene: IScene) {
        this.loadingScene = scene;
    }

    /** Dispara o gameloop */
    public startGame() {
        timer.initStartTime(performance.now()); // marca o tempo inicial do gameloop
        requestAnimationFrame((timestamp) => this.gameLoop(timestamp));
    }

    /** Troca a cena. Recebe a interface VTable da proxima cena e o tempo minimo para a mudança */
    public changeScene(nextScene: IScene, minTicks: number = 60) {
        // limpar memória da cena anterior
        //this.currentScene.deinit();
        this.currentScene = nextScene;
        this.isSceneLoading = true;
        this.isSceneReady = false;
        timer.setAlarm(minTicks); // Inicia o registro no timer (Polling)
    }

    /**********************************************************/
    /** FUNÇÕES GAMELOOP */
    /**********************************************************/

    public async gameLoop(currentTime: number) {
        timer.update(currentTime); // atualiza o timer

        // verifica se há um carregamento de tela em andamento
        const renderScene = this.isSceneLoading ? this.loadingScene : this.currentScene;

        // atualiza a cena n vezes, de forma a compensar o possivel atraso de tempo
        while (timer.isDelay()) {
            renderScene.handleInput();
            renderScene.update();
            timer.tick(); // decrementa o delay (e o alarme!)
        }

        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height); // limpa o buffer de video
        const alpha = timer.getAlphaTime(); // calcula o alpha para a interpolacao
        renderScene.render(this.ctx, alpha); // renderiza a cena

        /** Mecânica de liberação da transição de cena (específico do TypeScript) */
        if (this.isSceneLoading) { // se está carregando uma nova cena
            if (!this.isSceneReady) { // se a nova ainda não foi inicializada
                await this.currentScene.init(); // inicializa a nova cena
                this.isSceneReady = true; // marca que a nova cena já foi inicializada
            }
            if (timer.isAlarmFinished()) { // ao termino do temporizador minimo de carregamento de cena
                this.isSceneLoading = false; // marca o fim do carregamento da cena
            }
        }

        requestAnimationFrame((timestamp) => this.gameLoop(timestamp));
    }

}

export const engine = new Engine(); // instância única
