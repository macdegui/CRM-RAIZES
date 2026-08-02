export const dynamic = 'force-dynamic'

import Link from 'next/link'
import { supabase } from '@/lib/supabase'
import { Ingrediente } from '@/types'
import DeletarIngrediente from '@/components/ui/DeletarIngrediente'

export default async function IngredientesPage() {
  const { data: ingredientes, error } = await supabase
    .from('ingredientes')
    .select('*')
    .order('nome')

  if (error) {
    return <p>Erro ao carregar ingredientes: {error.message}</p>
  }

  return (
    <main className="p-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Ingredientes</h1>
        <Link
          href="/ingredientes/novo"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          + Novo Ingrediente
        </Link>
      </div>

      {ingredientes.length === 0 ? (
        <p className="text-gray-500">Nenhum ingrediente cadastrado ainda.</p>
      ) : (
        <table className="w-full border-collapse">
          <thead>
            <tr className="border-b">
              <th className="text-left p-2">Nome</th>
              <th className="text-left p-2">Unidade</th>
              <th className="text-left p-2">Estoque mínimo</th>
              <th className="text-left p-2">Ativo</th>
              <th className="text-left p-2">Ações</th>
            </tr>
          </thead>
          <tbody>
            {ingredientes.map((ingrediente: Ingrediente) => (
              <tr key={ingrediente.id} className="border-b hover:bg-gray-50">
                <td className="p-2">{ingrediente.nome}</td>
                <td className="p-2">{ingrediente.unidade}</td>
                <td className="p-2">{ingrediente.estoque_minimo ?? '—'}</td>
                <td className="p-2">{ingrediente.ativo ? 'Sim' : 'Não'}</td>
                <td className="p-2 flex gap-3">
                  <Link
                    href={`/ingredientes/${ingrediente.id}/editar`}
                    className="text-blue-600 hover:underline text-sm"
                  >
                    Editar
                  </Link>
                  <DeletarIngrediente id={ingrediente.id} nome={ingrediente.nome} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </main>
  )
}
