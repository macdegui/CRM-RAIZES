'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { pedidoSchema, PedidoForm as PedidoFormType, pedidoItemSchema } from '@/schemas'
import { Pedido, PedidoItem, Cliente, Produto } from '@/types'

interface Props {
  pedido: Pedido
  itens: PedidoItem[]
  clientes: Cliente[]
  produtos: Produto[]
}

export default function PedidoEditForm({ pedido, itens, clientes, produtos }: Props) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [erros, setErros] = useState<Record<string, string>>({})
  const [form, setForm] = useState<PedidoFormType>({
    cliente_id: pedido.cliente_id,
    status: pedido.status,
    data: pedido.data,
    observacao: pedido.observacao ?? '',
  })
  const [novoItem, setNovoItem] = useState({
    produto_id: '',
    quantidade: '',
    preco_unitario: '',
  })

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  function handleItemChange(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) {
    const { name, value } = e.target
    const updated = { ...novoItem, [name]: value }
    if (name === 'produto_id') {
      const produto = produtos.find((p) => p.id === value)
      if (produto) updated.preco_unitario = String(produto.preco_venda)
    }
    setNovoItem(updated)
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setErros({})

    const resultado = pedidoSchema.safeParse(form)
    if (!resultado.success) {
      const errosFormatados: Record<string, string> = {}
      resultado.error.issues.forEach((issue) => {
        if (issue.path[0]) errosFormatados[issue.path[0] as string] = issue.message
      })
      setErros(errosFormatados)
      return
    }

    const total = itens.reduce((acc, item) => acc + item.quantidade * item.preco_unitario, 0)

    setLoading(true)
    const { error } = await supabase
      .from('pedidos')
      .update({ ...resultado.data, total })
      .eq('id', pedido.id)
    setLoading(false)

    if (error) {
      alert('Erro ao atualizar: ' + error.message)
      return
    }

    router.push('/pedidos')
    router.refresh()
  }

  async function handleAdicionarItem(e: React.FormEvent) {
    e.preventDefault()

    const resultado = pedidoItemSchema.safeParse({
      pedido_id: pedido.id,
      produto_id: novoItem.produto_id,
      quantidade: novoItem.quantidade,
      preco_unitario: novoItem.preco_unitario,
    })

    if (!resultado.success) {
      alert('Preencha todos os campos do item corretamente.')
      return
    }

    const { error } = await supabase.from('pedido_itens').insert(resultado.data)

    if (error) {
      alert('Erro ao adicionar item: ' + error.message)
      return
    }

    setNovoItem({ produto_id: '', quantidade: '', preco_unitario: '' })
    router.refresh()
  }

  async function handleDeletarItem(id: string) {
    const confirmou = confirm('Remover este item?')
    if (!confirmou) return

    const { error } = await supabase.from('pedido_itens').delete().eq('id', id)
    if (error) {
      alert('Erro ao remover item: ' + error.message)
      return
    }

    router.refresh()
  }

  const produtosMap = Object.fromEntries(produtos.map((p) => [p.id, p]))
  const total = itens.reduce((acc, item) => acc + item.quantidade * item.preco_unitario, 0)

  return (
    <div className="flex flex-col gap-8 max-w-2xl">
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <h2 className="text-lg font-semibold">Dados do pedido</h2>

        <div>
          <label className="block text-sm font-medium mb-1">Cliente *</label>
          <select
            name="cliente_id"
            value={form.cliente_id}
            onChange={handleChange}
            className="w-full border rounded p-2 bg-white text-gray-900"
          >
            {clientes.map((c) => (
              <option key={c.id} value={c.id}>{c.nome}</option>
            ))}
          </select>
          {erros.cliente_id && <p className="text-red-500 text-sm mt-1">{erros.cliente_id}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Status *</label>
          <select
            name="status"
            value={form.status}
            onChange={handleChange}
            className="w-full border rounded p-2 bg-white text-gray-900"
          >
            <option value="PENDENTE">Pendente</option>
            <option value="EM_PRODUCAO">Em produção</option>
            <option value="ENTREGUE">Entregue</option>
            <option value="PAGO">Pago</option>
          </select>
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
            onClick={() => router.push('/pedidos')}
            className="border rounded p-2 hover:bg-gray-50"
          >
            Cancelar
          </button>
        </div>
      </form>

      <div>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold">Itens do pedido</h2>
          {itens.length > 0 && (
            <span className="font-semibold text-green-700">
              Total: R$ {total.toFixed(2)}
            </span>
          )}
        </div>

        {itens.length === 0 ? (
          <p className="text-gray-500 text-sm mb-4">Nenhum item adicionado ainda.</p>
        ) : (
          <table className="w-full border-collapse mb-4">
            <thead>
              <tr className="border-b">
                <th className="text-left p-2">Produto</th>
                <th className="text-left p-2">Qtd</th>
                <th className="text-left p-2">Preço unit.</th>
                <th className="text-left p-2">Subtotal</th>
                <th className="text-left p-2"></th>
              </tr>
            </thead>
            <tbody>
              {itens.map((item) => {
                const produto = produtosMap[item.produto_id]
                return (
                  <tr key={item.id} className="border-b">
                    <td className="p-2">{produto?.nome ?? '—'}</td>
                    <td className="p-2">{item.quantidade}</td>
                    <td className="p-2">R$ {Number(item.preco_unitario).toFixed(2)}</td>
                    <td className="p-2">R$ {(item.quantidade * item.preco_unitario).toFixed(2)}</td>
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
              name="produto_id"
              value={novoItem.produto_id}
              onChange={handleItemChange}
              className="flex-1 border rounded p-2 bg-white text-gray-900"
            >
              <option value="">Produto...</option>
              {produtos.map((p) => (
                <option key={p.id} value={p.id}>{p.nome}</option>
              ))}
            </select>
            <input
              name="quantidade"
              type="number"
              step="1"
              value={novoItem.quantidade}
              onChange={handleItemChange}
              placeholder="Qtd"
              className="w-20 border rounded p-2 bg-white text-gray-900"
            />
            <input
              name="preco_unitario"
              type="number"
              step="0.01"
              value={novoItem.preco_unitario}
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
