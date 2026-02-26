'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'

export default function DashboardPage() {
    const [stats, setStats] = useState({
        totalQuestionarios: 0,
        totalRespostas: 0,
    })

    useEffect(() => {
        fetchStats()
    }, [])

    const fetchStats = async () => {
        try {
            const res = await fetch('/api/questionarios')
            const questionarios = await res.json()

            const totalRespostas = questionarios.reduce(
                (acc: number, q: any) => acc + (q._count?.respondentes || 0),
                0
            )

            setStats({
                totalQuestionarios: questionarios.length,
                totalRespostas,
            })
        } catch (error) {
            console.error('Erro ao buscar estatísticas:', error)
        }
    }

    return (
        <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-8">Dashboard</h1>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-600 mb-1">Questionários</p>
                            <p className="text-3xl font-bold text-gray-900">
                                {stats.totalQuestionarios}
                            </p>
                        </div>
                        <div className="text-4xl">📝</div>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-600 mb-1">Respostas</p>
                            <p className="text-3xl font-bold text-gray-900">
                                {stats.totalRespostas}
                            </p>
                        </div>
                        <div className="text-4xl">💬</div>
                    </div>
                </div>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">
                    Ações Rápidas
                </h2>
                <div className="space-y-3">
                    <Link
                        href="/dashboard/questionarios/novo"
                        className="block px-4 py-3 bg-primary-50 text-primary-700 rounded-lg hover:bg-primary-100 transition"
                    >
                        ➕ Criar Novo Questionário
                    </Link>
                    <Link
                        href="/dashboard/questionarios"
                        className="block px-4 py-3 bg-gray-50 text-gray-700 rounded-lg hover:bg-gray-100 transition"
                    >
                        📋 Ver Todos os Questionários
                    </Link>
                </div>
            </div>
        </div>
    )
}
