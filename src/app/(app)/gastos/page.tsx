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

  if (error) return <p>Erro ao carregar gastos: {error.message}</p>

  const categoriasMap = Object.fromEntries((categorias ?? []).map((c: CategoriaGasto) => [c.id, c.nome]))
  const total = (gastos ?? []).reduce((acc, g) => acc + Number(g.valor), 0)

  return (
    <main className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-xl font-bold text-gray-900">Gastos</h1>
          <p className="text-sm text-gray-500 mt-0.5">Total: R$ {total.toFixed(2)}</p>
        </div>
        <Link href="/gastos/novo" className="bg-gray-900 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-black transition-colors">
          + Novo Gasto
        </Link>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        {gastos.length === 0 ? (
          <div className="p-12 text-center text-gray-400 text-sm">Nenhum gasto cadastrado ainda.</div>
        ) : (
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-100">
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Descrição</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Categoria</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Valor</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Data</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Recorrente</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Ações</th>
              </tr>
            </thead>
            <tbody>
              {gastos.map((g: Gasto) => (
                <tr key={g.id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-3 text-sm font-medium text-gray-900">{g.descricao}</td>
                  <td className="px-4 py-3 text-sm text-gray-600">{categoriasMap[g.categoria_id] ?? '—'}</td>
                  <td className="px-4 py-3 text-sm font-medium text-red-600">R$ {Number(g.valor).toFixed(2)}</td>
                  <td className="px-4 py-3 text-sm text-gray-600">{g.data}</td>
                  <td className="px-4 py-3">
                    {g.recorrente && <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full">Recorrente</span>}
                  </td>
                  <td className="px-4 py-3 flex gap-3">
                    <Link href={`/gastos/${g.id}/editar`} className="text-sm text-blue-600 hover:text-blue-800 font-medium">Editar</Link>
                    <DeletarGasto id={g.id} descricao={g.descricao} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </main>
  )
}
