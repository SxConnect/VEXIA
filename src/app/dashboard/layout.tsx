'use client'

import { useRouter, usePathname } from 'next/navigation'
import Link from 'next/link'
import { useState } from 'react'

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode
}) {
    const router = useRouter()
    const pathname = usePathname()
    const [menuAberto, setMenuAberto] = useState(false)

    const handleLogout = async () => {
        await fetch('/api/auth/logout', { method: 'POST' })
        router.push('/auth/login')
    }

    const menuItems = [
        { href: '/dashboard', label: 'Dashboard', icon: '📊' },
        { href: '/dashboard/questionarios', label: 'Questionários', icon: '📝' },
        { href: '/dashboard/respostas', label: 'Respostas', icon: '💬' },
        { href: '/dashboard/configuracoes', label: 'Configurações', icon: '⚙️' },
    ]

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Mobile Header */}
            <div className="lg:hidden bg-white border-b border-gray-200 p-4 flex justify-between items-center fixed top-0 left-0 right-0 z-40">
                <div>
                    <h1 className="text-lg font-bold text-gray-900">VEXIA</h1>
                    <p className="text-xs text-gray-500">Validation Experience</p>
                </div>
                <button onClick={() => setMenuAberto(!menuAberto)} className="text-2xl">
                    {menuAberto ? '✕' : '☰'}
                </button>
            </div>

            {/* Sidebar Desktop */}
            <aside className="hidden lg:block w-64 bg-white border-r border-gray-200 fixed h-full">
                <div className="p-6 border-b border-gray-200">
                    <h1 className="text-xl font-bold text-gray-900">VEXIA</h1>
                    <p className="text-xs text-gray-500 mt-1">Validation Experience</p>
                </div>

                <nav className="p-4 space-y-1">
                    {menuItems.map((item) => (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition ${pathname === item.href
                                ? 'bg-primary-50 text-primary-700'
                                : 'text-gray-700 hover:bg-gray-100'
                                }`}
                        >
                            <span className="text-xl">{item.icon}</span>
                            <span className="font-medium">{item.label}</span>
                        </Link>
                    ))}
                </nav>

                <div className="absolute bottom-0 w-64 p-4 border-t border-gray-200">
                    <button
                        onClick={handleLogout}
                        className="w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg transition"
                    >
                        Sair
                    </button>
                </div>
            </aside>

            {/* Sidebar Mobile */}
            {menuAberto && (
                <div className="lg:hidden fixed inset-0 z-50 bg-black bg-opacity-50" onClick={() => setMenuAberto(false)}>
                    <aside className="w-64 bg-white h-full" onClick={(e) => e.stopPropagation()}>
                        <div className="p-6 border-b border-gray-200">
                            <h1 className="text-xl font-bold text-gray-900">VEXIA</h1>
                            <p className="text-xs text-gray-500 mt-1">Validation Experience</p>
                        </div>

                        <nav className="p-4 space-y-1">
                            {menuItems.map((item) => (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    onClick={() => setMenuAberto(false)}
                                    className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition ${pathname === item.href
                                        ? 'bg-primary-50 text-primary-700'
                                        : 'text-gray-700 hover:bg-gray-100'
                                        }`}
                                >
                                    <span className="text-xl">{item.icon}</span>
                                    <span className="font-medium">{item.label}</span>
                                </Link>
                            ))}
                        </nav>

                        <div className="absolute bottom-0 w-64 p-4 border-t border-gray-200">
                            <button
                                onClick={handleLogout}
                                className="w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg transition"
                            >
                                Sair
                            </button>
                        </div>
                    </aside>
                </div>
            )}

            {/* Main Content */}
            <main className="lg:ml-64 pt-20 lg:pt-0 p-4 sm:p-6 lg:p-8">
                {children}
            </main>
        </div>
    )
}
