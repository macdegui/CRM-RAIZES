export const dynamic = 'force-dynamic'

import Link from 'next/link'
import { supabase } from '@/lib/supabase'
import { Lote } from '@/types'
import DeletarLote from '@/components/ui/DeletarLote'

const statusLabel: Record<string, string> = {
  ABERTO: 'Aberto',
  EM_PRODUCAO: 'Em produção',
  FINALIZADO: 'Finalizado',
}

export default async function LotesPage() {
  const { data: lotes, error } = await supabase
    .from('lotes')
    .select('*')
    .order('data', { ascending: false })

  if (error) {
    return <p>Erro ao carregar lotes: {error.message}</p>
  }

  return (
    <main className="p-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Lotes</h1>
        <Link
          href="/lotes/novo"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          + Novo Lote
        </Link>
      </div>

      {lotes.length === 0 ? (
        <p className="text-gray-500">Nenhum lote cadastrado ainda.</p>
      ) : (
        <table className="w-full border-collapse">
          <thead>
            <tr className="border-b">
              <th className="text-left p-2">Data</th>
              <th className="text-left p-2">Status</th>
              <th className="text-left p-2">Custo total</th>
              <th className="text-left p-2">Ações</th>
            </tr>
          </thead>
          <tbody>
            {lotes.map((lote: Lote) => (
              <tr key={lote.id} className="border-b hover:bg-gray-50">
                <td className="p-2">{lote.data}</td>
                <td className="p-2">{statusLabel[lote.status]}</td>
                <td className="p-2">
                  {lote.custo_total ? `R$ ${Number(lote.custo_total).toFixed(2)}` : '—'}
                </td>
                <td className="p-2 flex gap-3">
                  <Link
                    href={`/lotes/${lote.id}/editar`}
                    className="text-blue-600 hover:underline text-sm"
                  >
                    Editar
                  </Link>
                  <DeletarLote id={lote.id} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </main>
  )
}
