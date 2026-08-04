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

  if (error) {
    return <p>Erro ao carregar categorias: {error.message}</p>
  }

  return (
    <main className="p-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Categorias de Gastos</h1>
        <Link
          href="/categorias-gastos/novo"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          + Nova Categoria
        </Link>
      </div>

      {categorias.length === 0 ? (
        <p className="text-gray-500">Nenhuma categoria cadastrada ainda.</p>
      ) : (
        <table className="w-full border-collapse">
          <thead>
            <tr className="border-b">
              <th className="text-left p-2">Nome</th>
              <th className="text-left p-2">Ações</th>
            </tr>
          </thead>
          <tbody>
            {categorias.map((categoria: CategoriaGasto) => (
              <tr key={categoria.id} className="border-b hover:bg-gray-50">
                <td className="p-2">{categoria.nome}</td>
                <td className="p-2 flex gap-3">
                  <Link
                    href={`/categorias-gastos/${categoria.id}/editar`}
                    className="text-blue-600 hover:underline text-sm"
                  >
                    Editar
                  </Link>
                  <DeletarCategoriaGasto id={categoria.id} nome={categoria.nome} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </main>
  )
}
