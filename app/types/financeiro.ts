export type StatusLancamento = 'pendente' | 'paga';

export interface Lancamento {
  id: string;
  descricao: string;
  valor: number;
  status: StatusLancamento;
  diaPagamento: string;
  ano: string;
  mes: string;
  tipo: 'entrada' | 'despesa'; // <-- Adicionado aqui
}