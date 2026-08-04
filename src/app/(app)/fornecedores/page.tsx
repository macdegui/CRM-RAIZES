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

  if (error) {
    return <p>Erro ao carregar fornecedores: {error.message}</p>
  }

  return (
    <main className="p-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Fornecedores</h1>
        <Link
          href="/fornecedores/novo"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          + Novo Fornecedor
        </Link>
      </div>

      {fornecedores.length === 0 ? (
        <p className="text-gray-500">Nenhum fornecedor cadastrado ainda.</p>
      ) : (
        <table className="w-full border-collapse">
          <thead>
            <tr className="border-b">
              <th className="text-left p-2">Nome</th>
              <th className="text-left p-2">Contato</th>
              <th className="text-left p-2">Documento</th>
              <th className="text-left p-2">Ações</th>
            </tr>
          </thead>
          <tbody>
            {fornecedores.map((fornecedor: Fornecedor) => (
              <tr key={fornecedor.id} className="border-b hover:bg-gray-50">
                <td className="p-2">{fornecedor.nome}</td>
                <td className="p-2">{fornecedor.contato ?? '—'}</td>
                <td className="p-2">{fornecedor.documento ?? '—'}</td>
                <td className="p-2 flex gap-3">
                  <Link
                    href={`/fornecedores/${fornecedor.id}/editar`}
                    className="text-blue-600 hover:underline text-sm"
                  >
                    Editar
                  </Link>
                  <DeletarFornecedor id={fornecedor.id} nome={fornecedor.nome} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </main>
  )
}
