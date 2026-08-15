export const dynamic = 'force-dynamic'

import { supabase } from '@/lib/supabase'
import { Pedido, Cliente } from '@/types'

export default async function PedidosFechadosPage() {
  const [{ data: pedidos, error }, { data: clientes }] = await Promise.all([
    supabase
      .from('pedidos')
      .select('*')
      .eq('status', 'PAGO')
      .order('data', { ascending: false }),
    supabase.from('clientes').select('*'),
  ])

  if (error) {
    return <p>Erro ao carregar pedidos: {error.message}</p>
  }

  const clientesMap = Object.fromEntries(
    (clientes ?? []).map((c: Cliente) => [c.id, c.nome])
  )

  return (
    <main className="p-8">
      <h1 className="text-2xl font-bold mb-6">Pedidos Fechados</h1>

      {pedidos.length === 0 ? (
        <p className="text-gray-500">Nenhum pedido fechado ainda.</p>
      ) : (
        <table className="w-full border-collapse">
          <thead>
            <tr className="border-b">
              <th className="text-left p-2">Data</th>
              <th className="text-left p-2">Cliente</th>
              <th className="text-left p-2">Total</th>
            </tr>
          </thead>
          <tbody>
            {pedidos.map((pedido: Pedido) => (
              <tr key={pedido.id} className="border-b hover:bg-gray-50">
                <td className="p-2">{pedido.data}</td>
                <td className="p-2">{clientesMap[pedido.cliente_id] ?? '—'}</td>
                <td className="p-2">
                  {pedido.total ? `R$ ${Number(pedido.total).toFixed(2)}` : '—'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </main>
  )
}
