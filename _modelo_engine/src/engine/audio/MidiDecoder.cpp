#define TML_IMPLEMENTATION // necessário para as implementações do tml.h
#define TSF_IMPLEMENTATION // necessário para as implementações do tsf.h
#include "MidiDecoder.h"

MidiDecoder::MidiDecoder(){
    // Configurações de áudio
    audioSpec.freq = 44100; // Frequência do áudio
    audioSpec.format = AUDIO_F32SYS; // Formato de áudio (float de 32 bits)
    audioSpec.channels = 2; // Áudio estéreo
    audioSpec.samples = 1024; // Tamanho do buffer
    audioSpec.callback = NULL; // Sem callback (modo push)

    // adiciona um dispositivo de saída
    audioDevice = SDL_OpenAudioDevice(NULL, 0, &audioSpec, NULL, 0);
    if (audioDevice == 0) {
        printf("Erro ao abrir o dispositivo de áudio: %s\n", SDL_GetError());
        return;
    }
    SDL_PauseAudioDevice(audioDevice, 0); // prepara a reprodução

    tml_message *midi = tml_load_filename("src/assets/audio/teste.mid");
    if (!midi) {
        printf("Erro ao carregar arquivo MIDI.\n");
    }else{
        cout << "Carregou o midi com sucesso" << endl;
        // Carregar o SoundFont
        tsf* soundFont = tsf_load_filename("src/assets/audio/AlgolSound.sf2");
        if (!soundFont) {
            printf("Erro ao carregar o SoundFont.\n");
            tml_free(midi);
        }else{
            cout << "Carregou o soundfont com sucesso" << endl;
            tsf_set_output(soundFont, TSF_STEREO_INTERLEAVED, 44100, 0.0f);
            // Buffer para saída de áudio
            float audioBuffer[44100]; // 46ms de audio 
            int currentTime = 0;
            
            for(tml_message* msg = midi; msg; msg=msg->next){ // percorre as mensagens do arquivo midi

                int delay = msg->time - currentTime;
                currentTime = msg->time;

                // Renderizar áudio durante o intervalo
                int samplesToRender = delay * 44.1; // 44.1 samples/ms
                int batch = std::min(samplesToRender, 44100);
                tsf_render_float(soundFont, audioBuffer, batch, 0);// Renderizar áudio para o buffer
                SDL_QueueAudio(audioDevice, audioBuffer, batch * sizeof(float) * 2);// Enviar o buffer para reprodução no SDL
                samplesToRender -= batch;

                if (msg->type == TML_NOTE_ON) { // começa a tocar nota
                    tsf_note_on(soundFont, msg->channel, msg->key, msg->velocity / 127.0f); // toca a nota
                    //printf("Note ON: Canal=%d Nota=%d Velocidade=%d Tempo=%dms\n",msg->channel,msg->key,msg->velocity,msg->time);
                } else if (msg->type == TML_NOTE_OFF) { // para de toca uma nota 
                    tsf_note_off(soundFont, msg->channel, msg->key);
                    //printf("Note ON: Canal=%d Nota=%d Tempo=%dms\n",msg->channel,msg->key,msg->time);
                } else if(msg->type == TML_PROGRAM_CHANGE){
                    tsf_channel_set_presetnumber(soundFont, msg->channel, msg->program, 0);
                    //printf("Mudou instrumento!\n");
                }
            }
        }
        tsf_close(soundFont);
    }
    tml_free(midi);
}

MidiDecoder::~MidiDecoder(){
    SDL_CloseAudioDevice(audioDevice);
}