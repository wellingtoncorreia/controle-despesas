import Link from "next/link";
import { prisma } from "@/src/lib/prisma";
import GraficosClient from "./components/GraficosClient";

export default async function DashboardHome() {
  const dataAtual = new Date();
  const mesAtualStr = String(dataAtual.getMonth() + 1).padStart(2, '0');
  const anoAtualStr = String(dataAtual.getFullYear());

  const nomesMeses: Record<string, string> = {
    "01": "Janeiro", "02": "Fevereiro", "03": "Março", "04": "Abril",
    "05": "Maio", "06": "Junho", "07": "Julho", "08": "Agosto",
    "09": "Setembro", "10": "Outubro", "11": "Novembro", "12": "Dezembro"
  };

  const ciclos = await prisma.ciclo.findMany({
    where: { mes: mesAtualStr, ano: anoAtualStr },
    include: { lancamentos: true }
  });

  const totaisPorCategoria: Record<string, number> = {};
  let totalDespesas = 0;
  let totalEntradas = 0;

  ciclos.forEach(ciclo => {
    ciclo.lancamentos.forEach(lancamento => {
      if (lancamento.descricao !== "Início da Pasta") {
        if (lancamento.tipo === "despesa") {
          const cat = lancamento.categoria || "Outros";
          totaisPorCategoria[cat] = (totaisPorCategoria[cat] || 0) + lancamento.valor;
          totalDespesas += lancamento.valor;
        } else if (lancamento.tipo === "entrada") {
          totalEntradas += lancamento.valor;
        }
      }
    });
  });

  const saldoRestante = totalEntradas - totalDespesas;

  // Formata os dados para o formato que o Recharts aceita (Array de objetos)
  const dadosGrafico = Object.entries(totaisPorCategoria).map(([categoria, valor]) => ({
    name: categoria,
    valor: Number(valor.toFixed(2))
  })).sort((a, b) => b.valor - a.valor);

  return (
    <main 
      className="min-h-screen bg-slate-50 p-8 flex flex-col items-center"
      style={{
        backgroundImage: 'radial-gradient(#c2c2c2 1.5px, transparent 1.5px)',
        backgroundSize: '24px 24px'
      }}
    >
      <div className="w-full max-w-6xl relative z-10">
        
        {/* Cabeçalho */}
        <header className="flex flex-col md:flex-row justify-between items-center mb-8 bg-white p-6 rounded-2xl shadow-sm border border-slate-200 gap-4">
          <div>
            <h1 className="text-3xl font-bold text-slate-800">Visão Geral</h1>
            <p className="text-slate-500 text-sm mt-1 capitalize">
              Resumo financeiro de {nomesMeses[mesAtualStr]} de {anoAtualStr}
            </p>
          </div>
          <Link 
            href="/pasta" 
            className="bg-blue-600 text-white px-5 py-3 rounded-xl font-bold hover:bg-blue-700 transition shadow-sm flex items-center gap-2"
          >
            📂 Aceder Kanban (Meses)
          </Link>
        </header>

        {/* Cartões de Resumo */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 flex flex-col justify-between">
            <span className="text-slate-500 font-semibold text-sm">Total de Entradas</span>
            <p className="text-3xl font-bold text-blue-600 mt-2">
              R$ {totalEntradas.toFixed(2).replace(".", ",")}
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 flex flex-col justify-between">
            <span className="text-slate-500 font-semibold text-sm">Total de Despesas</span>
            <p className="text-3xl font-bold text-red-500 mt-2">
              R$ {totalDespesas.toFixed(2).replace(".", ",")}
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 flex flex-col justify-between">
            <span className="text-slate-500 font-semibold text-sm">Saldo Restante</span>
            <p className={`text-3xl font-bold mt-2 ${saldoRestante >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              R$ {saldoRestante.toFixed(2).replace(".", ",")}
            </p>
          </div>
        </div>

        {/* Componente Client para exibir os Gráficos de Pizza e Barras */}
        <GraficosClient dados={dadosGrafico} />

      </div>
    </main>
  );
}