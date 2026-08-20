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

  if (error) {
    return <p>Erro ao carregar clientes: {error.message}</p>
  }

  return (
    <main className="p-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Clientes</h1>
        <Link
          href="/clientes/novo"
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
        >
          + Novo Cliente
        </Link>
      </div>

      {clientes.length === 0 ? (
        <p className="text-gray-500">Nenhum cliente cadastrado ainda.</p>
      ) : (
        <table className="w-full border-collapse">
          <thead>
            <tr className="border-b">
              <th className="text-left p-2">Código</th>
              <th className="text-left p-2">Nome</th>
              <th className="text-left p-2">Telefone</th>
              <th className="text-left p-2">Tag</th>
              <th className="text-left p-2">Ações</th>
            </tr>
          </thead>
          <tbody>
            {clientes.map((cliente: Cliente) => (
              <tr key={cliente.id} className="border-b hover:bg-gray-50">
                <td className="p-2 text-xs font-mono text-gray-500">{cliente.codigo ?? '—'}</td>
                <td className="p-2">
                  <Link href={`/clientes/${cliente.id}`} className="font-medium hover:text-blue-600">
                    {cliente.nome}
                  </Link>
                  {cliente.nome_estabelecimento && (
                    <p className="text-xs text-gray-400">{cliente.nome_estabelecimento}</p>
                  )}
                </td>
                <td className="p-2">{cliente.telefone ?? '—'}</td>
                <td className="p-2">
                  <div className="flex flex-wrap gap-1">
                    {cliente.tag
                      ? cliente.tag.split(',').map(t => (
                          <span key={t} className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full">
                            {t.trim()}
                          </span>
                        ))
                      : '—'}
                  </div>
                </td>
                <td className="p-2 flex gap-3">
                  <Link href={`/clientes/${cliente.id}/editar`} className="text-blue-600 hover:underline text-sm">
                    Editar
                  </Link>
                  <DeletarCliente id={cliente.id} nome={cliente.nome} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </main>
  )
}
