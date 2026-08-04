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

  if (error) {
    return <p>Erro ao carregar compras: {error.message}</p>
  }

  const fornecedoresMap = Object.fromEntries(
    (fornecedores ?? []).map((f: Fornecedor) => [f.id, f.nome])
  )

  return (
    <main className="p-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Compras</h1>
        <Link
          href="/compras/novo"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          + Nova Compra
        </Link>
      </div>

      {compras.length === 0 ? (
        <p className="text-gray-500">Nenhuma compra cadastrada ainda.</p>
      ) : (
        <table className="w-full border-collapse">
          <thead>
            <tr className="border-b">
              <th className="text-left p-2">Data</th>
              <th className="text-left p-2">Fornecedor</th>
              <th className="text-left p-2">Total</th>
              <th className="text-left p-2">Observação</th>
              <th className="text-left p-2">Ações</th>
            </tr>
          </thead>
          <tbody>
            {compras.map((compra: Compra) => (
              <tr key={compra.id} className="border-b hover:bg-gray-50">
                <td className="p-2">{compra.data}</td>
                <td className="p-2">{fornecedoresMap[compra.fornecedor_id] ?? '—'}</td>
                <td className="p-2">
                  {compra.valor_total ? `R$ ${Number(compra.valor_total).toFixed(2)}` : '—'}
                </td>
                <td className="p-2">{compra.observacao ?? '—'}</td>
                <td className="p-2 flex gap-3">
                  <Link
                    href={`/compras/${compra.id}/editar`}
                    className="text-blue-600 hover:underline text-sm"
                  >
                    Ver itens
                  </Link>
                  <DeletarCompra id={compra.id} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </main>
  )
}
