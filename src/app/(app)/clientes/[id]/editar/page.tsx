import { supabase } from '@/lib/supabase'
import ClienteEditForm from '@/components/ui/ClienteEditForm'

interface Props {
  params: Promise<{ id: string }>
}

export default async function EditarClientePage({ params }: Props) {
  const { id } = await params

  const [{ data: cliente, error }, { data: clientes }] = await Promise.all([
    supabase.from('clientes').select('*').eq('id', id).single(),
    supabase.from('clientes').select('tag'),
  ])

  if (error || !cliente) {
    return <p>Cliente não encontrado.</p>
  }

  const tagsExistentes = Array.from(new Set(
    (clientes ?? [])
      .flatMap((c: any) => c.tag ? c.tag.split(',').map((t: string) => t.trim()) : [])
      .filter(Boolean)
  )) as string[]

  return (
    <main className="p-8">
      <h1 className="text-2xl font-bold mb-6">Editar Cliente</h1>
      <ClienteEditForm cliente={cliente} tagsExistentes={tagsExistentes} />
    </main>
  )
}
