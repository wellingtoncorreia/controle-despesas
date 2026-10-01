import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useExpenses } from "@/app/hooks/useExpenses";
import { DropResult } from "@hello-pangea/dnd";

export function useKanban() {
  const params = useParams();
  const router = useRouter();
  const ano = params.ano as string;
  const mes = params.mes as string;

  const { ciclos, loading, addExpense, toggleStatus, moveExpense, deleteExpense, deleteCiclo, refresh } = useExpenses(ano, mes);
  
  const getNomeMes = (numeroMes: string) => {
    const meses: Record<string, string> = {
      "01": "janeiro", "02": "fevereiro", "03": "março", "04": "abril",
      "05": "maio", "06": "junho", "07": "julho", "08": "agosto",
      "09": "setembro", "10": "outubro", "11": "novembro", "12": "dezembro"
    };
    return meses[numeroMes] || "";
  };

  const nomeMes = getNomeMes(mes);
  const temContasNesteMes = ciclos.some(ciclo => ciclo.lancamentos.some(l => l.descricao !== "Início da Pasta"));
  const baseFolders = [`15 ${nomeMes} ${ano}`, `20 ${nomeMes} ${ano}`, `30 ${nomeMes} ${ano}`];

  const allFoldersNames = Array.from(new Set([
    ...baseFolders,
    ...ciclos.map(c => c.titulo)
  ])).sort((a, b) => {
    const diaA = parseInt(a.split(" ")[0]) || 0;
    const diaB = parseInt(b.split(" ")[0]) || 0;
    return diaA - diaB;
  });

  const [desc, setDesc] = useState("");
  const [val, setVal] = useState("");
  const [dia, setDia] = useState(baseFolders[0]);
  const [tipo, setTipo] = useState<"despesa" | "entrada">("despesa");
  const [categoria, setCategoria] = useState("Outros");
  const [modalCalculadoraAberto, setModalCalculadoraAberto] = useState(false);

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!desc || !val || !dia) return;
    await addExpense({ descricao: desc, valor: Number(val), tipo, diaPagamento: dia, categoria });
    setDesc(""); 
    setVal(""); 
    setCategoria("Outros");
  };

  const handleAddNewFolder = async () => {
    const novoDia = prompt("Digite o dia para a nova coluna (Ex: 05, 10, 25):");
    if (novoDia && !isNaN(Number(novoDia))) {
      const nomePasta = `${novoDia.padStart(2, '0')} ${nomeMes} ${ano}`;
      if (allFoldersNames.includes(nomePasta)) {
        alert("Esta coluna já existe!");
        setDia(nomePasta);
        return;
      }
      await addExpense({
        descricao: "Início da Pasta",
        valor: 0,
        tipo: "entrada",
        diaPagamento: nomePasta,
        categoria: "Outros"
      });
      setDia(nomePasta);
      refresh();
    } else if (novoDia) {
      alert("Por favor, digite apenas números para o dia.");
    }
  };

  const handleRemoveFolder = async (cicloId: number, folderName: string) => {
    if (confirm(`Tem certeza que deseja remover a coluna "${folderName}" e todos os seus lançamentos?`)) {
      await deleteCiclo(cicloId);
      setDia(baseFolders[0]);
    }
  };

  const onDragEnd = (result: DropResult) => {
    const { destination, source, draggableId } = result;
    if (!destination) return;
    if (destination.droppableId === source.droppableId && destination.index === source.index) return;
    moveExpense(draggableId, destination.droppableId);
  };

  return {
    ano,
    mes,
    nomeMes,
    ciclos,
    loading,
    temContasNesteMes,
    baseFolders,
    allFoldersNames,
    desc, setDesc,
    val, setVal,
    dia, setDia,
    tipo, setTipo,
    categoria, setCategoria,
    modalCalculadoraAberto, setModalCalculadoraAberto,
    handleAdd,
    handleAddNewFolder,
    handleRemoveFolder,
    onDragEnd,
    toggleStatus,
    deleteExpense,
    refresh,
    router
  };
}