'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { entregaSchema, EntregaForm as EntregaFormType } from '@/schemas'
import { Entrega, Pedido, Cliente } from '@/types'

interface Props {
  entrega: Entrega
  pedidos: Pedido[]
  clientes: Cliente[]
}

export default function EntregaEditForm({ entrega, pedidos, clientes }: Props) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [erros, setErros] = useState<Record<string, string>>({})
  const [form, setForm] = useState<EntregaFormType>({
    pedido_id: entrega.pedido_id,
    cliente_id: entrega.cliente_id,
    tipo: entrega.tipo ?? undefined,
    status: entrega.status,
    data_prevista: entrega.data_prevista ?? '',
    data_entrega: entrega.data_entrega ?? '',
    endereco: entrega.endereco ?? '',
    custo: entrega.custo ?? undefined,
    observacao: entrega.observacao ?? '',
  })

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) {
    setForm({ ...form, [e.target.name]: e.target.value })
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
    const { error } = await supabase
      .from('entregas')
      .update(resultado.data)
      .eq('id', entrega.id)
    setLoading(false)

    if (error) {
      alert('Erro ao atualizar: ' + error.message)
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

      <div className="flex gap-2">
        <button
          type="submit"
          disabled={loading}
          className="bg-blue-600 text-white rounded p-2 font-medium hover:bg-blue-700 disabled:opacity-50"
        >
          {loading ? 'Salvando...' : 'Salvar alterações'}
        </button>
        <button
          type="button"
          onClick={() => router.push('/entregas')}
          className="border rounded p-2 hover:bg-gray-50"
        >
          Cancelar
        </button>
      </div>
    </form>
  )
}
