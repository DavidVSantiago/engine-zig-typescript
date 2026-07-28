#pragma once
#include <SDL2/SDL.h>
#include <string>
#include <unordered_map>
#include <cstdint>
#include <algorithm>
#include <cctype> 
#include "utils/libs/lodepng.h"
#include "utils/ImageIO.h"
#include "Display.h"

using namespace std;

class Resources
{
private:
    /* ATRIBUTOS privados -----------------------------------------------*/
    static Resources* instance; // singleton
    /** lista que armazenará todas as imagem do jogo carregadas em memória
        a cada imagem estará associada uma chave string */
    unordered_map<string, SDL_Texture*> imagesMap;
    ImageIO* imageIO;
    Display* display;

    /* CONSTRUTORES E DESTRUTORES privados -----------------------------*/
    Resources();
    virtual ~Resources();

public:
    /* ATRIBUTOS -------------------------------------------------------*/
    bool isRunning;
    string PATH_IMGS_ASSETS;
    float deltaTime;
    bool vk_up,vk_down,vk_left,vk_right;
    SDL_Renderer* renderer;
    SDL_Texture* renderTexture;

    /* MÉTODOS ---------------------------------------------------------*/
    static Resources* getInstance(); // obtém o singleton
    void initDisplay(uint16_t width, uint16_t height, uint32_t pixelFormat, bool fullscreen);
    Display* getDisplay();
    void setRenderer(SDL_Renderer* renderer);
    SDL_Renderer* getRenderer();
    void setImagesAsset(string path);
    string getImagesAsset();

    uint64_t getTimeTick();
    uint64_t getTimeTickFrequency();
    bool loadImage(string fileName, string fileExt);
    SDL_Texture* getImage(string imageName); // obtém a ref de uma imagem específico
    void clearImagens(); // limpa a lista de imagens carregadas na memória
    void formatFileExt(string &str);
};