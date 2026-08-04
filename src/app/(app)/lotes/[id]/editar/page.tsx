import { supabase } from '@/lib/supabase'
import LoteEditForm from '@/components/ui/LoteEditForm'

interface Props {
  params: Promise<{ id: string }>
}

export default async function EditarLotePage({ params }: Props) {
  const { id } = await params

  const { data: lote, error } = await supabase
    .from('lotes')
    .select('*')
    .eq('id', id)
    .single()

  if (error || !lote) {
    return <p>Lote não encontrado.</p>
  }

  return (
    <main className="p-8">
      <h1 className="text-2xl font-bold mb-6">Editar Lote</h1>
      <LoteEditForm lote={lote} />
    </main>
  )
}
