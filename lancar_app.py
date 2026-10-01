import subprocess
import time
import os
import sys
import socket
import tkinter as tk

# Constante do Windows para não mostrar a tela preta do subprocesso
CREATE_NO_WINDOW = 0x08000000

def iniciar_sistema():
    # 1. Cria a Tela de Carregamento (Splash Screen)
    root = tk.Tk()
    root.title("Carregando...")
    root.geometry("350x120")
    
    # Centraliza a janela na tela
    root.eval('tk::PlaceWindow . center')
    
    # Remove as bordas do Windows para parecer um App profissional
    root.overrideredirect(True)
    root.configure(bg="#ffffff")
    
    # Adiciona o texto de carregamento
    lbl_titulo = tk.Label(root, text="Controle de Despesas", font=("Helvetica", 14, "bold"), bg="#ffffff", fg="#2563eb")
    lbl_titulo.pack(pady=(20, 5))
    
    lbl_status = tk.Label(root, text="Iniciando servidor local, aguarde...", font=("Helvetica", 10), bg="#ffffff", fg="#64748b")
    lbl_status.pack()
    
    # Força a tela a renderizar imediatamente
    root.update()

    # 2. Descobre o caminho base real do projeto (CORREÇÃO AQUI)
    if getattr(sys, 'frozen', False):
        # Se for um .exe, usa a pasta onde o .exe foi colocado
        caminho_base = os.path.dirname(sys.executable)
    else:
        # Se for o script .py, usa a pasta do script
        caminho_base = os.path.dirname(os.path.abspath(__file__))

    # 3. Inicia o servidor Next.js em segundo plano
    servidor_processo = subprocess.Popen(
        ["npm", "run", "dev"], 
        cwd=caminho_base, 
        shell=True,
        creationflags=CREATE_NO_WINDOW  # Esconde a tela preta do NPM
    )

    # 4. Aguarda a porta 3000 abrir, mantendo a tela de carregamento ativa
    timeout = 30 # Dei 30 segundos de margem
    inicio = time.time()
    servidor_pronto = False
    
    while time.time() - inicio < timeout:
        try:
            with socket.create_connection(('localhost', 3000), timeout=1):
                servidor_pronto = True
                break
        except OSError:
            # Atualiza a interface gráfica para ela não travar (Not Responding)
            root.update()
            time.sleep(0.5)

    # Destrói a tela de carregamento assim que o servidor ligar
    root.destroy()

    if not servidor_pronto:
        # Se falhar, encerra o processo
        servidor_processo.terminate()
        return

    # 5. Abre o Google Chrome no modo Aplicativo
    chrome_paths = [
        r"C:\Program Files\Google\Chrome\Application\chrome.exe",
        r"C:\Program Files (x86)\Google\Chrome\Application\chrome.exe",
        os.path.expanduser(r"~\AppData\Local\Google\Chrome\Application\chrome.exe")
    ]

    chrome_path = next((p for p in chrome_paths if os.path.exists(p)), None)

    if not chrome_path:
        import webbrowser
        webbrowser.open("http://localhost:3000")
    else:
        subprocess.Popen([
            chrome_path, 
            "--app=http://localhost:3000",
            "--window-size=1280,800"
        ])

    try:
        # Mantém o script rodando de fundo para não derrubar o Next.js
        servidor_processo.wait()
    except KeyboardInterrupt:
        servidor_processo.terminate()

if __name__ == "__main__":
    iniciar_sistema()