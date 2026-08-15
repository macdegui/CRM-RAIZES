export const dynamic = 'force-dynamic'

import { supabase } from '@/lib/supabase'
import { Cliente } from '@/types'

import ClienteForm from '@/components/ui/ClienteForm'

export default function NovoClientePage() {
  return (
    <main className="p-8">
      <h1 className="text-2xl font-bold mb-6">Novo Cliente</h1>
      <ClienteForm />
    </main>
  )
}