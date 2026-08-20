export const dynamic = 'force-dynamic'

import Link from 'next/link'
import { supabase } from '@/lib/supabase'

export default async function DashboardPage() {
  const hoje = new Date().toISOString().split('T')[0]
  const inicioMes = new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString().split('T')[0]

  const [
    { data: pedidosAtivos },
    { data: pedidosEntregues },
    { data: pedidosMes },
    { data: clientes },
    { data: itensPendentes },
    { data: entregasSemana },
    { data: gastosMes },
  ] = await Promise.all([
    supabase.from('pedidos').select('id').not('status', 'eq', 'PAGO'),
    supabase.from('pedidos').select('total').eq('status', 'ENTREGUE'),
    supabase.from('pedidos').select('total').eq('status', 'PAGO').gte('data', inicioMes),
    supabase.from('clientes').select('id'),
    supabase.from('pedido_itens').select('quantidade, produto_id, produtos(nome)').eq('produzido', false),
    supabase.from('pedidos').select('data, clientes(nome), pedido_itens(quantidade)').not('status', 'eq', 'PAGO').gte('data', hoje).order('data').limit(5),
    supabase.from('gastos').select('valor').gte('data', inicioMes),
  ])

  const totalReceber = (pedidosEntregues ?? []).reduce((acc, p) => acc + (p.total ?? 0), 0)
  const totalMes = (pedidosMes ?? []).reduce((acc, p) => acc + (p.total ?? 0), 0)
  const totalGastosMes = (gastosMes ?? []).reduce((acc, g) => acc + (g.valor ?? 0), 0)

  const totaisProdutos: Record<string, { nome: string; total: number }> = {}
  ;(itensPendentes ?? []).forEach((item: any) => {
    const id = item.produto_id
    const nome = item.produtos?.nome ?? 'Desconhecido'
    if (!totaisProdutos[id]) totaisProdutos[id] = { nome, total: 0 }
    totaisProdutos[id].total += item.quantidade
  })

  const cards = [
    { label: 'Pedidos ativos', valor: pedidosAtivos?.length ?? 0, cor: 'bg-amber-50 border-amber-200', texto: 'text-amber-700', href: '/pedidos' },
    { label: 'A receber', valor: `R$ ${totalReceber.toFixed(2)}`, cor: 'bg-green-50 border-green-200', texto: 'text-green-700', href: '/pedidos' },
    { label: 'Vendido no mês', valor: `R$ ${totalMes.toFixed(2)}`, cor: 'bg-blue-50 border-blue-200', texto: 'text-blue-700', href: '/pedidos-fechados' },
    { label: 'Total de clientes', valor: clientes?.length ?? 0, cor: 'bg-purple-50 border-purple-200', texto: 'text-purple-700', href: '/clientes' },
    { label: 'Gastos no mês', valor: `R$ ${totalGastosMes.toFixed(2)}`, cor: 'bg-red-50 border-red-200', texto: 'text-red-700', href: '/gastos' },
  ]

  return (
    <main className="p-6 max-w-5xl">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Raízes — Pão de mel</h1>
        <p className="text-gray-500 text-sm mt-1">Dashboard</p>
      </div>

      {/* Cards de resumo */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8">
        {cards.map(card => (
          <Link key={card.label} href={card.href}>
            <div className={`border rounded-xl p-4 hover:shadow-md transition-shadow cursor-pointer ${card.cor}`}>
              <p className="text-xs text-gray-500 mb-1">{card.label}</p>
              <p className={`text-2xl font-bold ${card.texto}`}>{card.valor}</p>
            </div>
          </Link>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

        {/* Falta produzir */}
        <div className="bg-amber-900 text-white rounded-xl p-5">
          <h2 className="text-sm font-bold uppercase tracking-wide opacity-75 mb-4">Falta produzir</h2>
          {Object.keys(totaisProdutos).length === 0 ? (
            <p className="text-amber-200 text-sm">Nada a produzir por enquanto!</p>
          ) : (
            <div className="flex flex-col gap-3">
              {Object.values(totaisProdutos).map(p => (
                <div key={p.nome} className="flex items-baseline gap-3">
                  <span className="text-3xl font-bold text-amber-300">{p.total}</span>
                  <span className="text-sm">{p.nome}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Próximas entregas */}
        <div className="bg-white border border-gray-200 rounded-xl p-5">
          <h2 className="text-sm font-bold uppercase tracking-wide text-gray-400 mb-4">Próximas entregas</h2>
          {!entregasSemana || entregasSemana.length === 0 ? (
            <p className="text-gray-400 text-sm">Nenhuma entrega próxima.</p>
          ) : (
            <div className="flex flex-col gap-3">
              {entregasSemana.map((p: any) => (
                <div key={p.id} className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-sm">{p.clientes?.nome ?? '—'}</p>
                    <p className="text-xs text-gray-400">{p.data}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Atalhos */}
        <div className="bg-white border border-gray-200 rounded-xl p-5 md:col-span-2">
          <h2 className="text-sm font-bold uppercase tracking-wide text-gray-400 mb-4">Atalhos</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {[
              { label: '+ Novo Pedido', href: '/pedidos/novo', cor: 'bg-blue-600 text-white hover:bg-blue-700' },
              { label: '+ Novo Cliente', href: '/clientes/novo', cor: 'bg-gray-900 text-white hover:bg-black' },
              { label: '+ Nova Compra', href: '/compras/novo', cor: 'bg-gray-100 text-gray-800 hover:bg-gray-200' },
              { label: 'Ver Kanban', href: '/pedidos', cor: 'bg-amber-100 text-amber-800 hover:bg-amber-200' },
            ].map(a => (
              <Link key={a.label} href={a.href}>
                <div className={`rounded-xl p-4 text-center text-sm font-semibold transition-colors cursor-pointer ${a.cor}`}>
                  {a.label}
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </main>
  )
}
