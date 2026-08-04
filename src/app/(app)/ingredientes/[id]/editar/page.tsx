import { supabase } from '@/lib/supabase'
import IngredienteEditForm from '@/components/ui/IngredienteEditForm'

interface Props {
  params: Promise<{ id: string }>
}

export default async function EditarIngredientePage({ params }: Props) {
  const { id } = await params

  const { data: ingrediente, error } = await supabase
    .from('ingredientes')
    .select('*')
    .eq('id', id)
    .single()

  if (error || !ingrediente) {
    return <p>Ingrediente não encontrado.</p>
  }

  return (
    <main className="p-8">
      <h1 className="text-2xl font-bold mb-6">Editar Ingrediente</h1>
      <IngredienteEditForm ingrediente={ingrediente} />
    </main>
  )
}
