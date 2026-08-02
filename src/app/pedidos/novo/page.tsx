import { supabase } from '@/lib/supabase'
import PedidoForm from '@/components/ui/PedidoForm'

export default async function NovoPedidoPage() {
  const { data: clientes } = await supabase
    .from('clientes')
    .select('*')
    .order('nome')

  return (
    <main className="p-8">
      <h1 className="text-2xl font-bold mb-6">Novo Pedido</h1>
      <PedidoForm clientes={clientes ?? []} />
    </main>
  )
}
