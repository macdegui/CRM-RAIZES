'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { ingredienteSchema, IngredienteForm as IngredienteFormType } from '@/schemas'
import { Ingrediente } from '@/types'

interface Props {
  ingrediente: Ingrediente
}

export default function IngredienteEditForm({ ingrediente }: Props) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [erros, setErros] = useState<Record<string, string>>({})
  const [form, setForm] = useState<IngredienteFormType>({
    nome: ingrediente.nome,
    unidade: ingrediente.unidade,
    estoque_minimo: ingrediente.estoque_minimo ?? undefined,
    ativo: ingrediente.ativo,
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

    const resultado = ingredienteSchema.safeParse(form)
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
      .from('ingredientes')
      .update(resultado.data)
      .eq('id', ingrediente.id)
    setLoading(false)

    if (error) {
      alert('Erro ao atualizar: ' + error.message)
      return
    }

    router.push('/ingredientes')
    router.refresh()
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4 max-w-md">
      <div>
        <label className="block text-sm font-medium mb-1">Nome *</label>
        <input
          name="nome"
          value={form.nome}
          onChange={handleChange}
          className="w-full border rounded p-2 bg-white text-gray-900"
        />
        {erros.nome && <p className="text-red-500 text-sm mt-1">{erros.nome}</p>}
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Unidade *</label>
        <select
          name="unidade"
          value={form.unidade}
          onChange={handleChange}
          className="w-full border rounded p-2 bg-white text-gray-900"
        >
          <option value="">Selecione...</option>
          <option value="KG">KG — Quilograma</option>
          <option value="G">G — Grama</option>
          <option value="L">L — Litro</option>
          <option value="ML">ML — Mililitro</option>
          <option value="UN">UN — Unidade</option>
        </select>
        {erros.unidade && <p className="text-red-500 text-sm mt-1">{erros.unidade}</p>}
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Estoque mínimo</label>
        <input
          name="estoque_minimo"
          type="number"
          value={form.estoque_minimo ?? ''}
          onChange={handleChange}
          className="w-full border rounded p-2 bg-white text-gray-900"
        />
      </div>

      <div className="flex items-center gap-2">
        <input
          type="checkbox"
          name="ativo"
          id="ativo"
          checked={form.ativo}
          onChange={handleChange}
        />
        <label htmlFor="ativo" className="text-sm font-medium">Ativo</label>
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
          onClick={() => router.push('/ingredientes')}
          className="border rounded p-2 hover:bg-gray-50"
        >
          Cancelar
        </button>
      </div>
    </form>
  )
}
