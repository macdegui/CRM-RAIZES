'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { gastoSchema, GastoForm as GastoFormType } from '@/schemas'
import { Gasto, CategoriaGasto } from '@/types'

interface Props {
  gasto: Gasto
  categorias: CategoriaGasto[]
}

export default function GastoEditForm({ gasto, categorias }: Props) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [erros, setErros] = useState<Record<string, string>>({})
  const [form, setForm] = useState<GastoFormType>({
    descricao: gasto.descricao,
    categoria_id: gasto.categoria_id,
    valor: gasto.valor,
    data: gasto.data,
    recorrente: gasto.recorrente,
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

    const resultado = gastoSchema.safeParse(form)
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
      .from('gastos')
      .update(resultado.data)
      .eq('id', gasto.id)
    setLoading(false)

    if (error) {
      alert('Erro ao atualizar: ' + error.message)
      return
    }

    router.push('/gastos')
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
        <label className="block text-sm font-medium mb-1">Categoria *</label>
        <select
          name="categoria_id"
          value={form.categoria_id}
          onChange={handleChange}
          className="w-full border rounded p-2 bg-white text-gray-900"
        >
          <option value="">Selecione...</option>
          {categorias.map((cat) => (
            <option key={cat.id} value={cat.id}>{cat.nome}</option>
          ))}
        </select>
        {erros.categoria_id && <p className="text-red-500 text-sm mt-1">{erros.categoria_id}</p>}
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

      <div className="flex items-center gap-2">
        <input
          type="checkbox"
          name="recorrente"
          id="recorrente"
          checked={form.recorrente}
          onChange={handleChange}
        />
        <label htmlFor="recorrente" className="text-sm font-medium">Gasto recorrente</label>
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
          onClick={() => router.push('/gastos')}
          className="border rounded p-2 hover:bg-gray-50"
        >
          Cancelar
        </button>
      </div>
    </form>
  )
}
