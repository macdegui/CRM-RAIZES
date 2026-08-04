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
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
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
              <th className="text-left p-2">Nome</th>
              <th className="text-left p-2">Código</th>
              <th className="text-left p-2">Tag</th>
              <th className="text-left p-2">Contato</th>
              <th className="text-left p-2">Ações</th>
            </tr>
          </thead>
          <tbody>
            {clientes.map((cliente: Cliente) => (
              <tr key={cliente.id} className="border-b hover:bg-gray-50">
                <td className="p-2">{cliente.nome}</td>
                <td className="p-2">{cliente.codigo ?? '—'}</td>
                <td className="p-2">{cliente.tag ?? '—'}</td>
                <td className="p-2">{cliente.contato ?? '—'}</td>
                <td className="p-2 flex gap-3">
                  <Link
                    href={`/clientes/${cliente.id}/editar`}
                    className="text-blue-600 hover:underline text-sm"
                  >
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
