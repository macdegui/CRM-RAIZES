export const dynamic = 'force-dynamic'

import Link from 'next/link'
import { supabase } from '@/lib/supabase'
import { Compra, Fornecedor } from '@/types'
import DeletarCompra from '@/components/ui/DeletarCompra'

export default async function ComprasPage() {
  const [{ data: compras, error }, { data: fornecedores }] = await Promise.all([
    supabase.from('compras').select('*').order('data', { ascending: false }),
    supabase.from('fornecedores').select('*'),
  ])

  if (error) return <p>Erro ao carregar compras: {error.message}</p>

  const fornecedoresMap = Object.fromEntries((fornecedores ?? []).map((f: Fornecedor) => [f.id, f.nome]))

  return (
    <main className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-xl font-bold text-gray-900">Compras</h1>
          <p className="text-sm text-gray-500 mt-0.5">{compras.length} registradas</p>
        </div>
        <Link href="/compras/novo" className="bg-gray-900 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-black transition-colors">
          + Nova Compra
        </Link>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        {compras.length === 0 ? (
          <div className="p-12 text-center text-gray-400 text-sm">Nenhuma compra cadastrada ainda.</div>
        ) : (
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-100">
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Data</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Fornecedor</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Total</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Observação</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Ações</th>
              </tr>
            </thead>
            <tbody>
              {compras.map((c: Compra) => (
                <tr key={c.id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-3 text-sm text-gray-600">{c.data}</td>
                  <td className="px-4 py-3 text-sm font-medium text-gray-900">{fornecedoresMap[c.fornecedor_id] ?? '—'}</td>
                  <td className="px-4 py-3 text-sm font-medium text-gray-700">
                    {c.valor_total ? `R$ ${Number(c.valor_total).toFixed(2)}` : '—'}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-500">{c.observacao ?? '—'}</td>
                  <td className="px-4 py-3 flex gap-3">
                    <Link href={`/compras/${c.id}/editar`} className="text-sm text-blue-600 hover:text-blue-800 font-medium">Ver itens</Link>
                    <DeletarCompra id={c.id} />
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
