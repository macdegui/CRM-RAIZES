export const dynamic = 'force-dynamic'

import Link from 'next/link'
import { supabase } from '@/lib/supabase'
import KanbanPedidos from '@/components/ui/KanbanPedidos'

export default async function PedidosPage() {
  const [
    { data: pedidos, error },
    { data: itens },
    { data: clientes },
    { data: produtos },
  ] = await Promise.all([
    supabase.from('pedidos').select('*').neq('status', 'PAGO').order('data'),
    supabase.from('pedido_itens').select('*'),
    supabase.from('clientes').select('*').order('nome'),
    supabase.from('produtos').select('*').order('nome'),
  ])

  if (error) {
    return <p>Erro ao carregar pedidos: {error.message}</p>
  }

  return (
    <div className="flex flex-col min-h-screen">
      <div className="flex justify-between items-center px-4 py-3 bg-white border-b">
        <h1 className="text-xl font-bold">Pedidos</h1>
        <Link
          href="/pedidos/novo"
          className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700"
        >
          + Novo Pedido
        </Link>
      </div>

      <KanbanPedidos
        pedidos={pedidos ?? []}
        itens={itens ?? []}
        clientes={clientes ?? []}
        produtos={produtos ?? []}
      />
    </div>
  )
}
