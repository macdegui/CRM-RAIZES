'use client'

import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'

interface Props {
  id: string
}

export default function DeletarCompra({ id }: Props) {
  const router = useRouter()

  async function handleDeletar() {
    const confirmou = confirm('Deletar esta compra e todos os seus itens? Essa ação não pode ser desfeita.')
    if (!confirmou) return

    await supabase.from('compra_itens').delete().eq('compra_id', id)
    const { error } = await supabase.from('compras').delete().eq('id', id)

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
