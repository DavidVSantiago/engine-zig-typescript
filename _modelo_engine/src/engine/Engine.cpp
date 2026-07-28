#include "Engine.h"
#include <stdio.h>

//---------------------------------------------------------------------------------------------------------
// ATRIBUTOS privados
//---------------------------------------------------------------------------------------------------------
Engine *Engine::instance = nullptr; // inicialização da instância (específico do C++)

/*****************************************************************************/
/* CONSTRUTORES E DESTRUTORES */
/*****************************************************************************/

Engine::Engine(){}
Engine::~Engine(){}

/*****************************************************************************/
/* MÉTODOS DO GAMELOOP */
/*****************************************************************************/

void Engine::handleEvents(){
    while (SDL_PollEvent(&event)){
        switch (event.type){
            case SDL_QUIT: res->isRunning = false; break;
            case SDL_KEYDOWN:
                if (event.key.keysym.sym == SDLK_ESCAPE) res->isRunning = false;
                else if (event.key.keysym.sym == SDLK_f){
                    if (res->getDisplay()->isFullscreen) res->getDisplay()->setFullScreen(false);
                    else res->getDisplay()->setFullScreen(true);
                    res->deltaTime=0.0;
                }
            break;
        }
    }
    this->sceneManager->handleEvents(); // versão sobrescrita pelo cenário do cliente
}

void Engine::update(){
    this->sceneManager->update();
}

void Engine::render(){
    // renderiza todas as imagens no buffer de textura
    SDL_SetRenderTarget(res->getRenderer(), res->renderTexture); // seta a renderização para o buffer de textura
    SDL_SetRenderDrawColor(res->getRenderer(), 0, 0, 0, 255); // seta a cor pretaf
    SDL_RenderClear(res->getRenderer()); // limpa a tela na cor preta
    this->sceneManager->render(); //renderiza todos os elementos da cena no buffer de textura

    // copia o buffer de textura renderizado para a tela
    SDL_SetRenderTarget(res->getRenderer(), NULL); // seta a renderização de volta para a tela
    SDL_SetRenderDrawColor(res->getRenderer(), 0, 0, 0, 255); // seta a cor pretaf
    SDL_RenderClear(res->getRenderer()); // limpa a tela na cor preta
    SDL_RenderCopy(res->getRenderer(), res->renderTexture, NULL, res->getDisplay()->scaled_destArray); // copia o buffer de textura
    SDL_RenderPresent(this->res->renderer); // atualiza a tela
}

void Engine::gameloop(){
    while (res->isRunning){
        startFrameTime = res->getTimeTick(); // amostra de tempo INICIAL do quadro
        res->deltaTime = (startFrameTime - oldFrameTime)/(float)res->getTimeTickFrequency();
        if(res->deltaTime>0.1) res->deltaTime = 0.1; // correção para limite máximo do deltatime
        oldFrameTime = startFrameTime; // atualiza o tempo anterior (para o próximo quadro)

        Engine::handleEvents();
        Engine::update();
        Engine::render();
        
        endFrameTime = res->getTimeTick(); // amostra de tempo FINAL do quadro
        diffTime=((endFrameTime-startFrameTime)*1000)/res->getTimeTickFrequency();
        if(diffTime < frameDelay) SDL_Delay(frameDelay - diffTime); // Pausa pelo tempo restante
    }
    SDL_DestroyRenderer(res->renderer);
    SDL_Quit();
}

/*****************************************************************************/
/* MÉTODOS */
/*****************************************************************************/
Engine* Engine::getInstance(){
    if (instance == nullptr) {
        instance = new Engine();
    }
    return instance;
}

void Engine::init(uint16_t width, uint16_t height, bool fullscreen, uint32_t pixelFormat){

    // inicializa o Resources
    res = Resources::getInstance();

    // inicializa as variável de tempo do gameloop
    this->frameDelay=16; // 16ms para 60FPS
    this->startFrameTime = this->oldFrameTime = this->res->getTimeTick();

    // inicializa o SDL ---------------
    // inicializa o audio
    if (SDL_Init(SDL_INIT_AUDIO) < 0) {
        printf( "SDL could not initialize audio! SDL_Error: %s\n", SDL_GetError() );
        res->isRunning = false;
    }else{
        cout << "Audio carregou com sucesso!" << endl;
        audioPlayer = new AudioPlayer(44100,"src/assets/audio/teste.mid","src/assets/audio/AlgolSound.sf2");
        audioPlayer->init();
    }
    
    if( SDL_Init( SDL_INIT_VIDEO ) < 0 ){
        printf( "SDL could not initialize! SDL_Error: %s\n", SDL_GetError() );
        res->isRunning = false;
    }else{
        //inicializa o display  
        res->initDisplay(width,height,pixelFormat,fullscreen);

        // cria o renderiador 
        res->setRenderer(SDL_CreateRenderer(res->getDisplay()->window, -1,SDL_RENDERER_ACCELERATED | SDL_RENDERER_PRESENTVSYNC));
        res->renderTexture = SDL_CreateTexture(res->getRenderer(), SDL_PIXELFORMAT_RGBA8888, SDL_TEXTUREACCESS_TARGET, width, height); // textura de buffer para renderização intermediária
        
        // inicializa o SceneManager
        this->sceneManager = SceneManager::getInstance();
        this->sceneManager->init();
    }
}

void Engine::start(Scene* startScene, uint64_t timeMilis){
    sceneManager->startScene(startScene,timeMilis);
    SDL_Delay(1000);
    gameloop();
}

void Engine::playAudio(){
    audioPlayer->playAudio();
}