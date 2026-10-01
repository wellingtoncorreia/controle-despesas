"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function Home() {
  // O formato nativo do input type="month" é "YYYY-MM".
  // Já iniciamos com o mês atual (Setembro de 2026) para facilitar.
  const [mesAno, setMesAno] = useState("2026-09");
  const router = useRouter();

  const handleOpenFolder = () => {
    if (!mesAno) return;
    
    // Divide a string "YYYY-MM" em ano e mês para a rota
    const [ano, mes] = mesAno.split("-");
    
    // Navega para a URL estruturada: /2026/09
    router.push(`/${ano}/${mes}`);
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-gray-100 p-8">
      <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md border border-gray-200">
        
        {/* Ícone opcional para dar um charme ao layout */}
        <div className="flex justify-center mb-4">
          <div className="p-3 bg-blue-100 rounded-full text-blue-600">
            <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
              <line x1="16" y1="2" x2="16" y2="6"></line>
              <line x1="8" y1="2" x2="8" y2="6"></line>
              <line x1="3" y1="10" x2="21" y2="10"></line>
            </svg>
          </div>
        </div>

        <h1 className="text-2xl font-bold text-gray-800 mb-6 text-center">Abrir Pasta de Despesas</h1>
        
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Selecione o Mês e Ano
            </label>
            
            {/* Input nativo de calendário de mês/ano */}
            <input 
              type="month" 
              value={mesAno} 
              onChange={(e) => setMesAno(e.target.value)} 
              className="block w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-3 border text-gray-700 text-lg cursor-pointer hover:border-blue-400 transition-colors"
            />
          </div>

          <button 
            onClick={handleOpenFolder} 
            className="w-full bg-blue-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-blue-700 transition-all transform hover:scale-[1.02] shadow-md flex justify-center items-center gap-2"
          >
            Acessar Kanban
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="5" y1="12" x2="19" y2="12"></line>
              <polyline points="12 5 19 12 12 19"></polyline>
            </svg>
          </button>
        </div>
      </div>
    </main>
  );
}