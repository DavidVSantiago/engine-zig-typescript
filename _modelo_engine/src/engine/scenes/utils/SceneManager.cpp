#include "SceneManager.h"

//---------------------------------------------------------------------------------------------------------
// ATRIBUTOS privados
//---------------------------------------------------------------------------------------------------------
SceneManager *SceneManager::instance = nullptr; // inicialização da instância (específico do C++)

//---------------------------------------------------------------------------------------------------------
/* MÉTODOS */
//---------------------------------------------------------------------------------------------------------

SceneManager* SceneManager::getInstance(){
    if (instance == nullptr) {
        instance = new SceneManager();
    }   
    return instance;
}
void SceneManager::init(){
    actualScene = nullptr;
}
void SceneManager::startScene(Scene* scene, uint64_t timeMilis){
    // TODO implementar a mecânica de inicar o cenário após "timeMilis" de tempo
    this->actualScene = scene;
}

//---------------------------------------------------------------------------------------------------------
/* MÉTODOS DO GAMELOOP */
//---------------------------------------------------------------------------------------------------------

void SceneManager::handleEvents(){
    this->actualScene->handleEvents();
}
void SceneManager::update(){
    this->actualScene->update();
    this->actualScene->move();
}
void SceneManager::render(){
    this->actualScene->render();
}