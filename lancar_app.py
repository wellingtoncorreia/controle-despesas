import subprocess
import time
import os
import sys

def iniciar_sistema():
    print("Iniciando o servidor local Next.js...")
    
    # Descobre o caminho raiz onde o bat/script está rodando
    if getattr(sys, 'frozen', False):
        caminho_base = sys._MEIPASS
    else:
        caminho_base = os.path.dirname(os.path.abspath(__file__))

    # Inicia o servidor Next.js em segundo plano (npm run dev)
    # Usamos shell=True para o Windows encontrar o comando 'npm'
    servidor_processo = subprocess.Popen(
        ["npm", "run", "dev"], 
        cwd=caminho_base, 
        shell=True
    )

    print("Aguardando o servidor inicializar na porta 3000...")
    time.sleep(4)  # Dá um tempinho de 4 segundos para o Next.js subir

    # Caminho padrão do Google Chrome no Windows
    chrome_paths = [
        r"C:\Program Files\Google\Chrome\Application\chrome.exe",
        r"C:\Program Files (x86)\Google\Chrome\Application\chrome.exe",
        os.path.expanduser(r"~\AppData\Local\Google\Chrome\Application\chrome.exe")
    ]

    chrome_path = None
    for path in chrome_paths:
        if os.path.exists(path):
            chrome_path = path
            break

    if not chrome_path:
        print("Google Chrome não encontrado nos caminhos padrões. Abrindo no navegador padrão...")
        import webbrowser
        webbrowser.open("http://localhost:3000")
    else:
        print("Abrindo o sistema em modo Aplicativo do Chrome...")
        # O argumento --app faz o Chrome abrir sem abas, sem barra de endereços, igualzinho a um app nativo!
        subprocess.Popen([
            chrome_path, 
            "--app=http://localhost:3000",
            "--window-size=1280,800"
        ])

    try:
        # Mantém o script rodando para o servidor Next.js não fechar
        servidor_processo.wait()
    except KeyboardInterrupt:
        print("Fechando o sistema...")
        servidor_processo.terminate()

if __name__ == "__main__":
    iniciar_sistema()