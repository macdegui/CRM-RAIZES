'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { receitaSchema, ReceitaForm as ReceitaFormType } from '@/schemas'
import { Receita, Produto } from '@/types'

interface Props {
  receita: Receita
  produtos: Produto[]
}

export default function ReceitaEditForm({ receita, produtos }: Props) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [erros, setErros] = useState<Record<string, string>>({})
  const [form, setForm] = useState<ReceitaFormType>({
    produto_id: receita.produto_id,
    nome: receita.nome,
    rendimento: receita.rendimento,
    ativa: receita.ativa,
  })

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) {
    const { name, value, type } = e.target
    setForm({
      ...form,
      [name]: type === 'checkbox'
        ? (e.target as HTMLInputElement).checked
        : value,
    })
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setErros({})

    const resultado = receitaSchema.safeParse(form)
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
      .from('receitas')
      .update(resultado.data)
      .eq('id', receita.id)
    setLoading(false)

    if (error) {
      alert('Erro ao atualizar: ' + error.message)
      return
    }

    router.push('/receitas')
    router.refresh()
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4 max-w-md">
      <div>
        <label className="block text-sm font-medium mb-1">Produto *</label>
        <select
          name="produto_id"
          value={form.produto_id}
          onChange={handleChange}
          className="w-full border rounded p-2 bg-white text-gray-900"
        >
          <option value="">Selecione...</option>
          {produtos.map((p) => (
            <option key={p.id} value={p.id}>{p.nome}</option>
          ))}
        </select>
        {erros.produto_id && <p className="text-red-500 text-sm mt-1">{erros.produto_id}</p>}
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Nome da receita *</label>
        <input
          name="nome"
          value={form.nome}
          onChange={handleChange}
          className="w-full border rounded p-2 bg-white text-gray-900"
        />
        {erros.nome && <p className="text-red-500 text-sm mt-1">{erros.nome}</p>}
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Rendimento (unidades) *</label>
        <input
          name="rendimento"
          type="number"
          value={form.rendimento}
          onChange={handleChange}
          className="w-full border rounded p-2 bg-white text-gray-900"
        />
        {erros.rendimento && <p className="text-red-500 text-sm mt-1">{erros.rendimento}</p>}
      </div>

      <div className="flex items-center gap-2">
        <input
          type="checkbox"
          name="ativa"
          id="ativa"
          checked={form.ativa}
          onChange={handleChange}
        />
        <label htmlFor="ativa" className="text-sm font-medium">Receita ativa</label>
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
          onClick={() => router.push('/receitas')}
          className="border rounded p-2 hover:bg-gray-50"
        >
          Cancelar
        </button>
      </div>
    </form>
  )
}
