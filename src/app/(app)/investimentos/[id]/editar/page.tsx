import { supabase } from '@/lib/supabase'
import InvestimentoEditForm from '@/components/ui/InvestimentoEditForm'

interface Props {
  params: Promise<{ id: string }>
}

export default async function EditarInvestimentoPage({ params }: Props) {
  const { id } = await params

  const { data: investimento, error } = await supabase
    .from('investimentos')
    .select('*')
    .eq('id', id)
    .single()

  if (error || !investimento) {
    return <p>Investimento não encontrado.</p>
  }

  return (
    <main className="p-8">
      <h1 className="text-2xl font-bold mb-6">Editar Investimento</h1>
      <InvestimentoEditForm investimento={investimento} />
    </main>
  )
}
