import { supabase } from '@/lib/supabase'
import EntregaForm from '@/components/ui/EntregaForm'

export default async function NovaEntregaPage() {
  const [{ data: pedidos }, { data: clientes }] = await Promise.all([
    supabase.from('pedidos').select('*').order('data', { ascending: false }),
    supabase.from('clientes').select('*').order('nome'),
  ])

  return (
    <main className="p-8">
      <h1 className="text-2xl font-bold mb-6">Nova Entrega</h1>
      <EntregaForm pedidos={pedidos ?? []} clientes={clientes ?? []} />
    </main>
  )
}
