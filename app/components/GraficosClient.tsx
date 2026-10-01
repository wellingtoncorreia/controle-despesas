"use client";

import { 
  ResponsiveContainer, 
  PieChart, 
  Pie, 
  Cell, 
  Tooltip, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Legend 
} from "recharts";

const CORES = ['#3b82f6', '#ef4444', '#10b981', '#f59e0b', '#8b5cf6', '#ec4899', '#64748b'];

interface GraficoProps {
  dados: { name: string; valor: number }[];
}

export default function GraficosClient({ dados }: GraficoProps) {
  if (dados.length === 0) {
    return (
      <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200 text-center py-12 text-slate-400 font-medium">
        Nenhuma despesa registada neste mês para exibir nos gráficos.
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      
      {/* Gráfico de Pizza */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 flex flex-col items-center">
        <h3 className="text-lg font-bold text-slate-800 mb-4 w-left self-start">
          🍰 Distribuição por Categoria (Pizza)
        </h3>
        <div className="w-full h-80">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={dados}
                dataKey="valor"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={100}
                innerRadius={60}
                paddingAngle={4}
                label={({ name, percent = 0 }) => `${name} (${(percent * 100).toFixed(0)}%)`}
              >
                {dados.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={CORES[index % CORES.length]} />
                ))}
              </Pie>
              <Tooltip formatter={(value: any) => `R$ ${Number(value).toFixed(2).replace('.', ',')}`} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Gráfico de Barras */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 flex flex-col items-center">
        <h3 className="text-lg font-bold text-slate-800 mb-4 self-start">
          📊 Comparativo de Gastos (Barras)
        </h3>
        <div className="w-full h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={dados} margin={{ top: 10, right: 30, left: 0, bottom: 25 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis 
                dataKey="name" 
                angle={-20} 
                textAnchor="end" 
                interval={0} 
                tick={{ fontSize: 12 }} 
              />
              <YAxis tickFormatter={(val) => `R$ ${val}`} />
              <Tooltip formatter={(value: any) => `R$ ${Number(value).toFixed(2).replace('.', ',')}`} />
              <Bar dataKey="valor" fill="#3b82f6" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

    </div>
  );
}