export const dynamic = 'force-dynamic'

import Link from 'next/link'
import { supabase } from '@/lib/supabase'
import { Cliente } from '@/types'
import DeletarCliente from '@/components/ui/DeletarCliente'

export default async function ClientesPage() {
  const { data: clientes, error } = await supabase
    .from('clientes')
    .select('*')
    .order('nome')

  if (error) return <p>Erro ao carregar clientes: {error.message}</p>

  return (
    <main className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-xl font-bold text-gray-900">Clientes</h1>
          <p className="text-sm text-gray-500 mt-0.5">{clientes.length} cadastrados</p>
        </div>
        <Link href="/clientes/novo" className="bg-gray-900 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-black transition-colors">
          + Novo Cliente
        </Link>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        {clientes.length === 0 ? (
          <div className="p-12 text-center text-gray-400 text-sm">Nenhum cliente cadastrado ainda.</div>
        ) : (
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-100">
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Código</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Nome</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Telefone</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Tag</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Ações</th>
              </tr>
            </thead>
            <tbody>
              {clientes.map((cliente: Cliente) => (
                <tr key={cliente.id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-3 text-xs font-mono text-gray-400">{cliente.codigo ?? '—'}</td>
                  <td className="px-4 py-3">
                    <Link href={`/clientes/${cliente.id}`} className="text-sm font-medium text-gray-900 hover:text-blue-600">
                      {cliente.nome}
                    </Link>
                    {cliente.nome_estabelecimento && (
                      <p className="text-xs text-gray-400 mt-0.5">{cliente.nome_estabelecimento}</p>
                    )}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-600">{cliente.telefone ?? '—'}</td>
                  <td className="px-4 py-3">
                    <div className="flex flex-wrap gap-1">
                      {cliente.tag
                        ? cliente.tag.split(',').map(t => (
                            <span key={t} className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full">
                              {t.trim()}
                            </span>
                          ))
                        : <span className="text-sm text-gray-400">—</span>}
                    </div>
                  </td>
                  <td className="px-4 py-3 flex gap-3">
                    <Link href={`/clientes/${cliente.id}/editar`} className="text-sm text-blue-600 hover:text-blue-800 font-medium">Editar</Link>
                    <DeletarCliente id={cliente.id} nome={cliente.nome} />
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
