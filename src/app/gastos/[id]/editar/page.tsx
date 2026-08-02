import { supabase } from '@/lib/supabase'
import GastoEditForm from '@/components/ui/GastoEditForm'

interface Props {
  params: Promise<{ id: string }>
}

export default async function EditarGastoPage({ params }: Props) {
  const { id } = await params

  const [{ data: gasto, error }, { data: categorias }] = await Promise.all([
    supabase.from('gastos').select('*').eq('id', id).single(),
    supabase.from('categorias_gastos').select('*').order('nome'),
  ])

  if (error || !gasto) {
    return <p>Gasto não encontrado.</p>
  }

  return (
    <main className="p-8">
      <h1 className="text-2xl font-bold mb-6">Editar Gasto</h1>
      <GastoEditForm gasto={gasto} categorias={categorias ?? []} />
    </main>
  )
}
