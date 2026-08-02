'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { compraSchema, CompraForm as CompraFormType, compraItemSchema } from '@/schemas'
import { Compra, CompraItem, Fornecedor, Ingrediente } from '@/types'

interface Props {
  compra: Compra
  itens: CompraItem[]
  fornecedores: Fornecedor[]
  ingredientes: Ingrediente[]
}

export default function CompraEditForm({ compra, itens, fornecedores, ingredientes }: Props) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [erros, setErros] = useState<Record<string, string>>({})
  const [form, setForm] = useState<CompraFormType>({
    fornecedor_id: compra.fornecedor_id,
    data: compra.data,
    observacao: compra.observacao ?? '',
  })
  const [novoItem, setNovoItem] = useState({
    ingrediente_id: '',
    quantidade: '',
    valor_unitario: '',
  })

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  function handleItemChange(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) {
    setNovoItem({ ...novoItem, [e.target.name]: e.target.value })
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
    const { error } = await supabase
      .from('compras')
      .update(resultado.data)
      .eq('id', compra.id)
    setLoading(false)

    if (error) {
      alert('Erro ao atualizar: ' + error.message)
      return
    }

    router.push('/compras')
    router.refresh()
  }

  async function handleAdicionarItem(e: React.FormEvent) {
    e.preventDefault()

    const resultado = compraItemSchema.safeParse({
      compra_id: compra.id,
      ingrediente_id: novoItem.ingrediente_id,
      quantidade: novoItem.quantidade,
      valor_unitario: novoItem.valor_unitario,
    })

    if (!resultado.success) {
      alert('Preencha todos os campos do item corretamente.')
      return
    }

    const { error } = await supabase.from('compra_itens').insert(resultado.data)

    if (error) {
      alert('Erro ao adicionar item: ' + error.message)
      return
    }

    setNovoItem({ ingrediente_id: '', quantidade: '', valor_unitario: '' })
    router.refresh()
  }

  async function handleDeletarItem(id: string) {
    const confirmou = confirm('Remover este item?')
    if (!confirmou) return

    const { error } = await supabase.from('compra_itens').delete().eq('id', id)
    if (error) {
      alert('Erro ao remover item: ' + error.message)
      return
    }

    router.refresh()
  }

  const ingredientesMap = Object.fromEntries(ingredientes.map((i) => [i.id, i]))

  return (
    <div className="flex flex-col gap-8 max-w-2xl">
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <h2 className="text-lg font-semibold">Dados da compra</h2>

        <div>
          <label className="block text-sm font-medium mb-1">Fornecedor *</label>
          <select
            name="fornecedor_id"
            value={form.fornecedor_id}
            onChange={handleChange}
            className="w-full border rounded p-2 bg-white text-gray-900"
          >
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
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Observação</label>
          <textarea
            name="observacao"
            value={form.observacao}
            onChange={handleChange}
            className="w-full border rounded p-2 bg-white text-gray-900"
            rows={2}
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
            onClick={() => router.push('/compras')}
            className="border rounded p-2 hover:bg-gray-50"
          >
            Cancelar
          </button>
        </div>
      </form>

      <div>
        <h2 className="text-lg font-semibold mb-4">Itens da compra</h2>

        {itens.length === 0 ? (
          <p className="text-gray-500 text-sm mb-4">Nenhum item adicionado ainda.</p>
        ) : (
          <table className="w-full border-collapse mb-4">
            <thead>
              <tr className="border-b">
                <th className="text-left p-2">Ingrediente</th>
                <th className="text-left p-2">Quantidade</th>
                <th className="text-left p-2">Valor unitário</th>
                <th className="text-left p-2">Subtotal</th>
                <th className="text-left p-2"></th>
              </tr>
            </thead>
            <tbody>
              {itens.map((item) => {
                const ingrediente = ingredientesMap[item.ingrediente_id]
                return (
                  <tr key={item.id} className="border-b">
                    <td className="p-2">{ingrediente?.nome ?? '—'}</td>
                    <td className="p-2">{item.quantidade} {ingrediente?.unidade ?? ''}</td>
                    <td className="p-2">R$ {Number(item.valor_unitario).toFixed(2)}</td>
                    <td className="p-2">R$ {(item.quantidade * item.valor_unitario).toFixed(2)}</td>
                    <td className="p-2">
                      <button
                        onClick={() => handleDeletarItem(item.id)}
                        className="text-red-500 hover:underline text-sm"
                      >
                        Remover
                      </button>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        )}

        <form onSubmit={handleAdicionarItem} className="flex flex-col gap-3 border rounded p-4 bg-gray-50">
          <h3 className="text-sm font-semibold">Adicionar item</h3>
          <div className="flex gap-2">
            <select
              name="ingrediente_id"
              value={novoItem.ingrediente_id}
              onChange={handleItemChange}
              className="flex-1 border rounded p-2 bg-white text-gray-900"
            >
              <option value="">Ingrediente...</option>
              {ingredientes.map((i) => (
                <option key={i.id} value={i.id}>{i.nome} ({i.unidade})</option>
              ))}
            </select>
            <input
              name="quantidade"
              type="number"
              step="0.01"
              value={novoItem.quantidade}
              onChange={handleItemChange}
              placeholder="Qtd"
              className="w-24 border rounded p-2 bg-white text-gray-900"
            />
            <input
              name="valor_unitario"
              type="number"
              step="0.01"
              value={novoItem.valor_unitario}
              onChange={handleItemChange}
              placeholder="R$ unit."
              className="w-28 border rounded p-2 bg-white text-gray-900"
            />
            <button
              type="submit"
              className="bg-green-600 text-white rounded px-4 hover:bg-green-700"
            >
              +
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
