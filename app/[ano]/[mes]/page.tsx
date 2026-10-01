"use client";
import { useKanban } from "@/app/hooks/useKanban";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import ReplicateButton from "@/app/components/ui/ReplicateButton";
import CalculadoraModal from "@/app/components/CalculadoraModal";

export default function KanbanPage() {
  const {
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
  } = useKanban();

  if (loading) return <div className="p-8 text-center font-bold text-slate-500">Conectando ao MySQL...</div>;

  return (
    <main className="min-h-screen bg-slate-50 p-8 relative">
      <header className="mb-8 flex flex-col xl:flex-row justify-between items-start xl:items-center bg-white p-6 rounded-xl shadow-sm border border-slate-200 gap-6">
        <div>
          <h1 className="text-3xl font-bold text-slate-800 capitalize flex items-center gap-3">
            Kanban MySQL: {nomeMes} {ano}
          </h1>
          <div className="flex items-center gap-4 mt-4 flex-wrap">
            <button onClick={() => router.push('/pasta')} className="text-blue-600 text-sm hover:underline font-medium cursor-pointer">
              ← Voltar para Pastas
            </button>
            <span className="text-slate-300">|</span>
            <button onClick={handleAddNewFolder} className="text-emerald-600 text-sm font-bold hover:underline flex items-center gap-1 cursor-pointer">
              + Adicionar Novo Dia
            </button>
            <span className="text-slate-300">|</span>
            <button 
              onClick={() => setModalCalculadoraAberto(true)} 
              className="text-amber-600 text-sm font-bold hover:underline flex items-center gap-1 bg-amber-50 px-2.5 py-1 rounded border border-amber-200 transition-colors cursor-pointer"
            >
              🧮 Abrir Calculadora
            </button>
            <span className="text-slate-300">|</span>
            {!temContasNesteMes && (
              <ReplicateButton
                mesAtual={Number(mes)}
                anoAtual={Number(ano)}
                onSuccess={refresh}
              />
            )}
          </div>
        </div>

        <form onSubmit={handleAdd} className="flex flex-wrap gap-4 items-end bg-slate-50 p-4 rounded-lg border border-slate-200 w-full xl:w-auto">
          <div>
            <label className="block text-xs font-semibold text-slate-500 mb-1">Tipo</label>
            <select value={tipo} onChange={e => setTipo(e.target.value as any)} className="border border-slate-300 p-2 rounded text-sm bg-white font-medium outline-none">
              <option value="despesa">Despesa (Saída)</option>
              <option value="entrada">Receita (Entrada)</option>
            </select>
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-500 mb-1">Categoria</label>
            <select value={categoria} onChange={e => setCategoria(e.target.value)} className="border border-slate-300 p-2 rounded text-sm bg-white font-medium outline-none">
              <option value="Alimentação">Alimentação</option>
              <option value="Moradia">Moradia</option>
              <option value="Transporte">Transporte</option>
              <option value="Saúde">Saúde</option>
              <option value="Lazer">Lazer</option>
              <option value="Outros">Outros</option>
            </select>
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-500 mb-1">Descrição</label>
            <input value={desc} onChange={e => setDesc(e.target.value)} className="border border-slate-300 p-2 rounded w-48 text-sm outline-none bg-white" placeholder="Ex: Luz..." />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-500 mb-1">Valor</label>
            <input value={val} onChange={e => setVal(e.target.value)} type="number" step="0.01" className="border border-slate-300 p-2 rounded w-28 text-sm outline-none bg-white" placeholder="R$" />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-500 mb-1">Dia Recebimento</label>
            <select value={dia} onChange={e => setDia(e.target.value)} className="border border-slate-300 p-2 rounded text-sm bg-white capitalize outline-none">
              {allFoldersNames.map(f => <option key={f} value={f}>{f}</option>)}
            </select>
          </div>
          <button type="submit" className="bg-blue-600 text-white px-5 py-2 rounded text-sm font-bold hover:bg-blue-700 transition-all shadow-md cursor-pointer">
            Lançar
          </button>
        </form>
      </header>

      {/* Modal da Calculadora Flutuante e Arrastável */}
      {modalCalculadoraAberto && (
        <CalculadoraModal 
          onClose={() => setModalCalculadoraAberto(false)} 
          onSelectValue={(resultado) => setVal(resultado)} 
        />
      )}

      <DragDropContext onDragEnd={onDragEnd}>
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 items-start pb-6">
          {allFoldersNames.map((folderName) => {
            const cicloAtual = ciclos.find(c => c.titulo === folderName);
            const folderItems = cicloAtual ? cicloAtual.lancamentos : [];
            const folderItemsReal = folderItems.filter(e => !(e.descricao === "Início da Pasta" && e.valor === 0));

            const entradas = folderItemsReal.filter(e => e.tipo === "entrada");
            const despesas = folderItemsReal.filter(e => e.tipo === "despesa" || !e.tipo);

            const totalEntrada = entradas.reduce((acc, curr) => acc + curr.valor, 0);
            const totalPaid = despesas.filter((e) => e.status === "paga").reduce((acc, curr) => acc + curr.valor, 0);
            const totalPending = despesas.filter((e) => e.status === "pendente").reduce((acc, curr) => acc + curr.valor, 0);

            const totalDespesas = totalPaid + totalPending;
            const sobra = totalEntrada - totalDespesas;
            const isBaseFolder = baseFolders.includes(folderName);

            return (
              <div key={folderName} className="bg-slate-200/70 rounded-2xl w-full md:min-w-[400px] flex-1 p-3 shadow-sm border border-slate-300 flex flex-col h-[75vh]">
                <div className="flex justify-between items-center mb-3 ml-2 border-b-2 border-slate-300 pb-2">
                  <h2 className="text-xl font-bold text-slate-700 capitalize">{folderName}</h2>
                  {!isBaseFolder && (
                    <button
                      onClick={() => cicloAtual && handleRemoveFolder(cicloAtual.id, folderName)}
                      className="text-xs font-bold text-red-500 hover:text-red-700 mr-2 transition-colors bg-red-50 px-2 py-1 rounded border border-red-200 cursor-pointer"
                      title="Remover esta coluna inteira"
                    >
                      🗑️ Excluir Coluna
                    </button>
                  )}
                </div>

                <div className="flex flex-col gap-2 mb-4 bg-white p-4 rounded-xl shadow-sm border border-slate-200">
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-500 font-semibold">Entradas ({entradas.length}):</span>
                    <span className="text-blue-600 font-bold">R$ {totalEntrada.toFixed(2).replace(".", ",")}</span>
                  </div>

                  {entradas.length > 0 && (
                    <div className="flex flex-col gap-1 mb-2">
                      {entradas.map(entrada => (
                        <div key={entrada.id} className="flex justify-between items-center text-xs bg-blue-50 px-2 py-1 rounded">
                          <span className="text-slate-600 truncate mr-2">{entrada.descricao}</span>
                          <div className="flex items-center gap-2">
                            <span className="font-semibold text-blue-700">R$ {entrada.valor.toFixed(2)}</span>
                            <button onClick={() => deleteExpense(entrada.id)} className="text-slate-300 hover:text-red-500 cursor-pointer" title="Excluir">🗑️</button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  <div className="flex justify-between text-sm">
                    <span className="text-slate-500 font-semibold">Total Despesas:</span>
                    <span className="text-red-500 font-bold">R$ {totalDespesas.toFixed(2).replace(".", ",")}</span>
                  </div>
                  <hr className="my-1 border-slate-100" />
                  <div className="flex justify-between items-center">
                    <span className="text-slate-800 font-bold text-lg">Sobra:</span>
                    <span className={`font-bold text-lg px-2 py-1 rounded ${sobra >= 0 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                      R$ {sobra.toFixed(2).replace(".", ",")}
                    </span>
                  </div>

                  <div className="flex justify-between text-xs mt-2 border-t pt-2">
                    <span className="text-red-500 font-bold uppercase">Pendente: R$ {totalPending.toFixed(2)}</span>
                    <span className="text-green-600 font-bold uppercase">Pago: R$ {totalPaid.toFixed(2)}</span>
                  </div>
                </div>

                <Droppable droppableId={folderName}>
                  {(provided, snapshot) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.droppableProps}
                      className={`flex-1 overflow-y-auto pr-2 pb-10 flex flex-col gap-3 rounded-lg transition-colors ${snapshot.isDraggingOver ? 'bg-slate-200/50' : ''}`}
                      style={{ scrollbarWidth: 'thin', scrollbarColor: '#cbd5e1 transparent' }}
                    >
                      {despesas.length === 0 && (
                        <div className="text-center p-4 text-slate-400 text-sm font-medium border-2 border-dashed border-slate-300 rounded-lg">
                          Arraste as contas para cá
                        </div>
                      )}

                      {despesas.map((item, index) => (
                        <Draggable key={item.id.toString()} draggableId={item.id.toString()} index={index}>
                          {(provided, snapshot) => (
                            <div
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                              className={`p-4 rounded-xl border-l-8 shadow-sm transition-all duration-200 select-none
                                ${item.status === "paga" ? "border-green-500 bg-white" : "border-red-500 bg-white"}
                                ${snapshot.isDragging ? 'rotate-2 scale-105 shadow-2xl ring-2 ring-blue-400 z-50' : 'hover:shadow-md'}
                              `}
                            >
                              <div className="flex justify-between items-start mb-2 cursor-grab active:cursor-grabbing">
                                <span className="font-semibold text-slate-700">{item.descricao}</span>
                                <div className="flex items-center gap-3">
                                  <span className="font-bold text-slate-900">R$ {item.valor.toFixed(2).replace(".", ",")}</span>
                                  <button onClick={() => deleteExpense(item.id)} className="text-slate-300 hover:text-red-500 transition-colors cursor-pointer" title="Excluir Conta">
                                    🗑️
                                  </button>
                                </div>
                              </div>
                              
                              <div className="mb-2">
                                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">
                                  {item.categoria || "Outros"}
                                </span>
                              </div>

                              <div className="flex items-center justify-between mt-2">
                                <span className={`text-[10px] font-bold px-2 py-1 rounded uppercase tracking-wider ${item.status === "paga" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
                                  {item.status}
                                </span>
                                <button
                                  onClick={() => toggleStatus(item)}
                                  className={`text-xs px-3 py-1.5 rounded-lg font-bold text-white transition-all transform hover:scale-105 active:scale-95 cursor-pointer ${item.status === "paga" ? "bg-slate-400 hover:bg-slate-500" : "bg-green-500 hover:bg-green-600 shadow-md shadow-green-200"}`}
                                >
                                  {item.status === "paga" ? "Marcar Pendente" : "Pagar Conta"}
                                </button>
                              </div>
                            </div>
                          )}
                        </Draggable>
                      ))}
                      {provided.placeholder}
                    </div>
                  )}
                </Droppable>
              </div>
            );
          })}
        </div>
      </DragDropContext>
    </main>
  );
}