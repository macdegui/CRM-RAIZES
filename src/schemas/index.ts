import { z } from 'zod'

// Clientes
export const clienteSchema = z.object({
  nome: z.string().min(1, 'Nome é obrigatório'),
  codigo: z.string().optional(),
  tag: z.string().optional(),
  contato: z.string().optional(),
})
export type ClienteForm = z.infer<typeof clienteSchema>

// Produtos
export const produtoSchema = z.object({
  nome: z.string().min(1, 'Nome é obrigatório'),
  preco_venda: z.coerce.number().positive('Preço deve ser maior que zero'),
  ativo: z.boolean().default(true),
})
export type ProdutoForm = z.infer<typeof produtoSchema>

// Ingredientes
export const ingredienteSchema = z.object({
  nome: z.string().min(1, 'Nome é obrigatório'),
  unidade: z.string().min(1, 'Unidade é obrigatória'),
  estoque_minimo: z.coerce.number().optional(),
  ativo: z.boolean().default(true),
})
export type IngredienteForm = z.infer<typeof ingredienteSchema>

// Fornecedores
export const fornecedorSchema = z.object({
  nome: z.string().min(1, 'Nome é obrigatório'),
  contato: z.string().optional(),
  documento: z.string().optional(),
})
export type FornecedorForm = z.infer<typeof fornecedorSchema>

// Categorias de gastos
export const categoriaGastoSchema = z.object({
  nome: z.string().min(1, 'Nome é obrigatório'),
})
export type CategoriaGastoForm = z.infer<typeof categoriaGastoSchema>

// Gastos
export const gastoSchema = z.object({
  descricao: z.string().min(1, 'Descrição é obrigatória'),
  categoria_id: z.string().uuid('Categoria inválida'),
  valor: z.coerce.number().positive('Valor deve ser maior que zero'),
  data: z.string().min(1, 'Data é obrigatória'),
  recorrente: z.boolean().default(false),
})
export type GastoForm = z.infer<typeof gastoSchema>

// Investimentos
export const investimentoSchema = z.object({
  descricao: z.string().min(1, 'Descrição é obrigatória'),
  valor: z.coerce.number().positive('Valor deve ser maior que zero'),
  data: z.string().min(1, 'Data é obrigatória'),
})
export type InvestimentoForm = z.infer<typeof investimentoSchema>

// Receitas
export const receitaSchema = z.object({
  produto_id: z.string().uuid('Produto inválido'),
  nome: z.string().min(1, 'Nome é obrigatório'),
  rendimento: z.coerce.number().positive('Rendimento deve ser maior que zero'),
  ativa: z.boolean().default(true),
})
export type ReceitaForm = z.infer<typeof receitaSchema>

// Receita ingredientes
export const receitaIngredienteSchema = z.object({
  receita_id: z.string().uuid('Receita inválida'),
  ingrediente_id: z.string().uuid('Ingrediente inválido'),
  quantidade: z.coerce.number().positive('Quantidade deve ser maior que zero'),
})
export type ReceitaIngredienteForm = z.infer<typeof receitaIngredienteSchema>

// Lotes
export const loteSchema = z.object({
  data: z.string().min(1, 'Data é obrigatória'),
  status: z.enum(['ABERTO', 'EM_PRODUCAO', 'FINALIZADO']),
})
export type LoteForm = z.infer<typeof loteSchema>

// Lote receitas
export const loteReceitaSchema = z.object({
  lote_id: z.string().uuid('Lote inválido'),
  receita_id: z.string().uuid('Receita inválida'),
  quantidade_produzida: z.coerce.number().positive('Quantidade deve ser maior que zero'),
  custo_parcial: z.coerce.number().optional(),
})
export type LoteReceitaForm = z.infer<typeof loteReceitaSchema>

// Compras
export const compraSchema = z.object({
  fornecedor_id: z.string().uuid('Fornecedor inválido'),
  data: z.string().min(1, 'Data é obrigatória'),
  observacao: z.string().optional(),
})
export type CompraForm = z.infer<typeof compraSchema>

// Compra itens
export const compraItemSchema = z.object({
  compra_id: z.string().uuid('Compra inválida'),
  ingrediente_id: z.string().uuid('Ingrediente inválido'),
  quantidade: z.coerce.number().positive('Quantidade deve ser maior que zero'),
  valor_unitario: z.coerce.number().positive('Valor deve ser maior que zero'),
})
export type CompraItemForm = z.infer<typeof compraItemSchema>

// Pedidos
export const pedidoSchema = z.object({
  cliente_id: z.string().uuid('Cliente inválido'),
  status: z.enum(['PENDENTE', 'EM_PRODUCAO', 'ENTREGUE', 'PAGO']),
  data: z.string().min(1, 'Data é obrigatória'),
  observacao: z.string().optional(),
})
export type PedidoForm = z.infer<typeof pedidoSchema>

// Pedido itens
export const pedidoItemSchema = z.object({
  pedido_id: z.string().uuid('Pedido inválido'),
  produto_id: z.string().uuid('Produto inválido'),
  quantidade: z.coerce.number().positive('Quantidade deve ser maior que zero'),
  preco_unitario: z.coerce.number().positive('Preço deve ser maior que zero'),
})
export type PedidoItemForm = z.infer<typeof pedidoItemSchema>

// Entregas
export const entregaSchema = z.object({
  pedido_id: z.string().uuid('Pedido inválido'),
  cliente_id: z.string().uuid('Cliente inválido'),
  tipo: z.enum(['RETIRADA', 'MOTOBOY', 'APP', 'TRANSPORTADORA']).optional(),
  status: z.enum(['PENDENTE', 'EM_TRANSITO', 'ENTREGUE']),
  data_prevista: z.string().optional(),
  data_entrega: z.string().optional(),
  endereco: z.string().optional(),
  custo: z.coerce.number().optional(),
  observacao: z.string().optional(),
})
export type EntregaForm = z.infer<typeof entregaSchema>