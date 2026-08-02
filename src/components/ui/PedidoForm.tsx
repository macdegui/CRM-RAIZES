'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { pedidoSchema, PedidoForm as PedidoFormType } from '@/schemas'
import { Cliente } from '@/types'

interface Props {
  clientes: Cliente[]
}

export default function PedidoForm({ clientes }: Props) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [erros, setErros] = useState<Record<string, string>>({})
  const [form, setForm] = useState<PedidoFormType>({
    cliente_id: '',
    status: 'PENDENTE',
    data: new Date().toISOString().split('T')[0],
    observacao: '',
  })

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setErros({})

    const resultado = pedidoSchema.safeParse(form)
    if (!resultado.success) {
      const errosFormatados: Record<string, string> = {}
      resultado.error.issues.forEach((issue) => {
        if (issue.path[0]) errosFormatados[issue.path[0] as string] = issue.message
      })
      setErros(errosFormatados)
      return
    }

    setLoading(true)
    const { data, error } = await supabase
      .from('pedidos')
      .insert(resultado.data)
      .select()
      .single()
    setLoading(false)

    if (error || !data) {
      alert('Erro ao salvar: ' + error?.message)
      return
    }

    router.push(`/pedidos/${data.id}/editar`)
    router.refresh()
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4 max-w-md">
      <div>
        <label className="block text-sm font-medium mb-1">Cliente *</label>
        <select
          name="cliente_id"
          value={form.cliente_id}
          onChange={handleChange}
          className="w-full border rounded p-2 bg-white text-gray-900"
        >
          <option value="">Selecione...</option>
          {clientes.map((c) => (
            <option key={c.id} value={c.id}>{c.nome}</option>
          ))}
        </select>
        {erros.cliente_id && <p className="text-red-500 text-sm mt-1">{erros.cliente_id}</p>}
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Status *</label>
        <select
          name="status"
          value={form.status}
          onChange={handleChange}
          className="w-full border rounded p-2 bg-white text-gray-900"
        >
          <option value="PENDENTE">Pendente</option>
          <option value="EM_PRODUCAO">Em produção</option>
          <option value="ENTREGUE">Entregue</option>
          <option value="PAGO">Pago</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Data *</label>
        <input
          name="data"
          type="date"
          value={form.data}
          onChange={handleChange}
          className="w-full border rounded p-2 bg-white text-gray-900"
        />
        {erros.data && <p className="text-red-500 text-sm mt-1">{erros.data}</p>}
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Observação</label>
        <textarea
          name="observacao"
          value={form.observacao}
          onChange={handleChange}
          className="w-full border rounded p-2 bg-white text-gray-900"
          rows={3}
          placeholder="Observações sobre o pedido"
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        className="bg-blue-600 text-white rounded p-2 font-medium hover:bg-blue-700 disabled:opacity-50"
      >
        {loading ? 'Salvando...' : 'Salvar e adicionar itens'}
      </button>
    </form>
  )
}
