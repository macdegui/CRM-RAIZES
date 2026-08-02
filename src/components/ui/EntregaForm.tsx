'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { entregaSchema, EntregaForm as EntregaFormType } from '@/schemas'
import { Pedido, Cliente } from '@/types'

interface Props {
  pedidos: Pedido[]
  clientes: Cliente[]
}

export default function EntregaForm({ pedidos, clientes }: Props) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [erros, setErros] = useState<Record<string, string>>({})
  const [form, setForm] = useState<EntregaFormType>({
    pedido_id: '',
    cliente_id: '',
    status: 'PENDENTE',
    tipo: undefined,
    data_prevista: '',
    data_entrega: '',
    endereco: '',
    custo: undefined,
    observacao: '',
  })

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) {
    const { name, value } = e.target
    if (name === 'pedido_id') {
      const pedido = pedidos.find((p) => p.id === value)
      setForm({ ...form, pedido_id: value, cliente_id: pedido?.cliente_id ?? '' })
      return
    }
    setForm({ ...form, [name]: value })
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setErros({})

    const resultado = entregaSchema.safeParse(form)
    if (!resultado.success) {
      const errosFormatados: Record<string, string> = {}
      resultado.error.issues.forEach((issue) => {
        if (issue.path[0]) errosFormatados[issue.path[0] as string] = issue.message
      })
      setErros(errosFormatados)
      return
    }

    setLoading(true)
    const { error } = await supabase.from('entregas').insert(resultado.data)
    setLoading(false)

    if (error) {
      alert('Erro ao salvar: ' + error.message)
      return
    }

    router.push('/entregas')
    router.refresh()
  }

  const clientesMap = Object.fromEntries(clientes.map((c) => [c.id, c.nome]))

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4 max-w-md">
      <div>
        <label className="block text-sm font-medium mb-1">Pedido *</label>
        <select
          name="pedido_id"
          value={form.pedido_id}
          onChange={handleChange}
          className="w-full border rounded p-2 bg-white text-gray-900"
        >
          <option value="">Selecione...</option>
          {pedidos.map((p) => (
            <option key={p.id} value={p.id}>
              {p.data} — {clientesMap[p.cliente_id] ?? ''}
            </option>
          ))}
        </select>
        {erros.pedido_id && <p className="text-red-500 text-sm mt-1">{erros.pedido_id}</p>}
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Tipo</label>
        <select
          name="tipo"
          value={form.tipo ?? ''}
          onChange={handleChange}
          className="w-full border rounded p-2 bg-white text-gray-900"
        >
          <option value="">Selecione...</option>
          <option value="RETIRADA">Retirada</option>
          <option value="MOTOBOY">Motoboy</option>
          <option value="APP">App</option>
          <option value="TRANSPORTADORA">Transportadora</option>
        </select>
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
          <option value="EM_TRANSITO">Em trânsito</option>
          <option value="ENTREGUE">Entregue</option>
        </select>
        {erros.status && <p className="text-red-500 text-sm mt-1">{erros.status}</p>}
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Data prevista</label>
        <input
          name="data_prevista"
          type="date"
          value={form.data_prevista ?? ''}
          onChange={handleChange}
          className="w-full border rounded p-2 bg-white text-gray-900"
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Data de entrega</label>
        <input
          name="data_entrega"
          type="date"
          value={form.data_entrega ?? ''}
          onChange={handleChange}
          className="w-full border rounded p-2 bg-white text-gray-900"
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Endereço</label>
        <input
          name="endereco"
          value={form.endereco ?? ''}
          onChange={handleChange}
          className="w-full border rounded p-2 bg-white text-gray-900"
          placeholder="Endereço de entrega"
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Custo</label>
        <input
          name="custo"
          type="number"
          step="0.01"
          value={form.custo ?? ''}
          onChange={handleChange}
          className="w-full border rounded p-2 bg-white text-gray-900"
          placeholder="0.00"
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Observação</label>
        <textarea
          name="observacao"
          value={form.observacao ?? ''}
          onChange={handleChange}
          className="w-full border rounded p-2 bg-white text-gray-900"
          rows={3}
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        className="bg-blue-600 text-white rounded p-2 font-medium hover:bg-blue-700 disabled:opacity-50"
      >
        {loading ? 'Salvando...' : 'Salvar entrega'}
      </button>
    </form>
  )
}
