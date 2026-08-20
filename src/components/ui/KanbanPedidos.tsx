'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { Pedido, PedidoItem, Cliente, Produto } from '@/types'

interface Props {
  pedidos: Pedido[]
  itens: PedidoItem[]
  clientes: Cliente[]
  produtos: Produto[]
}

export default function KanbanPedidos({ pedidos, itens, clientes, produtos }: Props) {
  const router = useRouter()
  const [expandido, setExpandido] = useState<string | null>(null)
  const [filtro, setFiltro] = useState<string>('todos')

  const clientesMap = Object.fromEntries(clientes.map(c => [c.id, c]))
  const produtosMap = Object.fromEntries(produtos.map(p => [p.id, p]))

  const itensPorPedido = itens.reduce((acc, item) => {
    if (!acc[item.pedido_id]) acc[item.pedido_id] = []
    acc[item.pedido_id].push(item)
    return acc
  }, {} as Record<string, PedidoItem[]>)

  const pedidosAtivos = pedidos.filter(p => p.status !== 'PAGO')

  const amarelos = pedidosAtivos.filter(p => {
    const its = itensPorPedido[p.id] ?? []
    return its.length === 0 || !its.every(i => i.produzido)
  })
  const verdes = pedidosAtivos.filter(p => {
    const its = itensPorPedido[p.id] ?? []
    return its.length > 0 && its.every(i => i.produzido) && p.status !== 'ENTREGUE'
  })
  const azuis = pedidosAtivos.filter(p => p.status === 'ENTREGUE')

  const pedidosFiltrados = {
    amarelo: filtro === 'todos' || filtro === 'amarelo' ? amarelos : [],
    verde: filtro === 'todos' || filtro === 'verde' ? verdes : [],
    azul: filtro === 'todos' || filtro === 'azul' ? azuis : [],
  }

  const totaisProdutos: Record<string, { nome: string; total: number }> = {}
  amarelos.forEach(p => {
    const its = itensPorPedido[p.id] ?? []
    its.filter(i => !i.produzido).forEach(i => {
      const prod = produtosMap[i.produto_id]
      if (!prod) return
      if (!totaisProdutos[i.produto_id]) totaisProdutos[i.produto_id] = { nome: prod.nome, total: 0 }
      totaisProdutos[i.produto_id].total += i.quantidade
    })
  })

  async function toggleProduzido(item: PedidoItem) {
    await supabase
      .from('pedido_itens')
      .update({ produzido: !item.produzido })
      .eq('id', item.id)
    router.refresh()
  }

  async function avancarParaEntregue(pedido: Pedido, tipoEntrega: string, custoUber?: number) {
    await supabase
      .from('pedidos')
      .update({ status: 'ENTREGUE', tipo_entrega: tipoEntrega, custo_uber: custoUber ?? null })
      .eq('id', pedido.id)
    router.refresh()
  }

  async function marcarPago(pedido: Pedido, formaPagamento: string, dataPagamento: string) {
    await supabase
      .from('pedidos')
      .update({ status: 'PAGO', forma_pagamento: formaPagamento, data_pagamento: dataPagamento })
      .eq('id', pedido.id)
    router.refresh()
  }

  async function voltarParaAmarelo(pedido: Pedido) {
    const its = itensPorPedido[pedido.id] ?? []
    await Promise.all(
      its.map(i => supabase.from('pedido_itens').update({ produzido: false }).eq('id', i.id))
    )
    await supabase
      .from('pedidos')
      .update({ status: 'PENDENTE' })
      .eq('id', pedido.id)
    router.refresh()
  }

  async function voltarParaVerde(pedido: Pedido) {
    await supabase
      .from('pedidos')
      .update({ status: 'EM_PRODUCAO', tipo_entrega: null, custo_uber: null })
      .eq('id', pedido.id)
    router.refresh()
  }

  return (
    <div className="flex flex-col min-h-screen pb-32">
      <div className="bg-white border-b px-4 py-2 flex gap-2 flex-wrap items-center">
        {[
          { key: 'todos', label: 'Todos' },
          { key: 'amarelo', label: '🟡 A produzir' },
          { key: 'verde', label: '🟢 Prontos' },
          { key: 'azul', label: '🔵 Entregues' },
        ].map(f => (
          <button
            key={f.key}
            onClick={() => setFiltro(f.key)}
            className={`px-3 py-1.5 rounded-full text-sm border transition-colors ${
              filtro === f.key
                ? 'bg-gray-900 text-white border-gray-900'
                : 'bg-white text-gray-600 border-gray-300 hover:border-gray-400'
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      <div className="flex gap-4 p-4 overflow-x-auto flex-1 items-start">
        <Coluna
          titulo="A produzir"
          cor="amarelo"
          count={pedidosFiltrados.amarelo.length}
          pedidos={pedidosFiltrados.amarelo}
          itensPorPedido={itensPorPedido}
          clientesMap={clientesMap}
          produtosMap={produtosMap}
          expandido={expandido}
          setExpandido={setExpandido}
          onToggleProduzido={toggleProduzido}
          onAvancar={avancarParaEntregue}
          onMarcarPago={marcarPago}
          onVoltarEtapa={null}
        />
        <Coluna
          titulo="Pronto para entregar"
          cor="verde"
          count={pedidosFiltrados.verde.length}
          pedidos={pedidosFiltrados.verde}
          itensPorPedido={itensPorPedido}
          clientesMap={clientesMap}
          produtosMap={produtosMap}
          expandido={expandido}
          setExpandido={setExpandido}
          onToggleProduzido={toggleProduzido}
          onAvancar={avancarParaEntregue}
          onMarcarPago={marcarPago}
          onVoltarEtapa={voltarParaAmarelo}
        />
        <Coluna
          titulo="Entregue"
          cor="azul"
          count={pedidosFiltrados.azul.length}
          pedidos={pedidosFiltrados.azul}
          itensPorPedido={itensPorPedido}
          clientesMap={clientesMap}
          produtosMap={produtosMap}
          expandido={expandido}
          setExpandido={setExpandido}
          onToggleProduzido={toggleProduzido}
          onAvancar={avancarParaEntregue}
          onMarcarPago={marcarPago}
          onVoltarEtapa={voltarParaVerde}
        />
      </div>

      {Object.keys(totaisProdutos).length > 0 && (
        <div className="fixed bottom-0 left-0 right-0 bg-amber-900 text-white px-4 py-3 flex gap-6 flex-wrap items-center shadow-lg z-30">
          <span className="text-xs uppercase tracking-widest opacity-75 w-full md:w-auto">
            Falta produzir:
          </span>
          {Object.values(totaisProdutos).map(p => (
            <div key={p.nome} className="flex items-baseline gap-2">
              <span className="text-2xl font-bold text-amber-300">{p.total}</span>
              <span className="text-sm">{p.nome}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

interface ColunaProps {
  titulo: string
  cor: 'amarelo' | 'verde' | 'azul'
  count: number
  pedidos: Pedido[]
  itensPorPedido: Record<string, PedidoItem[]>
  clientesMap: Record<string, Cliente>
  produtosMap: Record<string, Produto>
  expandido: string | null
  setExpandido: (id: string | null) => void
  onToggleProduzido: (item: PedidoItem) => void
  onAvancar: (pedido: Pedido, tipo: string, custo?: number) => void
  onMarcarPago: (pedido: Pedido, forma: string, data: string) => void
  onVoltarEtapa: ((pedido: Pedido) => void) | null
}

function Coluna({ titulo, cor, count, pedidos, itensPorPedido, clientesMap, produtosMap, expandido, setExpandido, onToggleProduzido, onAvancar, onMarcarPago, onVoltarEtapa }: ColunaProps) {
  const cores = {
    amarelo: { bolinha: 'bg-amber-400', header: 'text-amber-700' },
    verde: { bolinha: 'bg-green-500', header: 'text-green-700' },
    azul: { bolinha: 'bg-blue-500', header: 'text-blue-700' },
  }

  return (
    <div className="flex-1 min-w-[300px] max-w-[380px]">
      <div className="flex items-center gap-2 mb-3 px-1">
        <div className={`w-3 h-3 rounded-sm ${cores[cor].bolinha}`} />
        <h2 className={`text-sm font-bold uppercase tracking-wide ${cores[cor].header}`}>{titulo}</h2>
        <span className="ml-auto text-xs text-gray-400">{count}</span>
      </div>

      {pedidos.length === 0 && (
        <div className="border-2 border-dashed border-gray-200 rounded-xl p-6 text-center text-gray-400 text-sm">
          Nenhum pedido aqui
        </div>
      )}

      {pedidos.map(pedido => (
        <Cartao
          key={pedido.id}
          pedido={pedido}
          cor={cor}
          itens={itensPorPedido[pedido.id] ?? []}
          cliente={clientesMap[pedido.cliente_id]}
          produtosMap={produtosMap}
          expandido={expandido === pedido.id}
          onToggle={() => setExpandido(expandido === pedido.id ? null : pedido.id)}
          onToggleProduzido={onToggleProduzido}
          onAvancar={onAvancar}
          onMarcarPago={onMarcarPago}
          onVoltarEtapa={onVoltarEtapa}
        />
      ))}
    </div>
  )
}

interface CartaoProps {
  pedido: Pedido
  cor: 'amarelo' | 'verde' | 'azul'
  itens: PedidoItem[]
  cliente: Cliente | undefined
  produtosMap: Record<string, Produto>
  expandido: boolean
  onToggle: () => void
  onToggleProduzido: (item: PedidoItem) => void
  onAvancar: (pedido: Pedido, tipo: string, custo?: number) => void
  onMarcarPago: (pedido: Pedido, forma: string, data: string) => void
  onVoltarEtapa: ((pedido: Pedido) => void) | null
}

function Cartao({ pedido, cor, itens, cliente, produtosMap, expandido, onToggle, onToggleProduzido, onAvancar, onMarcarPago, onVoltarEtapa }: CartaoProps) {
  const [tipoEntrega, setTipoEntrega] = useState('')
  const [custoUber, setCustoUber] = useState('')
  const [formaPagamento, setFormaPagamento] = useState('')
  const [dataPagamento, setDataPagamento] = useState(new Date().toISOString().split('T')[0])

  const bgCores = {
    amarelo: 'bg-amber-50 border-amber-200 border-l-amber-400',
    verde: 'bg-green-50 border-green-200 border-l-green-500',
    azul: 'bg-blue-50 border-blue-200 border-l-blue-500',
  }

  const voltarLabel = {
    verde: '← Voltar para A produzir',
    azul: '← Voltar para Pronto',
    amarelo: '',
  }

  return (
    <div className={`border border-l-4 rounded-xl mb-3 overflow-hidden shadow-sm ${bgCores[cor]}`}>
      <div className="p-3 cursor-pointer" onClick={onToggle}>
        <div className="flex items-center gap-2 mb-1">
          <span className="text-xs font-bold text-gray-500 font-mono">{pedido.id.slice(0, 8).toUpperCase()}</span>
          <span className="ml-auto text-xs font-bold bg-white border rounded px-2 py-0.5">{pedido.data}</span>
        </div>
        <h3 className="font-bold text-base">{cliente?.nome ?? '—'}</h3>
        <p className="text-xs text-gray-500 mt-0.5">{cliente?.codigo ?? ''}</p>
      </div>

      <div className="px-3 pb-2">
        {itens.map(item => (
          <div key={item.id} className="flex items-center gap-2 py-1.5 border-t border-dashed border-gray-200">
            <input
              type="checkbox"
              checked={item.produzido}
              onChange={() => onToggleProduzido(item)}
              className="w-5 h-5 accent-green-600"
            />
            <span className={`flex-1 text-sm ${item.produzido ? 'line-through opacity-40' : ''}`}>
              {produtosMap[item.produto_id]?.nome ?? '—'}
            </span>
            <span className={`font-bold text-sm font-mono ${item.produzido ? 'opacity-40' : ''}`}>
              {item.quantidade}
            </span>
          </div>
        ))}
      </div>

      {expandido && (
        <div className="px-3 pb-3 border-t border-gray-200 pt-3 flex flex-col gap-3">

          {/* Voltar etapa */}
          {onVoltarEtapa && (
            <button
              onClick={() => onVoltarEtapa(pedido)}
              className="w-full text-xs text-gray-500 border border-gray-300 rounded-lg py-2 hover:bg-gray-50 transition-colors"
            >
              {voltarLabel[cor]}
            </button>
          )}

          {/* Entrega */}
          {cor !== 'azul' && (
            <div>
              <p className="text-xs font-bold uppercase tracking-wide text-gray-500 mb-2">Entrega</p>
              <div className="flex flex-wrap gap-2">
                {['Entrega Raízes', 'Uber', 'Retirado na distribuidora'].map(tipo => (
                  <button
                    key={tipo}
                    onClick={() => setTipoEntrega(tipo)}
                    className={`text-xs px-3 py-1.5 rounded-lg border transition-colors ${
                      tipoEntrega === tipo
                        ? 'bg-green-600 text-white border-green-600'
                        : 'bg-white border-gray-300 text-gray-600'
                    }`}
                  >
                    {tipo}
                  </button>
                ))}
              </div>
              {tipoEntrega === 'Uber' && (
                <input
                  type="number"
                  step="0.01"
                  value={custoUber}
                  onChange={e => setCustoUber(e.target.value)}
                  placeholder="Valor do Uber"
                  className="mt-2 w-full border rounded-lg p-2 text-sm bg-white"
                />
              )}
              {tipoEntrega && (
                <button
                  onClick={() => onAvancar(pedido, tipoEntrega, custoUber ? Number(custoUber) : undefined)}
                  className="mt-2 w-full bg-blue-600 text-white rounded-lg py-2 text-sm font-bold"
                >
                  Registrar entrega →
                </button>
              )}
            </div>
          )}

          {/* Pagamento */}
          <div>
            <p className="text-xs font-bold uppercase tracking-wide text-gray-500 mb-2">Pagamento</p>
            <div className="flex flex-wrap gap-2">
              {['Dinheiro', 'Crédito', 'Débito', 'Pix'].map(forma => (
                <button
                  key={forma}
                  onClick={() => setFormaPagamento(forma)}
                  className={`text-xs px-3 py-1.5 rounded-lg border transition-colors ${
                    formaPagamento === forma
                      ? 'bg-amber-900 text-white border-amber-900'
                      : 'bg-white border-gray-300 text-gray-600'
                  }`}
                >
                  {forma}
                </button>
              ))}
            </div>
            <input
              type="date"
              value={dataPagamento}
              onChange={e => setDataPagamento(e.target.value)}
              className="mt-2 w-full border rounded-lg p-2 text-sm bg-white"
            />
            {formaPagamento && (
              <button
                onClick={() => onMarcarPago(pedido, formaPagamento, dataPagamento)}
                className="mt-2 w-full bg-amber-900 text-white rounded-lg py-2 text-sm font-bold"
              >
                Marcar como pago ✓
              </button>
            )}
          </div>
        </div>
      )}

      <button
        onClick={onToggle}
        className="w-full text-xs text-gray-400 py-1.5 border-t border-gray-200 hover:bg-gray-50 transition-colors"
      >
        {expandido ? '▲ Fechar' : '▼ Ver detalhes'}
      </button>
    </div>
  )
}
