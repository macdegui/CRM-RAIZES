import { supabase } from '@/lib/supabase'
import CompraForm from '@/components/ui/CompraForm'

export default async function NovaCompraPage() {
  const { data: fornecedores } = await supabase
    .from('fornecedores')
    .select('*')
    .order('nome')

  return (
    <main className="p-8">
      <h1 className="text-2xl font-bold mb-6">Nova Compra</h1>
      <CompraForm fornecedores={fornecedores ?? []} />
    </main>
  )
}
