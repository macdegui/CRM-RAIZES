'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import LogoutButton from '@/components/ui/LogoutButton'

const menus = [
  {
    grupo: 'Vendas',
    itens: [
      { label: 'Clientes', href: '/clientes' },
      { label: 'Pedidos', href: '/pedidos' },
      { label: 'Entregas', href: '/entregas' },
    ],
  },
  {
    grupo: 'Produção',
    itens: [
      { label: 'Produtos', href: '/produtos' },
      { label: 'Receitas', href: '/receitas' },
      { label: 'Lotes', href: '/lotes' },
      { label: 'Ingredientes', href: '/ingredientes' },
    ],
  },
  {
    grupo: 'Compras',
    itens: [
      { label: 'Fornecedores', href: '/fornecedores' },
      { label: 'Compras', href: '/compras' },
    ],
  },
  {
    grupo: 'Financeiro',
    itens: [
      { label: 'Gastos', href: '/gastos' },
      { label: 'Categorias', href: '/categorias-gastos' },
      { label: 'Investimentos', href: '/investimentos' },
    ],
  },
]

export default function Sidebar() {
  const pathname = usePathname()
  const [aberta, setAberta] = useState(false)

  return (
    <>
      {/* Botão hambúrguer — só aparece no mobile */}
      <button
        onClick={() => setAberta(true)}
        className="md:hidden fixed top-4 left-4 z-50 bg-gray-900 text-white p-2 rounded-lg shadow-lg"
      >
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
          <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
        </svg>
      </button>

      {/* Overlay escuro atrás da sidebar no mobile */}
      {aberta && (
        <div
          className="md:hidden fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={() => setAberta(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed md:relative z-50 md:z-auto
        w-56 min-h-screen bg-gray-900 text-white flex flex-col
        transition-transform duration-300
        ${aberta ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
      `}>
        <div className="p-6 border-b border-gray-700 flex justify-between items-center">
          <div>
            <h1 className="text-lg font-bold">CRM Raízes</h1>
            <p className="text-xs text-gray-400 mt-1">Pão de mel do Henrique</p>
          </div>
          {/* Botão fechar — só no mobile */}
          <button
            onClick={() => setAberta(false)}
            className="md:hidden text-gray-400 hover:text-white"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <nav className="flex-1 p-4 flex flex-col gap-6 overflow-y-auto">
          {menus.map((menu) => (
            <div key={menu.grupo}>
              <p className="text-xs text-gray-400 uppercase tracking-wider mb-2">
                {menu.grupo}
              </p>
              <ul className="flex flex-col gap-1">
                {menu.itens.map((item) => {
                  const ativo = pathname.startsWith(item.href)
                  return (
                    <li key={item.href}>
                      <Link
                        href={item.href}
                        onClick={() => setAberta(false)}
                        className={`block px-3 py-2 rounded text-sm transition-colors ${
                          ativo
                            ? 'bg-blue-600 text-white'
                            : 'text-gray-300 hover:bg-gray-700'
                        }`}
                      >
                        {item.label}
                      </Link>
                    </li>
                  )
                })}
              </ul>
            </div>
          ))}
        </nav>

        <div className="p-4 border-t border-gray-700">
          <LogoutButton />
        </div>
      </aside>
    </>
  )
}
