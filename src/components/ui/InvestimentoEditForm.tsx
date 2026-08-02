'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { investimentoSchema, InvestimentoForm as InvestimentoFormType } from '@/schemas'
import { Investimento } from '@/types'

interface Props {
  investimento: Investimento
}

export default function InvestimentoEditForm({ investimento }: Props) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [erros, setErros] = useState<Record<string, string>>({})
  const [form, setForm] = useState<InvestimentoFormType>({
    descricao: investimento.descricao,
    valor: investimento.valor,
    data: investimento.data,
  })

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setErros({})

    const resultado = investimentoSchema.safeParse(form)
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
      .from('investimentos')
      .update(resultado.data)
      .eq('id', investimento.id)
    setLoading(false)

    if (error) {
      alert('Erro ao atualizar: ' + error.message)
      return
    }

    router.push('/investimentos')
    router.refresh()
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4 max-w-md">
      <div>
        <label className="block text-sm font-medium mb-1">Descrição *</label>
        <input
          name="descricao"
          value={form.descricao}
          onChange={handleChange}
          className="w-full border rounded p-2 bg-white text-gray-900"
        />
        {erros.descricao && <p className="text-red-500 text-sm mt-1">{erros.descricao}</p>}
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Valor *</label>
        <input
          name="valor"
          type="number"
          step="0.01"
          value={form.valor}
          onChange={handleChange}
          className="w-full border rounded p-2 bg-white text-gray-900"
        />
        {erros.valor && <p className="text-red-500 text-sm mt-1">{erros.valor}</p>}
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
          onClick={() => router.push('/investimentos')}
          className="border rounded p-2 hover:bg-gray-50"
        >
          Cancelar
        </button>
      </div>
    </form>
  )
}
