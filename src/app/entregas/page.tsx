export const dynamic = 'force-dynamic'

import Link from 'next/link'
import { supabase } from '@/lib/supabase'
import { Entrega, Cliente } from '@/types'
import DeletarEntrega from '@/components/ui/DeletarEntrega'

const statusLabel: Record<string, string> = {
  PENDENTE: 'Pendente',
  EM_TRANSITO: 'Em trânsito',
  ENTREGUE: 'Entregue',
}

const tipoLabel: Record<string, string> = {
  RETIRADA: 'Retirada',
  MOTOBOY: 'Motoboy',
  APP: 'App',
  TRANSPORTADORA: 'Transportadora',
}

export default async function EntregasPage() {
  const [{ data: entregas, error }, { data: clientes }] = await Promise.all([
    supabase.from('entregas').select('*').order('data_prevista', { ascending: false }),
    supabase.from('clientes').select('*'),
  ])

  if (error) {
    return <p>Erro ao carregar entregas: {error.message}</p>
  }

  const clientesMap = Object.fromEntries(
    (clientes ?? []).map((c: Cliente) => [c.id, c.nome])
  )

  return (
    <main className="p-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Entregas</h1>
        <Link
          href="/entregas/novo"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          + Nova Entrega
        </Link>
      </div>

      {entregas.length === 0 ? (
        <p className="text-gray-500">Nenhuma entrega cadastrada ainda.</p>
      ) : (
        <table className="w-full border-collapse">
          <thead>
            <tr className="border-b">
              <th className="text-left p-2">Cliente</th>
              <th className="text-left p-2">Tipo</th>
              <th className="text-left p-2">Status</th>
              <th className="text-left p-2">Data prevista</th>
              <th className="text-left p-2">Custo</th>
              <th className="text-left p-2">Ações</th>
            </tr>
          </thead>
          <tbody>
            {entregas.map((entrega: Entrega) => (
              <tr key={entrega.id} className="border-b hover:bg-gray-50">
                <td className="p-2">{clientesMap[entrega.cliente_id] ?? '—'}</td>
                <td className="p-2">{entrega.tipo ? tipoLabel[entrega.tipo] : '—'}</td>
                <td className="p-2">{statusLabel[entrega.status]}</td>
                <td className="p-2">{entrega.data_prevista ?? '—'}</td>
                <td className="p-2">
                  {entrega.custo ? `R$ ${Number(entrega.custo).toFixed(2)}` : '—'}
                </td>
                <td className="p-2 flex gap-3">
                  <Link
                    href={`/entregas/${entrega.id}/editar`}
                    className="text-blue-600 hover:underline text-sm"
                  >
                    Editar
                  </Link>
                  <DeletarEntrega id={entrega.id} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </main>
  )
}
