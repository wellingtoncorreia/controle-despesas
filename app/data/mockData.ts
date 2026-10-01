export type Expense = {
  id: string;
  description: string;
  amount: number;
  status: "pendente" | "paga";
  folder: "15 Setembro 2026" | "20 Setembro 2026" | "30 Setembro 2026";
};

export const initialExpenses: Expense[] = [
  { id: "1", description: "Escolinha da Mônica", amount: 329.40, status: "pendente", folder: "15 Setembro 2026" },
  { id: "2", description: "Gasolina", amount: 100.00, status: "pendente", folder: "15 Setembro 2026" },
  { id: "3", description: "Internet do pai", amount: 110.00, status: "paga", folder: "20 Setembro 2026" },
  { id: "4", description: "Material escolinha", amount: 300.09, status: "paga", folder: "20 Setembro 2026" },
  { id: "5", description: "Pedágio", amount: 24.00, status: "pendente", folder: "20 Setembro 2026" },
  { id: "6", description: "Faculdade da Gui", amount: 1421.11, status: "paga", folder: "30 Setembro 2026" },
  { id: "7", description: "Mistura", amount: 350.00, status: "pendente", folder: "30 Setembro 2026" },
  { id: "8", description: "Luz", amount: 280.00, status: "paga", folder: "30 Setembro 2026" },
];