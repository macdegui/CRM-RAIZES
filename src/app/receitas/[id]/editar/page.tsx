import { supabase } from '@/lib/supabase'
import ReceitaEditForm from '@/components/ui/ReceitaEditForm'

interface Props {
  params: Promise<{ id: string }>
}

export default async function EditarReceitaPage({ params }: Props) {
  const { id } = await params

  const [{ data: receita, error }, { data: produtos }] = await Promise.all([
    supabase.from('receitas').select('*').eq('id', id).single(),
    supabase.from('produtos').select('*').order('nome'),
  ])

  if (error || !receita) {
    return <p>Receita não encontrada.</p>
  }

  return (
    <main className="p-8">
      <h1 className="text-2xl font-bold mb-6">Editar Receita</h1>
      <ReceitaEditForm receita={receita} produtos={produtos ?? []} />
    </main>
  )
}
