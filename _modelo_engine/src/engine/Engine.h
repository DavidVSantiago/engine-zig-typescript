#pragma once
#include <SDL2/SDL.h>
#include "Resources.h"
#include "scenes/utils/SceneManager.h"
#include "scenes/Scene.h"
#include "audio/AudioPlayer.h"
#include "audio/MidiDecoder.h"

using namespace std;

class Engine
{
private:
    /* ATRIBUTOS privados -----------------------------------------------*/
    static Engine* instance; // singleton

    /* ATRIBUTOS PRIVADOS */
    Uint64 startFrameTime, endFrameTime, oldFrameTime, diffTime, frameDelay;

    Resources *res;
    SceneManager *sceneManager;
    AudioPlayer *audioPlayer;

    /* CONSTRUTORES E DESTRUTORES privados -----------------------------*/
    Engine();
    ~Engine();

public:
    /* ATRIBUTOS */
    SDL_Event event;

    /* MÉTODOS DO GAMELOOP */
    void handleEvents();
    void update();
    void render();
    void gameloop();

    /* MÉTODOS */
    static Engine* getInstance(); // obtém o singleton
    void init(uint16_t width, uint16_t height, bool fullscreen, uint32_t pixelFormat = ImageIO::RGBA32);
    void start(Scene* startScene, uint64_t timeMilis);

    void playAudio();
};