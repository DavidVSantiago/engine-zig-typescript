import { IScene } from "./scenes/i_scene";
import { InputManager } from "./resources/input_manager";
import { timer } from "./lib/timer";

class Engine {

    /**********************************************************/
    /** ATRIBUTOS */
    /**********************************************************/

    public canvas!: HTMLCanvasElement;
    public ctx!: CanvasRenderingContext2D;

    public currentScene!: IScene;
    public loadingScene!: IScene;

    private isLoading: boolean = false;
    private hasRenderedLoadingOnce: boolean = false;
    private hasStartedInit: boolean = false;
    private isReady: boolean = false;
    private sceneToLoad!: IScene;

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
            else if (e.code === "F3") { e.preventDefault(); this.setVideoMode('3x'); }
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
        this.sceneToLoad = nextScene;
        this.isLoading = true;
        this.hasRenderedLoadingOnce = false;
        this.hasStartedInit = false;
        this.isReady = false;

        timer.setAlarm(minTicks); // Inicia o registro no timer (Polling)
    }

    /**********************************************************/
    /** FUNÇÕES GAMELOOP */
    /**********************************************************/

    public gameLoop(currentTime: number) {
        timer.update(currentTime); // atualiza o timer

        // verifica se há um carregamento de tela em andamento
        const renderScene = this.isLoading ? this.loadingScene : this.currentScene;

        // atualiza a cena n vezes, de forma a compensar o possivel atraso de tempo
        while (timer.isDelay()) {
            renderScene.handleInput();
            renderScene.update();
            timer.tick(); // decrementa o delay (e o alarme!)
        }

        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height); // limpa o buffer de video
        const alpha = timer.getAlphaTime(); // calcula o alpha para a interpolacao
        renderScene.render(this.ctx, alpha); // renderiza a cena

        // LÓGICA DE TRANSIÇÃO (100% SÍNCRONA / STATE MACHINE)
        if (this.isLoading) {

            // PASSO 1: Deixa o gameloop terminar 1 vez para o navegador pintar a tela de loading.
            if (!this.hasRenderedLoadingOnce) {
                this.hasRenderedLoadingOnce = true;
            }
            // PASSO 2: Agora sim, aceitamos o "engasgo" e travamos a execução chamando init().
            else if (!this.hasStartedInit) {
                this.hasStartedInit = true;

                this.sceneToLoad.init(); // Execução bloqueante, sem Promises!

                this.isReady = true; // Assim que destravar, marcamos como pronto.
            }
            // PASSO 3: Checa se o minTicks já passou.
            else if (this.isReady && timer.isAlarmFinished()) {
                this.currentScene = this.sceneToLoad;
                this.isLoading = false;
            }
        }

        requestAnimationFrame((timestamp) => this.gameLoop(timestamp));
    }

}

export const engine = new Engine(); // instância única
