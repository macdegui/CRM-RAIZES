export const dynamic = 'force-dynamic'

import Link from 'next/link'
import { supabase } from '@/lib/supabase'
import { Receita, Produto } from '@/types'
import DeletarReceita from '@/components/ui/DeletarReceita'

export default async function ReceitasPage() {
  const [{ data: receitas, error }, { data: produtos }] = await Promise.all([
    supabase.from('receitas').select('*').order('nome'),
    supabase.from('produtos').select('*'),
  ])

  if (error) {
    return <p>Erro ao carregar receitas: {error.message}</p>
  }

  const produtosMap = Object.fromEntries(
    (produtos ?? []).map((p: Produto) => [p.id, p.nome])
  )

  return (
    <main className="p-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Receitas</h1>
        <Link
          href="/receitas/novo"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          + Nova Receita
        </Link>
      </div>

      {receitas.length === 0 ? (
        <p className="text-gray-500">Nenhuma receita cadastrada ainda.</p>
      ) : (
        <table className="w-full border-collapse">
          <thead>
            <tr className="border-b">
              <th className="text-left p-2">Nome</th>
              <th className="text-left p-2">Produto</th>
              <th className="text-left p-2">Rendimento</th>
              <th className="text-left p-2">Ativa</th>
              <th className="text-left p-2">Ações</th>
            </tr>
          </thead>
          <tbody>
            {receitas.map((receita: Receita) => (
              <tr key={receita.id} className="border-b hover:bg-gray-50">
                <td className="p-2">{receita.nome}</td>
                <td className="p-2">{produtosMap[receita.produto_id] ?? '—'}</td>
                <td className="p-2">{receita.rendimento} un.</td>
                <td className="p-2">{receita.ativa ? 'Sim' : 'Não'}</td>
                <td className="p-2 flex gap-3">
                  <Link
                    href={`/receitas/${receita.id}/editar`}
                    className="text-blue-600 hover:underline text-sm"
                  >
                    Editar
                  </Link>
                  <DeletarReceita id={receita.id} nome={receita.nome} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </main>
  )
}
