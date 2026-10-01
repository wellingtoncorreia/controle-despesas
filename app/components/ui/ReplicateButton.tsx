'use client';

import Swal from 'sweetalert2';
import { useState } from 'react';

interface ReplicateButtonProps {
  mesAtual: number;
  anoAtual: number;
  onSuccess?: () => void; // Callback opcional para recarregar a lista de despesas
}

export default function ReplicateButton({ mesAtual, anoAtual, onSuccess }: ReplicateButtonProps) {
  const [isLoading, setIsLoading] = useState(false);

  const handleReplicate = async () => {
    // Modal de Confirmação
    const result = await Swal.fire({
      title: 'Replicar despesas?',
      text: 'Isso copiará todas as despesas do mês anterior para o mês atual. Tem certeza?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sim, replicar',
      cancelButtonText: 'Cancelar'
    });

    if (result.isConfirmed) {
      setIsLoading(true);

      // Modal de Loading
      Swal.fire({
        title: 'Processando...',
        text: 'Copiando despesas...',
        allowOutsideClick: false,
        didOpen: () => {
          Swal.showLoading();
        }
      });

      try {
        const response = await fetch('/api/expenses/replicate', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ mes: mesAtual, ano: anoAtual })
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || 'Erro desconhecido ao replicar despesas.');
        }

        // Modal de Sucesso
        await Swal.fire({
          title: 'Sucesso!',
          text: `${data.count} despesas foram replicadas.`,
          icon: 'success',
          confirmButtonColor: '#3085d6'
        });

        if (onSuccess) onSuccess();

      } catch (error: any) {
        // Modal de Erro (Geralmente acionado se já existirem despesas no mês)
        Swal.fire({
          title: 'Ação não permitida',
          text: error.message,
          icon: 'warning',
          confirmButtonColor: '#3085d6'
        });
      } finally {
        setIsLoading(false);
      }
    }
  };

  return (
    <button
      onClick={handleReplicate}
      disabled={isLoading}
      className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded shadow disabled:opacity-50 transition-colors"
    >
      Replicar Mês Anterior
    </button>
  );
}