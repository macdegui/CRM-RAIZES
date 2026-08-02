import { supabase } from '@/lib/supabase'
import GastoForm from '@/components/ui/GastoForm'

export default async function NovoGastoPage() {
  const { data: categorias } = await supabase
    .from('categorias_gastos')
    .select('*')
    .order('nome')

  return (
    <main className="p-8">
      <h1 className="text-2xl font-bold mb-6">Novo Gasto</h1>
      <GastoForm categorias={categorias ?? []} />
    </main>
  )
}
