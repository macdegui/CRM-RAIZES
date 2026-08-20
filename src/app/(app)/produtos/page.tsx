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

  if (error) return <p>Erro ao carregar produtos: {error.message}</p>

  return (
    <main className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-xl font-bold text-gray-900">Produtos</h1>
          <p className="text-sm text-gray-500 mt-0.5">{produtos.length} cadastrados</p>
        </div>
        <Link href="/produtos/novo" className="bg-gray-900 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-black transition-colors">
          + Novo Produto
        </Link>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        {produtos.length === 0 ? (
          <div className="p-12 text-center text-gray-400 text-sm">Nenhum produto cadastrado ainda.</div>
        ) : (
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-100">
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Nome</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Preço de venda</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Ativo</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Ações</th>
              </tr>
            </thead>
            <tbody>
              {produtos.map((produto: Produto) => (
                <tr key={produto.id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-3 text-sm font-medium text-gray-900">{produto.nome}</td>
                  <td className="px-4 py-3 text-sm text-gray-600">R$ {Number(produto.preco_venda).toFixed(2)}</td>
                  <td className="px-4 py-3">
                    <span className={`text-xs px-2 py-1 rounded-full font-medium ${produto.ativo ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                      {produto.ativo ? 'Ativo' : 'Inativo'}
                    </span>
                  </td>
                  <td className="px-4 py-3 flex gap-3">
                    <Link href={`/produtos/${produto.id}/editar`} className="text-sm text-blue-600 hover:text-blue-800 font-medium">Editar</Link>
                    <DeletarProduto id={produto.id} nome={produto.nome} />
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
