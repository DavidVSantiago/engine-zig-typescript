#pragma once
#include <SDL2/SDL.h>
#include <string>
#include <iostream>
#include <fstream>
#include <vector>
#include <unordered_map>
#include "libs/lodepng.h"
#include <cstdint>

using namespace std;

class ImageIO
{
private:
    /* ATRIBUTOS privados -----------------------------------------------*/
    static ImageIO* instance; // singleton
    uint32_t pixelFormat;
    SDL_Renderer* renderer;

    /* CONSTRUTORES E DESTRUTORES privados -----------------------------*/
    ImageIO();
    ~ImageIO();
public:
    /* ATRIBUTOS -------------------------------------------------------*/

    /* MÉTODOS ---------------------------------------------------------*/
    static ImageIO* getInstance(); // obtém o singleton
    void init(uint32_t pixelFormat);
    void setRenderer(SDL_Renderer* renderer);
    unsigned char* decode_PNG_File(string source, unsigned* width,unsigned* height);
    SDL_Texture* load_Texture(unsigned char* imageData,unsigned width,unsigned height);
    vector<unsigned short> convertPixelsTo_RGBA4444(unsigned char* imageData, unsigned width, unsigned height);
    vector<unsigned short> convertPixelsTo_RGBA5551(unsigned char* imageData, unsigned width, unsigned height);

    // formatos de profundidade de pixel a ser usado para renderizar as imagens do jogo
    enum {RGBA32,RGBA4444,RGBA5551};
};