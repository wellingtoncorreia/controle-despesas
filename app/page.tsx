"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

// Array estruturado com os meses para gerar os cards dinamicamente
const meses = [
  { num: "01", nome: "Janeiro" },
  { num: "02", nome: "Fevereiro" },
  { num: "03", nome: "Março" },
  { num: "04", nome: "Abril" },
  { num: "05", nome: "Maio" },
  { num: "06", nome: "Junho" },
  { num: "07", nome: "Julho" },
  { num: "08", nome: "Agosto" },
  { num: "09", nome: "Setembro" },
  { num: "10", nome: "Outubro" },
  { num: "11", nome: "Novembro" },
  { num: "12", nome: "Dezembro" }
];

export default function Home() {
  const router = useRouter();
  
  // Define o ano atual como padrão, mas permite gerar uma lista para o select
  const anoAtual = new Date().getFullYear();
  const [anoSelecionado, setAnoSelecionado] = useState(anoAtual.toString());

  // Gera uma lista de anos (ex: de 2 anos atrás até 5 anos para frente)
  const listaAnos = Array.from({ length: 8 }, (_, i) => anoAtual - 2 + i);

  const handleOpenFolder = (mes: string) => {
    // Navega para a URL estruturada: /[ano]/[mes]
    router.push(`/${anoSelecionado}/${mes}`);
  };

  return (
    <main 
      className="min-h-screen bg-slate-50 p-8 flex flex-col items-center"
      style={{
        // Cor alterada para #c2c2c2 e tamanho reduzido para 1.5px
        backgroundImage: 'radial-gradient(#c2c2c2 1.5px, transparent 1.5px)',
        backgroundSize: '24px 24px' // Espaçamento mantido
      }}
    >
      <div className="w-full max-w-5xl">
        
        {/* Cabeçalho com o Select de Ano */}
        <header className="flex flex-col md:flex-row justify-between items-center bg-white p-6 rounded-xl shadow-sm border border-slate-200 mb-8 gap-6 relative z-10">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-blue-100 rounded-full text-blue-600 shadow-inner">
              <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                <line x1="16" y1="2" x2="16" y2="6"></line>
                <line x1="8" y1="2" x2="8" y2="6"></line>
                <line x1="3" y1="10" x2="21" y2="10"></line>
              </svg>
            </div>
            <h1 className="text-3xl font-bold text-slate-800">Pastas de Despesas</h1>
          </div>

          <div className="flex items-center gap-3 bg-slate-50 p-3 rounded-lg border border-slate-200">
            <label htmlFor="anoSelect" className="text-sm font-semibold text-slate-600 uppercase tracking-wider">
              Ano Referência:
            </label>
            <select
              id="anoSelect"
              value={anoSelecionado}
              onChange={(e) => setAnoSelecionado(e.target.value)}
              className="border border-slate-300 p-2 rounded-lg text-lg bg-white font-bold text-blue-700 outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer shadow-sm transition-all"
            >
              {listaAnos.map((ano) => (
                <option key={ano} value={ano}>{ano}</option>
              ))}
            </select>
          </div>
        </header>

        {/* Grid com os Cards dos Meses */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 relative z-10">
          {meses.map((mes) => (
            <button
              key={mes.num}
              onClick={() => handleOpenFolder(mes.num)}
              className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 hover:border-blue-400 hover:shadow-lg hover:-translate-y-1 transition-all duration-200 flex flex-col items-center justify-center gap-4 group"
            >
              <div className="w-16 h-16 bg-slate-100 group-hover:bg-blue-50 rounded-2xl flex items-center justify-center text-slate-400 group-hover:text-blue-500 transition-colors transform group-hover:scale-110">
                <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"></path>
                </svg>
              </div>
              <span className="text-xl font-bold text-slate-700 group-hover:text-blue-700 transition-colors">
                {mes.nome}
              </span>
            </button>
          ))}
        </div>
        
      </div>
    </main>
  );
}