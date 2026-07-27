'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

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
      { label: 'Investimentos', href: '/investimentos' },
    ],
  },
]

export default function Sidebar() {
  const pathname = usePathname()

  return (
    <aside className="w-56 min-h-screen bg-gray-900 text-white flex flex-col">
      <div className="p-6 border-b border-gray-700">
        <h1 className="text-lg font-bold">CRM Raízes</h1>
        <p className="text-xs text-gray-400 mt-1">Pão de mel do Henrique</p>
      </div>

      <nav className="flex-1 p-4 flex flex-col gap-6">
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
    </aside>
  )
}
