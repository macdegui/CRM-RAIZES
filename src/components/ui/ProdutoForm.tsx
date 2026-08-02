'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { produtoSchema, ProdutoForm as ProdutoFormType } from '@/schemas'

export default function ProdutoForm() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [erros, setErros] = useState<Record<string, string>>({})
  const [form, setForm] = useState<ProdutoFormType>({
    nome: '',
    preco_venda: 0,
    ativo: true,
  })

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const { name, value, type, checked } = e.target
    setForm({ ...form, [name]: type === 'checkbox' ? checked : value })
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setErros({})

    const resultado = produtoSchema.safeParse(form)
    if (!resultado.success) {
      const errosFormatados: Record<string, string> = {}
      resultado.error.issues.forEach((issue) => {
        if (issue.path[0]) errosFormatados[issue.path[0] as string] = issue.message
      })
      setErros(errosFormatados)
      return
    }

    setLoading(true)
    const { error } = await supabase.from('produtos').insert(resultado.data)
    setLoading(false)

    if (error) {
      alert('Erro ao salvar: ' + error.message)
      return
    }

    router.push('/produtos')
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
          placeholder="Ex: Pão de mel chocolate"
        />
        {erros.nome && <p className="text-red-500 text-sm mt-1">{erros.nome}</p>}
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Preço de venda *</label>
        <input
          name="preco_venda"
          type="number"
          step="0.01"
          value={form.preco_venda}
          onChange={handleChange}
          className="w-full border rounded p-2 bg-white text-gray-900"
          placeholder="0.00"
        />
        {erros.preco_venda && <p className="text-red-500 text-sm mt-1">{erros.preco_venda}</p>}
      </div>

      <button
        type="submit"
        disabled={loading}
        className="bg-blue-600 text-white rounded p-2 font-medium hover:bg-blue-700 disabled:opacity-50"
      >
        {loading ? 'Salvando...' : 'Salvar produto'}
      </button>
    </form>
  )
}
