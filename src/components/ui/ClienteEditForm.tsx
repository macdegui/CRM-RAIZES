'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { Cliente } from '@/types'

interface Props {
  cliente: Cliente
  tagsExistentes: string[]
}

export default function ClienteEditForm({ cliente, tagsExistentes }: Props) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [buscandoCep, setBuscandoCep] = useState(false)
  const [gerenciarTags, setGerenciarTags] = useState(false)
  const [novaTag, setNovaTag] = useState('')
  const [tagsSelecionadas, setTagsSelecionadas] = useState<string[]>(
    cliente.tag ? cliente.tag.split(',').map(t => t.trim()).filter(Boolean) : []
  )
  const [erros, setErros] = useState<Record<string, string>>({})
  const [form, setForm] = useState({
    nome: cliente.nome ?? '',
    telefone: cliente.telefone ?? '',
    email: cliente.email ?? '',
    cep: cliente.cep ?? '',
    endereco: cliente.endereco ?? '',
    nome_estabelecimento: cliente.nome_estabelecimento ?? '',
    cnpj: cliente.cnpj ?? '',
    observacoes: cliente.observacoes ?? '',
  })

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  async function buscarCEP() {
    const cep = form.cep.replace(/\D/g, '')
    if (cep.length !== 8) return
    setBuscandoCep(true)
    try {
      const res = await fetch(`https://viacep.com.br/ws/${cep}/json/`)
      const data = await res.json()
      if (!data.erro) {
        setForm(f => ({
          ...f,
          endereco: `${data.logradouro}, ${data.bairro}, ${data.localidade} - ${data.uf}`
        }))
      }
    } catch {}
    setBuscandoCep(false)
  }

  function adicionarTag(tag: string) {
    const t = tag.trim()
    if (!t || tagsSelecionadas.includes(t)) return
    setTagsSelecionadas([...tagsSelecionadas, t])
    setNovaTag('')
  }

  function removerTag(tag: string) {
    setTagsSelecionadas(tagsSelecionadas.filter(t => t !== tag))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setErros({})

    if (!form.nome) {
      setErros({ nome: 'Nome é obrigatório' })
      return
    }
    if (!form.telefone) {
      setErros({ telefone: 'Telefone é obrigatório' })
      return
    }

    setLoading(true)
    const { error } = await supabase
      .from('clientes')
      .update({ ...form, tag: tagsSelecionadas.join(',') || null })
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
    <form onSubmit={handleSubmit} className="flex flex-col gap-5 max-w-lg">

      {/* Código gerado automaticamente */}
      {cliente.codigo && (
        <div className="bg-gray-50 border rounded-lg p-3 text-sm text-gray-500">
          Código: <span className="font-bold text-gray-900">{cliente.codigo}</span>
          <span className="ml-2 text-xs">· cadastrado em {new Date(cliente.created_at).toLocaleDateString('pt-BR')}</span>
        </div>
      )}

      <div>
        <label className="block text-sm font-medium mb-1">Nome *</label>
        <input
          name="nome"
          value={form.nome}
          onChange={handleChange}
          className="w-full border rounded-lg p-2.5 bg-white text-gray-900"
        />
        {erros.nome && <p className="text-red-500 text-sm mt-1">{erros.nome}</p>}
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-sm font-medium mb-1">Telefone *</label>
          <input
            name="telefone"
            value={form.telefone}
            onChange={handleChange}
            className="w-full border rounded-lg p-2.5 bg-white text-gray-900"
          />
          {erros.telefone && <p className="text-red-500 text-sm mt-1">{erros.telefone}</p>}
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Email</label>
          <input
            name="email"
            type="email"
            value={form.email}
            onChange={handleChange}
            className="w-full border rounded-lg p-2.5 bg-white text-gray-900"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">CEP</label>
        <div className="flex gap-2">
          <input
            name="cep"
            value={form.cep}
            onChange={handleChange}
            className="w-36 border rounded-lg p-2.5 bg-white text-gray-900"
            maxLength={9}
          />
          <button
            type="button"
            onClick={buscarCEP}
            disabled={buscandoCep}
            className="px-4 py-2 bg-gray-100 border rounded-lg text-sm hover:bg-gray-200 disabled:opacity-50"
          >
            {buscandoCep ? 'Buscando...' : 'Buscar'}
          </button>
        </div>
        <input
          name="endereco"
          value={form.endereco}
          onChange={handleChange}
          className="w-full border rounded-lg p-2.5 bg-white text-gray-900 mt-2"
          placeholder="Endereço completo"
        />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-sm font-medium mb-1">Estabelecimento</label>
          <input
            name="nome_estabelecimento"
            value={form.nome_estabelecimento}
            onChange={handleChange}
            className="w-full border rounded-lg p-2.5 bg-white text-gray-900"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">CNPJ</label>
          <input
            name="cnpj"
            value={form.cnpj}
            onChange={handleChange}
            className="w-full border rounded-lg p-2.5 bg-white text-gray-900"
          />
        </div>
      </div>

      <div>
        <div className="flex justify-between items-center mb-1">
          <label className="block text-sm font-medium">Tags</label>
          <button
            type="button"
            onClick={() => setGerenciarTags(!gerenciarTags)}
            className="text-xs text-blue-600 hover:underline"
          >
            Gerenciar tags
          </button>
        </div>
        <div className="flex flex-wrap gap-2 mb-2">
          {tagsSelecionadas.map(tag => (
            <span key={tag} className="flex items-center gap-1 bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
              {tag}
              <button type="button" onClick={() => removerTag(tag)} className="hover:text-red-500">×</button>
            </span>
          ))}
        </div>
        {gerenciarTags && (
          <div className="border rounded-lg p-3 bg-gray-50">
            <p className="text-xs text-gray-500 mb-2">Tags disponíveis:</p>
            <div className="flex flex-wrap gap-2 mb-3">
              {tagsExistentes.filter(t => !tagsSelecionadas.includes(t)).map(tag => (
                <button
                  key={tag}
                  type="button"
                  onClick={() => adicionarTag(tag)}
                  className="text-xs bg-white border border-gray-300 px-2 py-1 rounded-full hover:border-blue-400 hover:text-blue-600"
                >
                  + {tag}
                </button>
              ))}
            </div>
            <div className="flex gap-2">
              <input
                value={novaTag}
                onChange={e => setNovaTag(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), adicionarTag(novaTag))}
                className="flex-1 border rounded-lg p-2 text-sm bg-white"
                placeholder="Nova tag..."
              />
              <button
                type="button"
                onClick={() => adicionarTag(novaTag)}
                className="px-3 py-2 bg-blue-600 text-white rounded-lg text-sm"
              >
                Adicionar
              </button>
            </div>
          </div>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Observações</label>
        <textarea
          name="observacoes"
          value={form.observacoes}
          onChange={handleChange}
          className="w-full border rounded-lg p-2.5 bg-white text-gray-900"
          rows={3}
        />
      </div>

      <div className="flex gap-2">
        <button
          type="submit"
          disabled={loading}
          className="bg-blue-600 text-white rounded-lg p-3 font-medium hover:bg-blue-700 disabled:opacity-50 flex-1"
        >
          {loading ? 'Salvando...' : 'Salvar alterações'}
        </button>
        <button
          type="button"
          onClick={() => router.push('/clientes')}
          className="border rounded-lg p-3 hover:bg-gray-50"
        >
          Cancelar
        </button>
      </div>
    </form>
  )
}
