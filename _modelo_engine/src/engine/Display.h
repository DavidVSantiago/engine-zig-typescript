#pragma once
#include <SDL2/SDL.h>

using namespace std;

class Display
{
public:
    /* ATRIBUTOS -------------------------------------------------------*/
    SDL_Window* window;
    uint16_t screenWidth, screenHeight; // resolução em pixels
    uint16_t displayWidth, displayHeight; // dimensões do display (monitor)
    SDL_Rect *scaled_destArray; // Array de Rcts de destino para renderização, com os valores escalonados para renderização
    bool isFullscreen;
    /* CONSTRUTORES E DESTRUTORES --------------------------------------*/
    Display(uint16_t width, uint16_t height, bool fullscreen);
    ~Display();

    /* MÉTODOS ---------------------------------------------------------*/
   void setFullScreen(bool fullScreen);
   void updateDisplayScale();
};