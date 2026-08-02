'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { receitaSchema, ReceitaForm as ReceitaFormType } from '@/schemas'
import { Produto } from '@/types'

interface Props {
  produtos: Produto[]
}

export default function ReceitaForm({ produtos }: Props) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [erros, setErros] = useState<Record<string, string>>({})
  const [form, setForm] = useState<ReceitaFormType>({
    produto_id: '',
    nome: '',
    rendimento: 0,
    ativa: true,
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
    const { error } = await supabase.from('receitas').insert(resultado.data)
    setLoading(false)

    if (error) {
      alert('Erro ao salvar: ' + error.message)
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
          placeholder="Ex: Pão de mel chocolate 70%"
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
          placeholder="Quantas unidades essa receita produz"
        />
        {erros.rendimento && <p className="text-red-500 text-sm mt-1">{erros.rendimento}</p>}
      </div>

      <button
        type="submit"
        disabled={loading}
        className="bg-blue-600 text-white rounded p-2 font-medium hover:bg-blue-700 disabled:opacity-50"
      >
        {loading ? 'Salvando...' : 'Salvar receita'}
      </button>
    </form>
  )
}
