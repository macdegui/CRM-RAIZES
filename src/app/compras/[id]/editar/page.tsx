import { supabase } from '@/lib/supabase'
import CompraEditForm from '@/components/ui/CompraEditForm'

interface Props {
  params: Promise<{ id: string }>
}

export default async function EditarCompraPage({ params }: Props) {
  const { id } = await params

  const [
    { data: compra, error },
    { data: itens },
    { data: fornecedores },
    { data: ingredientes },
  ] = await Promise.all([
    supabase.from('compras').select('*').eq('id', id).single(),
    supabase.from('compra_itens').select('*').eq('compra_id', id),
    supabase.from('fornecedores').select('*').order('nome'),
    supabase.from('ingredientes').select('*').order('nome'),
  ])

  if (error || !compra) {
    return <p>Compra não encontrada.</p>
  }

  return (
    <main className="p-8">
      <h1 className="text-2xl font-bold mb-6">Editar Compra</h1>
      <CompraEditForm
        compra={compra}
        itens={itens ?? []}
        fornecedores={fornecedores ?? []}
        ingredientes={ingredientes ?? []}
      />
    </main>
  )
}
