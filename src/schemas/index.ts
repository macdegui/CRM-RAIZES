import { z } from 'zod'

export const clienteSchema = z.object({
  nome: z.string().min(1, 'Nome é obrigatório'),
  codigo: z.string().optional(),
  tag: z.string().optional(),
  contato: z.string().optional(),
})

export type ClienteForm = z.infer<typeof clienteSchema>