'use client'

import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'

interface Props {
  id: string
  nome: string
}

export default function DeletarFornecedor({ id, nome }: Props) {
  const router = useRouter()

  async function handleDeletar() {
    const confirmou = confirm(`Deletar "${nome}"? Essa ação não pode ser desfeita.`)
    if (!confirmou) return

    const { error } = await supabase
      .from('fornecedores')
      .delete()
      .eq('id', id)

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
