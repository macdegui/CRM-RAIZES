import { supabase } from '@/lib/supabase'
import ReceitaForm from '@/components/ui/ReceitaForm'

export default async function NovaReceitaPage() {
  const { data: produtos } = await supabase
    .from('produtos')
    .select('*')
    .eq('ativo', true)
    .order('nome')

  return (
    <main className="p-8">
      <h1 className="text-2xl font-bold mb-6">Nova Receita</h1>
      <ReceitaForm produtos={produtos ?? []} />
    </main>
  )
}
