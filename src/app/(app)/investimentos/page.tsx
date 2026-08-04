export const dynamic = 'force-dynamic'

import Link from 'next/link'
import { supabase } from '@/lib/supabase'
import { Investimento } from '@/types'
import DeletarInvestimento from '@/components/ui/DeletarInvestimento'

export default async function InvestimentosPage() {
  const { data: investimentos, error } = await supabase
    .from('investimentos')
    .select('*')
    .order('data', { ascending: false })

  if (error) {
    return <p>Erro ao carregar investimentos: {error.message}</p>
  }

  return (
    <main className="p-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Investimentos</h1>
        <Link
          href="/investimentos/novo"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          + Novo Investimento
        </Link>
      </div>

      {investimentos.length === 0 ? (
        <p className="text-gray-500">Nenhum investimento cadastrado ainda.</p>
      ) : (
        <table className="w-full border-collapse">
          <thead>
            <tr className="border-b">
              <th className="text-left p-2">Descrição</th>
              <th className="text-left p-2">Valor</th>
              <th className="text-left p-2">Data</th>
              <th className="text-left p-2">Ações</th>
            </tr>
          </thead>
          <tbody>
            {investimentos.map((investimento: Investimento) => (
              <tr key={investimento.id} className="border-b hover:bg-gray-50">
                <td className="p-2">{investimento.descricao}</td>
                <td className="p-2">R$ {Number(investimento.valor).toFixed(2)}</td>
                <td className="p-2">{investimento.data}</td>
                <td className="p-2 flex gap-3">
                  <Link
                    href={`/investimentos/${investimento.id}/editar`}
                    className="text-blue-600 hover:underline text-sm"
                  >
                    Editar
                  </Link>
                  <DeletarInvestimento id={investimento.id} descricao={investimento.descricao} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </main>
  )
}
