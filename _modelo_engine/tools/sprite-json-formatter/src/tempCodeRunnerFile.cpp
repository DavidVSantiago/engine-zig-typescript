   // verifica os argumentos do programa
    if (argc > 3) {
        cout << "Numero invalido de argumentos!" << endl;
        cerr << "Uso: " << argv[0] << " <string1> <string2>\n";
        return 1; // Código de erro
    }