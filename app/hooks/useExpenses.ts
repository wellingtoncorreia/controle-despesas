import { useState, useEffect } from 'react';

export interface Lancamento {
  id: number;
  descricao: string;
  valor: number;
  status: 'pendente' | 'paga';
  tipo: 'entrada' | 'despesa';
  cicloId: number;
  categoria?: string;
}

export interface CicloKanban {
  id: number;
  titulo: string; // Ex: "15 setembro 2026"
  lancamentos: Lancamento[];
}

export function useExpenses(ano: string, mes: string) {
  const [ciclos, setCiclos] = useState<CicloKanban[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchCiclos = async () => {
    if (!ano || !mes) return;
    setLoading(true);
    const res = await fetch(`/api/expenses?ano=${ano}&mes=${mes}`);
    const data = await res.json();
    setCiclos(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchCiclos();
  }, [ano, mes]);

  const addExpense = async (expense: { descricao: string; valor: number; tipo: 'entrada' | 'despesa'; diaPagamento: string; categoria?: string; }) => {
    await fetch('/api/expenses', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...expense, ano, mes }),
    });
    fetchCiclos();
  };

  const toggleStatus = async (item: Lancamento) => {
    const novoStatus = item.status === 'pendente' ? 'paga' : 'pendente';
    await fetch('/api/expenses', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: item.id, status: novoStatus }),
    });
    fetchCiclos();
  };

  const moveExpense = async (id: string | number, novoDia: string) => {
    await fetch('/api/expenses', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, novoDia, ano, mes }),
    });
    fetchCiclos();
  };

  const deleteExpense = async (id: number) => {
    await fetch(`/api/expenses?id=${id}`, { method: 'DELETE' });
    fetchCiclos();
  };

  // NOVA FUNÇÃO: Deleta a coluna/ciclo inteiro
  const deleteCiclo = async (cicloId: number) => {
    await fetch(`/api/expenses?id=${cicloId}&tipo=ciclo`, { method: 'DELETE' });
    fetchCiclos();
  };

  return { ciclos, loading, addExpense, toggleStatus, moveExpense, deleteExpense, deleteCiclo, refresh: fetchCiclos };
}