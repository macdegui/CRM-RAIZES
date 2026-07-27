'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { clienteSchema, ClienteForm as ClienteFormType } from '@/schemas'
import { Cliente } from '@/types'

interface Props {
  cliente: Cliente
}

export default function ClienteEditForm({ cliente }: Props) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [erros, setErros] = useState<Record<string, string>>({})
  const [form, setForm] = useState<ClienteFormType>({
    nome: cliente.nome,
    codigo: cliente.codigo ?? '',
    tag: cliente.tag ?? '',
    contato: cliente.contato ?? '',
  })

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setErros({})

    const resultado = clienteSchema.safeParse(form)
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
      .from('clientes')
      .update(resultado.data)
      .eq('id', cliente.id)
    setLoading(false)

    if (error) {
      alert('Erro ao atualizar: ' + error.message)
      return
    }

    router.push('/clientes')
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
        <label className="block text-sm font-medium mb-1">Código</label>
        <input
          name="codigo"
          value={form.codigo}
          onChange={handleChange}
          className="w-full border rounded p-2 bg-white text-gray-900"
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Tag</label>
        <input
          name="tag"
          value={form.tag}
          onChange={handleChange}
          className="w-full border rounded p-2 bg-white text-gray-900"
        />
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
          onClick={() => router.push('/clientes')}
          className="border rounded p-2 hover:bg-gray-50"
        >
          Cancelar
        </button>
      </div>
    </form>
  )
}
