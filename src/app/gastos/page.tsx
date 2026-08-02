export const dynamic = 'force-dynamic'

import Link from 'next/link'
import { supabase } from '@/lib/supabase'
import { Gasto, CategoriaGasto } from '@/types'
import DeletarGasto from '@/components/ui/DeletarGasto'

export default async function GastosPage() {
  const [{ data: gastos, error }, { data: categorias }] = await Promise.all([
    supabase.from('gastos').select('*').order('data', { ascending: false }),
    supabase.from('categorias_gastos').select('*'),
  ])

  if (error) {
    return <p>Erro ao carregar gastos: {error.message}</p>
  }

  const categoriasMap = Object.fromEntries(
    (categorias ?? []).map((c: CategoriaGasto) => [c.id, c.nome])
  )

  return (
    <main className="p-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Gastos</h1>
        <Link
          href="/gastos/novo"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          + Novo Gasto
        </Link>
      </div>

      {gastos.length === 0 ? (
        <p className="text-gray-500">Nenhum gasto cadastrado ainda.</p>
      ) : (
        <table className="w-full border-collapse">
          <thead>
            <tr className="border-b">
              <th className="text-left p-2">Descrição</th>
              <th className="text-left p-2">Categoria</th>
              <th className="text-left p-2">Valor</th>
              <th className="text-left p-2">Data</th>
              <th className="text-left p-2">Recorrente</th>
              <th className="text-left p-2">Ações</th>
            </tr>
          </thead>
          <tbody>
            {gastos.map((gasto: Gasto) => (
              <tr key={gasto.id} className="border-b hover:bg-gray-50">
                <td className="p-2">{gasto.descricao}</td>
                <td className="p-2">{categoriasMap[gasto.categoria_id] ?? '—'}</td>
                <td className="p-2">R$ {Number(gasto.valor).toFixed(2)}</td>
                <td className="p-2">{gasto.data}</td>
                <td className="p-2">{gasto.recorrente ? 'Sim' : 'Não'}</td>
                <td className="p-2 flex gap-3">
                  <Link
                    href={`/gastos/${gasto.id}/editar`}
                    className="text-blue-600 hover:underline text-sm"
                  >
                    Editar
                  </Link>
                  <DeletarGasto id={gasto.id} descricao={gasto.descricao} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </main>
  )
}
