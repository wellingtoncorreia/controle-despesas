export type StatusLancamento = 'pendente' | 'paga';

export interface Lancamento {
  id: string;
  descricao: string;
  valor: number;
  status: StatusLancamento;
  diaPagamento: string;
  ano: string;
  mes: string;
  tipo: 'entrada' | 'despesa';
  categoria?: string; // <-- Adicionado aqui para o item já existente
}

// Se você tiver um tipo específico para a criação/adicionamento (ex: addExpense), inclua nele também:
export interface InputLancamento {
  descricao: string;
  valor: number;
  tipo: 'entrada' | 'despesa';
  diaPagamento: string;
  categoria?: string; // <-- Adicionado aqui para o payload de envio
}