"use client";
import { useState, useRef } from "react";

interface CalculadoraModalProps {
  onClose: () => void;
  onSelectValue: (valor: string) => void;
}

export default function CalculadoraModal({ onClose, onSelectValue }: CalculadoraModalProps) {
  const [calcDisplay, setCalcDisplay] = useState("0");
  const [calcEquation, setCalcEquation] = useState("");
  
  // Posição para arrastar o modal pela tela
  const [position, setPosition] = useState({ x: 100, y: 100 });
  const isDragging = useRef(false);
  const dragOffset = useRef({ x: 0, y: 0 });

  const handleMouseDown = (e: React.MouseEvent) => {
    isDragging.current = true;
    dragOffset.current = {
      x: e.clientX - position.x,
      y: e.clientY - position.y
    };
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging.current) return;
    setPosition({
      x: e.clientX - dragOffset.current.x,
      y: e.clientY - dragOffset.current.y
    });
  };

  const handleMouseUp = () => {
    isDragging.current = false;
  };

  const handleCalcClick = (valor: string) => {
    if (calcDisplay === "0" || calcDisplay === "Erro") {
      setCalcDisplay(valor);
    } else {
      setCalcDisplay(calcDisplay + valor);
    }
  };

  const handleCalcClear = () => {
    setCalcDisplay("0");
    setCalcEquation("");
  };

  const handleCalcCalculate = () => {
    try {
      const sanitized = calcDisplay.replace(/,/g, '.');
      // eslint-disable-next-line no-eval
      const resultado = eval(sanitized);
      setCalcEquation(calcDisplay + " =");
      setCalcDisplay(String(resultado));
    } catch {
      setCalcDisplay("Erro");
    }
  };

  const handleEnviarValor = () => {
    const limpo = calcDisplay.replace(/,/g, '.');
    if (!isNaN(Number(limpo))) {
      onSelectValue(limpo);
      onClose();
    }
  };

  return (
    <div 
      className="fixed z-50 cursor-move select-none"
      style={{ left: `${position.x}px`, top: `${position.y}px` }}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
    >
      <div 
        className="bg-slate-900 text-white p-4 rounded-2xl shadow-2xl w-72 border border-slate-700 flex flex-col gap-3"
        onMouseDown={handleMouseDown}
      >
        <div className="flex justify-between items-center text-xs text-slate-400 font-semibold border-b border-slate-800 pb-1">
          <span>🧮 Calculadora (Arraste aqui)</span>
          <button onClick={onClose} className="hover:text-white cursor-pointer px-1">✕</button>
        </div>
        <div className="bg-slate-950 p-3 rounded-lg text-right cursor-default">
          <div className="text-xs text-slate-400 h-4">{calcEquation}</div>
          <div className="text-2xl font-mono font-bold tracking-wider truncate">{calcDisplay}</div>
        </div>
        <div className="grid grid-cols-4 gap-1.5 text-sm font-bold" onMouseDown={(e) => e.stopPropagation()}>
          <button onClick={handleCalcClear} className="bg-red-500/20 text-red-400 hover:bg-red-500/30 p-2 rounded">C</button>
          <button onClick={() => handleCalcClick("(")} className="bg-slate-800 hover:bg-slate-700 p-2 rounded">(</button>
          <button onClick={() => handleCalcClick(")")} className="bg-slate-800 hover:bg-slate-700 p-2 rounded">)</button>
          <button onClick={() => handleCalcClick("/")} className="bg-blue-600/30 text-blue-400 hover:bg-blue-600/40 p-2 rounded">÷</button>
          
          <button onClick={() => handleCalcClick("7")} className="bg-slate-800 hover:bg-slate-700 p-2 rounded">7</button>
          <button onClick={() => handleCalcClick("8")} className="bg-slate-800 hover:bg-slate-700 p-2 rounded">8</button>
          <button onClick={() => handleCalcClick("9")} className="bg-slate-800 hover:bg-slate-700 p-2 rounded">9</button>
          <button onClick={() => handleCalcClick("*")} className="bg-blue-600/30 text-blue-400 hover:bg-blue-600/40 p-2 rounded">×</button>
          
          <button onClick={() => handleCalcClick("4")} className="bg-slate-800 hover:bg-slate-700 p-2 rounded">4</button>
          <button onClick={() => handleCalcClick("5")} className="bg-slate-800 hover:bg-slate-700 p-2 rounded">5</button>
          <button onClick={() => handleCalcClick("6")} className="bg-slate-800 hover:bg-slate-700 p-2 rounded">6</button>
          <button onClick={() => handleCalcClick("-")} className="bg-blue-600/30 text-blue-400 hover:bg-blue-600/40 p-2 rounded">-</button>
          
          <button onClick={() => handleCalcClick("1")} className="bg-slate-800 hover:bg-slate-700 p-2 rounded">1</button>
          <button onClick={() => handleCalcClick("2")} className="bg-slate-800 hover:bg-slate-700 p-2 rounded">2</button>
          <button onClick={() => handleCalcClick("3")} className="bg-slate-800 hover:bg-slate-700 p-2 rounded">3</button>
          <button onClick={() => handleCalcClick("+")} className="bg-blue-600/30 text-blue-400 hover:bg-blue-600/40 p-2 rounded">+</button>
          
          <button onClick={() => handleCalcClick("0")} className="bg-slate-800 hover:bg-slate-700 p-2 rounded col-span-2">0</button>
          <button onClick={() => handleCalcClick(".")} className="bg-slate-800 hover:bg-slate-700 p-2 rounded">.</button>
          <button onClick={handleCalcCalculate} className="bg-blue-600 hover:bg-blue-500 p-2 rounded text-white">=</button>
        </div>
        <button 
          onClick={handleEnviarValor} 
          className="bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold py-2 rounded-lg transition-colors shadow cursor-pointer"
          onMouseDown={(e) => e.stopPropagation()}
        >
          📥 Enviar Valor para o Campo "Valor"
        </button>
      </div>
    </div>
  );
}