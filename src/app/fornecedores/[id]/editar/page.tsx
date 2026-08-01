import { supabase } from '@/lib/supabase'
import FornecedorEditForm from '@/components/ui/FornecedorEditForm'

interface Props {
  params: Promise<{ id: string }>
}

export default async function EditarFornecedorPage({ params }: Props) {
  const { id } = await params

  const { data: fornecedor, error } = await supabase
    .from('fornecedores')
    .select('*')
    .eq('id', id)
    .single()

  if (error || !fornecedor) {
    return <p>Fornecedor não encontrado.</p>
  }

  return (
    <main className="p-8">
      <h1 className="text-2xl font-bold mb-6">Editar Fornecedor</h1>
      <FornecedorEditForm fornecedor={fornecedor} />
    </main>
  )
}
