#pragma once

#include <iostream>
#include <chrono>
#include <thread>
#include <string>
#include <SDL2/SDL.h>
#include "../utils/libs/tml.h"
#include "../utils/libs/tsf.h"

using namespace std;

class AudioPlayer{
public:

    // Configurações de áudio
    SDL_AudioSpec audioSpec;
    SDL_AudioDeviceID audioDevice;
    int frequency; // tamamho da amostra da audio
    float *audioBuffer; // 46ms de audio 
    int currentTime; // ???
    string midiFilename;
    string sfFilename;
    tml_message *midi;
    tsf *soundFont;

    AudioPlayer(int frequency, string midiFilename, string sfFilename);
    ~AudioPlayer();
    
    bool init();

    void playAudio();
};