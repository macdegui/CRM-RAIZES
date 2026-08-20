export const dynamic = 'force-dynamic'

import { supabase } from '@/lib/supabase'
import { Pedido, Cliente } from '@/types'

export default async function PedidosFechadosPage() {
  const [{ data: pedidos, error }, { data: clientes }] = await Promise.all([
    supabase.from('pedidos').select('*').eq('status', 'PAGO').order('data', { ascending: false }),
    supabase.from('clientes').select('*'),
  ])

  if (error) return <p>Erro ao carregar pedidos: {error.message}</p>

  const clientesMap = Object.fromEntries((clientes ?? []).map((c: Cliente) => [c.id, c.nome]))
  const total = (pedidos ?? []).reduce((acc, p) => acc + Number(p.total ?? 0), 0)

  return (
    <main className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-xl font-bold text-gray-900">Pedidos Fechados</h1>
          <p className="text-sm text-gray-500 mt-0.5">{pedidos.length} pedidos · R$ {total.toFixed(2)} faturado</p>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        {pedidos.length === 0 ? (
          <div className="p-12 text-center text-gray-400 text-sm">Nenhum pedido fechado ainda.</div>
        ) : (
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-100">
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Código</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Data</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Cliente</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Pagamento</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Total</th>
              </tr>
            </thead>
            <tbody>
              {pedidos.map((p: Pedido) => (
                <tr key={p.id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-3 text-xs font-mono text-gray-400">{p.codigo ?? p.id.slice(0,8).toUpperCase()}</td>
                  <td className="px-4 py-3 text-sm text-gray-600">{p.data}</td>
                  <td className="px-4 py-3 text-sm font-medium text-gray-900">{clientesMap[p.cliente_id] ?? '—'}</td>
                  <td className="px-4 py-3">
                    {p.forma_pagamento && (
                      <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full font-medium">{p.forma_pagamento}</span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-sm font-bold text-green-700">
                    {p.total ? `R$ ${Number(p.total).toFixed(2)}` : '—'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </main>
  )
}
