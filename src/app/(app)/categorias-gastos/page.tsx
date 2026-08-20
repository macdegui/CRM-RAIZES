export const dynamic = 'force-dynamic'

import Link from 'next/link'
import { supabase } from '@/lib/supabase'
import { CategoriaGasto } from '@/types'
import DeletarCategoriaGasto from '@/components/ui/DeletarCategoriaGasto'

export default async function CategoriasGastosPage() {
  const { data: categorias, error } = await supabase
    .from('categorias_gastos')
    .select('*')
    .order('nome')

  if (error) return <p>Erro ao carregar categorias: {error.message}</p>

  return (
    <main className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-xl font-bold text-gray-900">Categorias de Gastos</h1>
          <p className="text-sm text-gray-500 mt-0.5">{categorias.length} cadastradas</p>
        </div>
        <Link href="/categorias-gastos/novo" className="bg-gray-900 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-black transition-colors">
          + Nova Categoria
        </Link>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        {categorias.length === 0 ? (
          <div className="p-12 text-center text-gray-400 text-sm">Nenhuma categoria cadastrada ainda.</div>
        ) : (
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-100">
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Nome</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Ações</th>
              </tr>
            </thead>
            <tbody>
              {categorias.map((c: CategoriaGasto) => (
                <tr key={c.id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-3 text-sm font-medium text-gray-900">{c.nome}</td>
                  <td className="px-4 py-3 flex gap-3">
                    <Link href={`/categorias-gastos/${c.id}/editar`} className="text-sm text-blue-600 hover:text-blue-800 font-medium">Editar</Link>
                    <DeletarCategoriaGasto id={c.id} nome={c.nome} />
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
