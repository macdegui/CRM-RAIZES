import { supabase } from '@/lib/supabase'
import ClienteEditForm from '@/components/ui/ClienteEditForm'

interface Props {
  params: Promise<{ id: string }>
}

export default async function EditarClientePage({ params }: Props) {
  const { id } = await params

  const { data: cliente, error } = await supabase
    .from('clientes')
    .select('*')
    .eq('id', id)
    .single()

  if (error || !cliente) {
    return <p>Cliente não encontrado.</p>
  }

  return (
    <main className="p-8">
      <h1 className="text-2xl font-bold mb-6">Editar Cliente</h1>
      <ClienteEditForm cliente={cliente} />
    </main>
  )
}
