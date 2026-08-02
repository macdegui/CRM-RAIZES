export const dynamic = 'force-dynamic'

import Link from 'next/link'
import { supabase } from '@/lib/supabase'
import { Produto } from '@/types'
import DeletarProduto from '@/components/ui/DeletarProduto'

export default async function ProdutosPage() {
  const { data: produtos, error } = await supabase
    .from('produtos')
    .select('*')
    .order('nome')

  if (error) {
    return <p>Erro ao carregar produtos: {error.message}</p>
  }

  return (
    <main className="p-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Produtos</h1>
        <Link
          href="/produtos/novo"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          + Novo Produto
        </Link>
      </div>

      {produtos.length === 0 ? (
        <p className="text-gray-500">Nenhum produto cadastrado ainda.</p>
      ) : (
        <table className="w-full border-collapse">
          <thead>
            <tr className="border-b">
              <th className="text-left p-2">Nome</th>
              <th className="text-left p-2">Preço de venda</th>
              <th className="text-left p-2">Ativo</th>
              <th className="text-left p-2">Ações</th>
            </tr>
          </thead>
          <tbody>
            {produtos.map((produto: Produto) => (
              <tr key={produto.id} className="border-b hover:bg-gray-50">
                <td className="p-2">{produto.nome}</td>
                <td className="p-2">R$ {Number(produto.preco_venda).toFixed(2)}</td>
                <td className="p-2">{produto.ativo ? 'Sim' : 'Não'}</td>
                <td className="p-2 flex gap-3">
                  <Link
                    href={`/produtos/${produto.id}/editar`}
                    className="text-blue-600 hover:underline text-sm"
                  >
                    Editar
                  </Link>
                  <DeletarProduto id={produto.id} nome={produto.nome} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </main>
  )
}
