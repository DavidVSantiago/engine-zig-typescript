#pragma once

#include <iostream>
#include <chrono>
#include <thread>
#include <SDL2/SDL.h>
#include "../utils/libs/tml.h"
#include "../utils/libs/tsf.h"

using namespace std;

class MidiDecoder{
public:
    // Configurações de áudio
    SDL_AudioSpec audioSpec;
    SDL_AudioDeviceID audioDevice;
    
    MidiDecoder();
    ~MidiDecoder();
};