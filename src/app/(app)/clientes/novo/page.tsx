import { supabase } from '@/lib/supabase'
import ClienteForm from '@/components/ui/ClienteForm'

export default async function NovoClientePage() {
  const { data: clientes } = await supabase.from('clientes').select('tag')

  const tagsExistentes = Array.from(new Set(
    (clientes ?? [])
      .flatMap((c: any) => c.tag ? c.tag.split(',').map((t: string) => t.trim()) : [])
      .filter(Boolean)
  )) as string[]

  return (
    <main className="p-8">
      <h1 className="text-2xl font-bold mb-6">Novo Cliente</h1>
      <ClienteForm tagsExistentes={tagsExistentes} />
    </main>
  )
}
