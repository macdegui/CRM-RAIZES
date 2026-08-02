import { supabase } from '@/lib/supabase'
import EntregaEditForm from '@/components/ui/EntregaEditForm'

interface Props {
  params: Promise<{ id: string }>
}

export default async function EditarEntregaPage({ params }: Props) {
  const { id } = await params

  const [
    { data: entrega, error },
    { data: pedidos },
    { data: clientes },
  ] = await Promise.all([
    supabase.from('entregas').select('*').eq('id', id).single(),
    supabase.from('pedidos').select('*').order('data', { ascending: false }),
    supabase.from('clientes').select('*').order('nome'),
  ])

  if (error || !entrega) {
    return <p>Entrega não encontrada.</p>
  }

  return (
    <main className="p-8">
      <h1 className="text-2xl font-bold mb-6">Editar Entrega</h1>
      <EntregaEditForm
        entrega={entrega}
        pedidos={pedidos ?? []}
        clientes={clientes ?? []}
      />
    </main>
  )
}
