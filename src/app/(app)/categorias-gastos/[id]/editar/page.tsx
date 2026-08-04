import { supabase } from '@/lib/supabase'
import CategoriaGastoEditForm from '@/components/ui/CategoriaGastoEditForm'

interface Props {
  params: Promise<{ id: string }>
}

export default async function EditarCategoriaGastoPage({ params }: Props) {
  const { id } = await params

  const { data: categoria, error } = await supabase
    .from('categorias_gastos')
    .select('*')
    .eq('id', id)
    .single()

  if (error || !categoria) {
    return <p>Categoria não encontrada.</p>
  }

  return (
    <main className="p-8">
      <h1 className="text-2xl font-bold mb-6">Editar Categoria</h1>
      <CategoriaGastoEditForm categoria={categoria} />
    </main>
  )
}
