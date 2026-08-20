export const dynamic = 'force-dynamic'

import Link from 'next/link'
import { supabase } from '@/lib/supabase'
import { Fornecedor } from '@/types'
import DeletarFornecedor from '@/components/ui/DeletarFornecedor'

export default async function FornecedoresPage() {
  const { data: fornecedores, error } = await supabase
    .from('fornecedores')
    .select('*')
    .order('nome')

  if (error) return <p>Erro ao carregar fornecedores: {error.message}</p>

  return (
    <main className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-xl font-bold text-gray-900">Fornecedores</h1>
          <p className="text-sm text-gray-500 mt-0.5">{fornecedores.length} cadastrados</p>
        </div>
        <Link href="/fornecedores/novo" className="bg-gray-900 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-black transition-colors">
          + Novo Fornecedor
        </Link>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        {fornecedores.length === 0 ? (
          <div className="p-12 text-center text-gray-400 text-sm">Nenhum fornecedor cadastrado ainda.</div>
        ) : (
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-100">
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Nome</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Contato</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Documento</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Ações</th>
              </tr>
            </thead>
            <tbody>
              {fornecedores.map((f: Fornecedor) => (
                <tr key={f.id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-3 text-sm font-medium text-gray-900">{f.nome}</td>
                  <td className="px-4 py-3 text-sm text-gray-600">{f.contato ?? '—'}</td>
                  <td className="px-4 py-3 text-sm text-gray-600">{f.documento ?? '—'}</td>
                  <td className="px-4 py-3 flex gap-3">
                    <Link href={`/fornecedores/${f.id}/editar`} className="text-sm text-blue-600 hover:text-blue-800 font-medium">Editar</Link>
                    <DeletarFornecedor id={f.id} nome={f.nome} />
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
