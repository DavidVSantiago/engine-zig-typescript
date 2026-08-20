
/** Essa classe emula perfeitamente o gerenciador de teclas do Raylib no ZIG */
export class InputManager {
    // Tabela estática na RAM — apenas altera flags booleanas sem alocação ou GC
    private static keys: Record<string, boolean> = {};

    public static setKey(code: string, isDown: boolean): void {
        this.keys[code] = isDown;
    }

    public static isKeyDown(code: string): boolean {
        return this.keys[code] === true;
    }
}
