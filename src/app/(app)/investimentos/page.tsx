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

  if (error) return <p>Erro ao carregar investimentos: {error.message}</p>

  const total = (investimentos ?? []).reduce((acc, i) => acc + Number(i.valor), 0)

  return (
    <main className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-xl font-bold text-gray-900">Investimentos</h1>
          <p className="text-sm text-gray-500 mt-0.5">Total: R$ {total.toFixed(2)}</p>
        </div>
        <Link href="/investimentos/novo" className="bg-gray-900 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-black transition-colors">
          + Novo Investimento
        </Link>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        {investimentos.length === 0 ? (
          <div className="p-12 text-center text-gray-400 text-sm">Nenhum investimento cadastrado ainda.</div>
        ) : (
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-100">
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Descrição</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Valor</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Data</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Ações</th>
              </tr>
            </thead>
            <tbody>
              {investimentos.map((i: Investimento) => (
                <tr key={i.id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-3 text-sm font-medium text-gray-900">{i.descricao}</td>
                  <td className="px-4 py-3 text-sm font-medium text-gray-700">R$ {Number(i.valor).toFixed(2)}</td>
                  <td className="px-4 py-3 text-sm text-gray-600">{i.data}</td>
                  <td className="px-4 py-3 flex gap-3">
                    <Link href={`/investimentos/${i.id}/editar`} className="text-sm text-blue-600 hover:text-blue-800 font-medium">Editar</Link>
                    <DeletarInvestimento id={i.id} descricao={i.descricao} />
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
