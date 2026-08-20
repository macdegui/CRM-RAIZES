export type Cliente = {
  id: string
  nome: string
  codigo: string | null
  telefone: string | null
  email: string | null
  tag: string | null
  cep: string | null
  endereco: string | null
  nome_estabelecimento: string | null
  cnpj: string | null
  observacoes: string | null
  created_at: string
  updated_at: string
}

export type Produto = {
  id: string
  nome: string
  preco_venda: number
  ativo: boolean
  created_at: string
  updated_at: string
}

export type Ingrediente = {
  id: string
  nome: string
  unidade: string
  estoque_minimo: number | null
  ativo: boolean
  created_at: string
  updated_at: string
}

export type Fornecedor = {
  id: string
  nome: string
  contato: string | null
  documento: string | null
  created_at: string
  updated_at: string
}

export type CategoriaGasto = {
  id: string
  nome: string
}

export type Gasto = {
  id: string
  descricao: string
  categoria_id: string
  valor: number
  data: string
  recorrente: boolean
  created_at: string
}

export type Investimento = {
  id: string
  descricao: string
  valor: number
  data: string
  created_at: string
}

export type Receita = {
  id: string
  produto_id: string
  nome: string
  rendimento: number
  ativa: boolean
  created_at: string
  updated_at: string
}

export type ReceitaIngrediente = {
  id: string
  receita_id: string
  ingrediente_id: string
  quantidade: number
}

export type Lote = {
  id: string
  data: string
  status: 'ABERTO' | 'EM_PRODUCAO' | 'FINALIZADO'
  custo_total: number | null
  created_at: string
}

export type LoteReceita = {
  id: string
  lote_id: string
  receita_id: string
  quantidade_produzida: number
  custo_parcial: number | null
}

export type Compra = {
  id: string
  fornecedor_id: string
  data: string
  valor_total: number | null
  observacao: string | null
  created_at: string
}

export type CompraItem = {
  id: string
  compra_id: string
  ingrediente_id: string
  quantidade: number
  valor_unitario: number
}

export type Pedido = {
  id: string
  codigo: string | null
  cliente_id: string
  status: 'PENDENTE' | 'EM_PRODUCAO' | 'ENTREGUE' | 'PAGO'
  data: string
  observacao: string | null
  total: number | null
  forma_pagamento: string | null
  data_pagamento: string | null
  tipo_entrega: string | null
  custo_uber: number | null
  created_at: string
  updated_at: string
}

export type PedidoItem = {
  id: string
  pedido_id: string
  produto_id: string
  quantidade: number
  preco_unitario: number
  produzido: boolean
}

export type Entrega = {
  id: string
  pedido_id: string
  cliente_id: string
  tipo: 'RETIRADA' | 'MOTOBOY' | 'APP' | 'TRANSPORTADORA' | null
  status: 'PENDENTE' | 'EM_TRANSITO' | 'ENTREGUE'
  data_prevista: string | null
  data_entrega: string | null
  endereco: string | null
  custo: number | null
  observacao: string | null
}
