'use client'

import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'

interface Props {
  id: string
}

export default function DeletarPedido({ id }: Props) {
  const router = useRouter()

  async function handleDeletar() {
    const confirmou = confirm('Deletar este pedido e todos os seus itens? Essa ação não pode ser desfeita.')
    if (!confirmou) return

    await supabase.from('pedido_itens').delete().eq('pedido_id', id)
    const { error } = await supabase.from('pedidos').delete().eq('id', id)

    if (error) {
      alert('Erro ao deletar: ' + error.message)
      return
    }

    router.refresh()
  }

  return (
    <button
      onClick={handleDeletar}
      className="text-red-500 hover:underline text-sm"
    >
      Deletar
    </button>
  )
}
