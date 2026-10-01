import { NextResponse } from 'next/server';
// Ajuste o caminho do import do prisma conforme a pasta onde você salvou aquele arquivo de configuração
import { prisma } from '@/src/lib/prisma'; 

const getNomeMes = (numeroMes: string) => {
  const meses: Record<string, string> = {
    "01": "janeiro", "02": "fevereiro", "03": "março", "04": "abril",
    "05": "maio", "06": "junho", "07": "julho", "08": "agosto",
    "09": "setembro", "10": "outubro", "11": "novembro", "12": "dezembro"
  };
  return meses[numeroMes] || "";
};

export async function POST(request: Request) {
  try {
    const { mes, ano } = await request.json();

    // Converte e formata o mês/ano atual (Ex: 9 -> "09", 2026 -> "2026")
    const mesAtualStr = String(mes).padStart(2, '0');
    const anoAtualStr = String(ano);
    const nomeMesAtual = getNomeMes(mesAtualStr);

    // Calcula e formata o mês/ano anterior
    const numMesAnterior = Number(mes) === 1 ? 12 : Number(mes) - 1;
    const numAnoAnterior = Number(mes) === 1 ? Number(ano) - 1 : Number(ano);
    
    const mesAnteriorStr = String(numMesAnterior).padStart(2, '0');
    const anoAnteriorStr = String(numAnoAnterior);

    // 1. Verifica se já existem lançamentos no mês atual
    const ciclosAtuais = await prisma.ciclo.findMany({
      where: { mes: mesAtualStr, ano: anoAtualStr },
      include: { lancamentos: true }
    });

    // Filtra para ver se tem lançamentos reais (ignora o "Início da Pasta" de colunas vazias)
    const temLancamentosReais = ciclosAtuais.some(ciclo => 
      ciclo.lancamentos.some(l => l.descricao !== "Início da Pasta")
    );

    if (temLancamentosReais) {
      return NextResponse.json(
        { message: 'Já existem despesas lançadas neste mês. A replicação não é permitida.' },
        { status: 400 }
      );
    }

    // 2. Busca os ciclos (colunas) e lançamentos do mês anterior
    const ciclosAnteriores = await prisma.ciclo.findMany({
      where: { mes: mesAnteriorStr, ano: anoAnteriorStr },
      include: { lancamentos: true }
    });

    if (ciclosAnteriores.length === 0) {
      return NextResponse.json(
        { message: 'Não há pastas no mês anterior para replicar.' },
        { status: 404 }
      );
    }

    let totalReplicado = 0;

    // 3. Replicação dos dados
    for (const cicloAntigo of ciclosAnteriores) {
      // Pula ciclos que não tem nenhum lançamento
      if (cicloAntigo.lancamentos.length === 0) continue;

      // Extrai o dia do título antigo (Ex: de "15 setembro 2026" tira o "15")
      const dia = cicloAntigo.titulo.split(" ")[0]; 
      
      // Cria o novo título (Ex: "15 outubro 2026")
      const novoTitulo = `${dia} ${nomeMesAtual} ${anoAtualStr}`;

      // Verifica se a pasta atual já existe (pode ter sido criada vazia)
      let cicloAtual = ciclosAtuais.find(c => c.titulo === novoTitulo);

      // Se a pasta não existir, cria uma nova
     // Se a pasta não existir, cria uma nova
      if (!cicloAtual) {
        cicloAtual = await prisma.ciclo.create({
          data: {
            titulo: novoTitulo,
            mes: mesAtualStr,
            ano: anoAtualStr
          },
          include: { 
            lancamentos: true // <- Adicionando isso resolve o erro
          }
        });
      }

      // Prepara os lançamentos, excluindo os iniciais padrão, e reseta o status para "pendente"
      const novosLancamentos = cicloAntigo.lancamentos
        .filter(l => l.descricao !== "Início da Pasta")
        .map(l => ({
          descricao: l.descricao,
          valor: l.valor,
          tipo: l.tipo,
          status: 'pendente', // Volta como pendente no novo mês
          cicloId: cicloAtual!.id
        }));

      // Salva os lançamentos copiados
      if (novosLancamentos.length > 0) {
        await prisma.lancamento.createMany({
          data: novosLancamentos
        });
        totalReplicado += novosLancamentos.length;
      }
    }

    if (totalReplicado === 0) {
      return NextResponse.json(
        { message: 'Não havia lançamentos válidos no mês anterior.' },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, count: totalReplicado });

  } catch (error) {
    console.error('Erro ao replicar:', error);
    return NextResponse.json({ message: 'Erro interno no servidor' }, { status: 500 });
  }
}