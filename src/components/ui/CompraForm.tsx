'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { compraSchema, CompraForm as CompraFormType } from '@/schemas'
import { Fornecedor } from '@/types'

interface Props {
  fornecedores: Fornecedor[]
}

export default function CompraForm({ fornecedores }: Props) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [erros, setErros] = useState<Record<string, string>>({})
  const [form, setForm] = useState<CompraFormType>({
    fornecedor_id: '',
    data: new Date().toISOString().split('T')[0],
    observacao: '',
  })

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setErros({})

    const resultado = compraSchema.safeParse(form)
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
      .from('compras')
      .insert(resultado.data)
      .select()
      .single()
    setLoading(false)

    if (error || !data) {
      alert('Erro ao salvar: ' + error?.message)
      return
    }

    router.push(`/compras/${data.id}/editar`)
    router.refresh()
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4 max-w-md">
      <div>
        <label className="block text-sm font-medium mb-1">Fornecedor *</label>
        <select
          name="fornecedor_id"
          value={form.fornecedor_id}
          onChange={handleChange}
          className="w-full border rounded p-2 bg-white text-gray-900"
        >
          <option value="">Selecione...</option>
          {fornecedores.map((f) => (
            <option key={f.id} value={f.id}>{f.nome}</option>
          ))}
        </select>
        {erros.fornecedor_id && <p className="text-red-500 text-sm mt-1">{erros.fornecedor_id}</p>}
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
          placeholder="Observações sobre a compra"
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
