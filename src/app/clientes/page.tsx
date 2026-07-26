export const dynamic = 'force-dynamic'

import { supabase } from '@/lib/supabase'
import { Cliente } from '@/types'

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
      <h1 className="text-2xl font-bold mb-6">Clientes</h1>

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
            </tr>
          </thead>
          <tbody>
            {clientes.map((cliente: Cliente) => (
              <tr key={cliente.id} className="border-b hover:bg-gray-50">
                <td className="p-2">{cliente.nome}</td>
                <td className="p-2">{cliente.codigo ?? '—'}</td>
                <td className="p-2">{cliente.tag ?? '—'}</td>
                <td className="p-2">{cliente.contato ?? '—'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </main>
  )
}
