import { supabase } from '@/lib/supabase'
import ProdutoEditForm from '@/components/ui/ProdutoEditForm'

interface Props {
  params: Promise<{ id: string }>
}

export default async function EditarProdutoPage({ params }: Props) {
  const { id } = await params

  const { data: produto, error } = await supabase
    .from('produtos')
    .select('*')
    .eq('id', id)
    .single()

  if (error || !produto) {
    return <p>Produto não encontrado.</p>
  }

  return (
    <main className="p-8">
      <h1 className="text-2xl font-bold mb-6">Editar Produto</h1>
      <ProdutoEditForm produto={produto} />
    </main>
  )
}
