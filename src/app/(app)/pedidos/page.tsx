export const dynamic = 'force-dynamic'

import Link from 'next/link'
import { supabase } from '@/lib/supabase'
import { Pedido, Cliente } from '@/types'
import DeletarPedido from '@/components/ui/DeletarPedido'

const statusLabel: Record<string, string> = {
  PENDENTE: 'Pendente',
  EM_PRODUCAO: 'Em produção',
  ENTREGUE: 'Entregue',
  PAGO: 'Pago',
}

export default async function PedidosPage() {
  const [{ data: pedidos, error }, { data: clientes }] = await Promise.all([
    supabase.from('pedidos').select('*').order('data', { ascending: false }),
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
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Pedidos</h1>
        <Link
          href="/pedidos/novo"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          + Novo Pedido
        </Link>
      </div>

      {pedidos.length === 0 ? (
        <p className="text-gray-500">Nenhum pedido cadastrado ainda.</p>
      ) : (
        <table className="w-full border-collapse">
          <thead>
            <tr className="border-b">
              <th className="text-left p-2">Data</th>
              <th className="text-left p-2">Cliente</th>
              <th className="text-left p-2">Status</th>
              <th className="text-left p-2">Total</th>
              <th className="text-left p-2">Ações</th>
            </tr>
          </thead>
          <tbody>
            {pedidos.map((pedido: Pedido) => (
              <tr key={pedido.id} className="border-b hover:bg-gray-50">
                <td className="p-2">{pedido.data}</td>
                <td className="p-2">{clientesMap[pedido.cliente_id] ?? '—'}</td>
                <td className="p-2">{statusLabel[pedido.status]}</td>
                <td className="p-2">
                  {pedido.total ? `R$ ${Number(pedido.total).toFixed(2)}` : '—'}
                </td>
                <td className="p-2 flex gap-3">
                  <Link
                    href={`/pedidos/${pedido.id}/editar`}
                    className="text-blue-600 hover:underline text-sm"
                  >
                    Ver itens
                  </Link>
                  <DeletarPedido id={pedido.id} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </main>
  )
}
