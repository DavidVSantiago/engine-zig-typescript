// engine_ts/memory.ts
export class Memory {

    /** Recebe uma lista de caminhos de imagens e retorna uma lista (promisse) das imagens carregadas */
    public static async loadImages(pathList: string[]): Promise<HTMLImageElement[]> {
        const promises = pathList.map(path => {
            return new Promise<HTMLImageElement>((resolve, reject) => {
                const img = new Image();
                img.src = path;
                img.onload = () => resolve(img);
                img.onerror = () => reject(`Erro ao carregar: ${path}`);
            });
        });

        // Baixa todas as imagens em paralelo e espera a última terminar!
        return Promise.all(promises);
    }
}
