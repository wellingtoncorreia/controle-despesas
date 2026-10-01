import { NextResponse } from 'next/server';
import { prisma } from '@/src/lib/prisma';

// GET: Retorna os lançamentos e pastas de um determinado mês e ano
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const ano = searchParams.get('ano');
  const mes = searchParams.get('mes');

  if (!ano || !mes) {
    return NextResponse.json({ error: 'Ano e mês são obrigatórios' }, { status: 400 });
  }

  try {
    // Busca os ciclos (pastas/dias) daquele mês e ano
    const ciclos = await prisma.ciclo.findMany({
      where: { ano, mes },
      include: { lancamentos: true },
    });

    return NextResponse.json(ciclos);
  } catch (error) {
    return NextResponse.json({ error: 'Erro ao buscar dados do banco' }, { status: 500 });
  }
}

// POST: Cria uma nova despesa/entrada ou nova pasta/dia
export async function POST(request: Request) {
  const body = await request.json();
  const { descricao, valor, status, tipo, diaPagamento, ano, mes } = body;

  try {
    // 1. Verifica se a pasta (ciclo) já existe para esse dia/mês/ano
    let ciclo = await prisma.ciclo.findFirst({
      where: { titulo: diaPagamento, ano, mes },
    });

    // Se a pasta não existir, cria ela automaticamente
    if (!ciclo) {
      ciclo = await prisma.ciclo.create({
        data: { titulo: diaPagamento, mes, ano },
      });
    }

    // 2. Cria o lançamento vinculado a essa pasta
    const novoLancamento = await prisma.lancamento.create({
      data: {
        descricao,
        valor: Number(valor),
        status: status || (tipo === 'entrada' ? 'paga' : 'pendente'),
        tipo: tipo || 'despesa',
        cicloId: ciclo.id,
      },
    });

    return NextResponse.json(novoLancamento);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Erro ao salvar no banco' }, { status: 500 });
  }
}

// PUT: Atualiza status (pago/pendente) ou move de pasta
export async function PUT(request: Request) {
  const body = await request.json();
  const { id, status, novoDia, ano, mes } = body;

  try {
    const lancamentoId = Number(id);

    // Se estiver movendo de coluna (arrastando o card)
    if (novoDia) {
      let cicloDestino = await prisma.ciclo.findFirst({
        where: { titulo: novoDia, ano, mes },
      });

      if (!cicloDestino) {
        cicloDestino = await prisma.ciclo.create({
          data: { titulo: novoDia, mes, ano },
        });
      }

      const atualizado = await prisma.lancamento.update({
        where: { id: lancamentoId },
        data: { cicloId: cicloDestino.id },
      });

      return NextResponse.json(atualizado);
    }

    // Se for apenas alteração de status (Pago / Pendente)
    const atualizado = await prisma.lancamento.update({
      where: { id: lancamentoId },
      data: { status },
    });

    return NextResponse.json(atualizado);
  } catch (error) {
    return NextResponse.json({ error: 'Erro ao atualizar dados' }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');
  const tipoDelecao = searchParams.get('tipo'); // 'lancamento' ou 'ciclo'

  if (!id) return NextResponse.json({ error: 'ID obrigatório' }, { status: 400 });

  try {
    if (tipoDelecao === 'ciclo') {
      // Deleta o ciclo inteiro (a coluna e tudo o que está dentro dela)
      await prisma.ciclo.delete({
        where: { id: Number(id) },
      });
    } else {
      // Deleta apenas um lançamento específico
      await prisma.lancamento.delete({
        where: { id: Number(id) },
      });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Erro ao deletar registro' }, { status: 500 });
  }
}