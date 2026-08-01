'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { fornecedorSchema, FornecedorForm as FornecedorFormType } from '@/schemas'
import { Fornecedor } from '@/types'

interface Props {
  fornecedor: Fornecedor
}

export default function FornecedorEditForm({ fornecedor }: Props) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [erros, setErros] = useState<Record<string, string>>({})
  const [form, setForm] = useState<FornecedorFormType>({
    nome: fornecedor.nome,
    contato: fornecedor.contato ?? '',
    documento: fornecedor.documento ?? '',
  })

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setErros({})

    const resultado = fornecedorSchema.safeParse(form)
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
      .from('fornecedores')
      .update(resultado.data)
      .eq('id', fornecedor.id)
    setLoading(false)

    if (error) {
      alert('Erro ao atualizar: ' + error.message)
      return
    }

    router.push('/fornecedores')
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
        <label className="block text-sm font-medium mb-1">Contato</label>
        <input
          name="contato"
          value={form.contato}
          onChange={handleChange}
          className="w-full border rounded p-2 bg-white text-gray-900"
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">CPF / CNPJ</label>
        <input
          name="documento"
          value={form.documento}
          onChange={handleChange}
          className="w-full border rounded p-2 bg-white text-gray-900"
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
          onClick={() => router.push('/fornecedores')}
          className="border rounded p-2 hover:bg-gray-50"
        >
          Cancelar
        </button>
      </div>
    </form>
  )
}
