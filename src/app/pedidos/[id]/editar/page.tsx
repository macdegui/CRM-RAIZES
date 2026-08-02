import { supabase } from '@/lib/supabase'
import PedidoEditForm from '@/components/ui/PedidoEditForm'

interface Props {
  params: Promise<{ id: string }>
}

export default async function EditarPedidoPage({ params }: Props) {
  const { id } = await params

  const [
    { data: pedido, error },
    { data: itens },
    { data: clientes },
    { data: produtos },
  ] = await Promise.all([
    supabase.from('pedidos').select('*').eq('id', id).single(),
    supabase.from('pedido_itens').select('*').eq('pedido_id', id),
    supabase.from('clientes').select('*').order('nome'),
    supabase.from('produtos').select('*').order('nome'),
  ])

  if (error || !pedido) {
    return <p>Pedido não encontrado.</p>
  }

  return (
    <main className="p-8">
      <h1 className="text-2xl font-bold mb-6">Editar Pedido</h1>
      <PedidoEditForm
        pedido={pedido}
        itens={itens ?? []}
        clientes={clientes ?? []}
        produtos={produtos ?? []}
      />
    </main>
  )
}
