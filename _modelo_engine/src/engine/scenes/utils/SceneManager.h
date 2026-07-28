#pragma once
#include "../../Resources.h"
#include "../Scene.h"

/** SINGLETON que gerencia o caregamento e transição entre as cenas do jogo
 * Classe usada pela maioria das outras classes da engine */
class SceneManager {
    
private:
    /* ATRIBUTOS privados------------------------------------------------------------------*/
    static SceneManager* instance; // singleton
    Scene* actualScene;

    /* CONSTRUTORES E DESTRUTORES PRIVADOS*/
    SceneManager(){}
    ~SceneManager(){}

public:
    
    /* MÉTODOS */
    static SceneManager* getInstance();
    void init();/** Inicializa os recursos do SceneManager */
    void startScene(Scene* scene, uint64_t timeMilis);

    /* MÉTODOS DO GAMELOOP */
    void handleEvents();
    void update();
    void render();
};