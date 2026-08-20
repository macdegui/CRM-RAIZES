export const dynamic = 'force-dynamic'

import Link from 'next/link'
import { supabase } from '@/lib/supabase'

interface Props {
  params: Promise<{ id: string }>
}

export default async function ClientePerfilPage({ params }: Props) {
  const { id } = await params

  const [{ data: cliente, error }, { data: pedidos }] = await Promise.all([
    supabase.from('clientes').select('*').eq('id', id).single(),
    supabase.from('pedidos').select('*').eq('cliente_id', id).order('data', { ascending: false }),
  ])

  if (error || !cliente) {
    return <p>Cliente não encontrado.</p>
  }

  const tags = cliente.tag
    ? cliente.tag.split(',').map((t: string) => t.trim()).filter(Boolean)
    : []

  return (
    <main className="p-8 max-w-2xl">
      <div className="flex items-center gap-4 mb-6">
        <Link href="/clientes" className="text-gray-400 hover:text-gray-600 text-sm">← Clientes</Link>
        <Link href={`/clientes/${id}/editar`} className="ml-auto text-blue-600 hover:underline text-sm">
          Editar
        </Link>
      </div>

      {/* Cabeçalho */}
      <div className="bg-white border rounded-xl p-6 mb-6">
        <div className="flex items-start justify-between mb-2">
          <div>
            <p className="text-xs font-mono text-gray-400 mb-1">{cliente.codigo ?? 'Sem código'}</p>
            <h1 className="text-2xl font-bold">{cliente.nome}</h1>
            {cliente.nome_estabelecimento && (
              <p className="text-gray-500 mt-1">{cliente.nome_estabelecimento}</p>
            )}
          </div>
          {tags.length > 0 && (
            <div className="flex flex-wrap gap-1">
              {tags.map((tag: string) => (
                <span key={tag} className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full">
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>

        <div className="grid grid-cols-2 gap-4 mt-4 text-sm">
          {cliente.telefone && (
            <div>
              <p className="text-xs text-gray-400 mb-0.5">Telefone</p>
              <p className="font-medium">{cliente.telefone}</p>
            </div>
          )}
          {cliente.email && (
            <div>
              <p className="text-xs text-gray-400 mb-0.5">Email</p>
              <p className="font-medium">{cliente.email}</p>
            </div>
          )}
          {cliente.endereco && (
            <div className="col-span-2">
              <p className="text-xs text-gray-400 mb-0.5">Endereço</p>
              <p className="font-medium">{cliente.endereco}</p>
            </div>
          )}
          {cliente.cnpj && (
            <div>
              <p className="text-xs text-gray-400 mb-0.5">CNPJ</p>
              <p className="font-medium">{cliente.cnpj}</p>
            </div>
          )}
          <div>
            <p className="text-xs text-gray-400 mb-0.5">Cadastrado em</p>
            <p className="font-medium">{new Date(cliente.created_at).toLocaleDateString('pt-BR')}</p>
          </div>
        </div>

        {cliente.observacoes && (
          <div className="mt-4 pt-4 border-t">
            <p className="text-xs text-gray-400 mb-1">Observações</p>
            <p className="text-sm text-gray-700 whitespace-pre-wrap">{cliente.observacoes}</p>
          </div>
        )}
      </div>

      {/* Histórico de pedidos */}
      <div className="bg-white border rounded-xl p-6">
        <h2 className="font-bold mb-4">Histórico de pedidos</h2>

        {!pedidos || pedidos.length === 0 ? (
          <p className="text-gray-400 text-sm">Nenhum pedido ainda.</p>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b">
                <th className="text-left py-2">Código</th>
                <th className="text-left py-2">Data</th>
                <th className="text-left py-2">Status</th>
                <th className="text-left py-2">Total</th>
              </tr>
            </thead>
            <tbody>
              {pedidos.map((pedido: any) => (
                <tr key={pedido.id} className="border-b hover:bg-gray-50">
                  <td className="py-2 font-mono text-xs text-gray-500">
                    {pedido.codigo ?? pedido.id.slice(0, 8).toUpperCase()}
                  </td>
                  <td className="py-2">{pedido.data}</td>
                  <td className="py-2">
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                      pedido.status === 'PAGO' ? 'bg-green-100 text-green-700' :
                      pedido.status === 'ENTREGUE' ? 'bg-blue-100 text-blue-700' :
                      pedido.status === 'EM_PRODUCAO' ? 'bg-amber-100 text-amber-700' :
                      'bg-gray-100 text-gray-600'
                    }`}>
                      {pedido.status}
                    </span>
                  </td>
                  <td className="py-2">
                    {pedido.total ? `R$ ${Number(pedido.total).toFixed(2)}` : '—'}
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
