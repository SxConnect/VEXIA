'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'

export default function RespostasPage() {
    const [questionarios, setQuestionarios] = useState<any[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        fetchQuestionarios()
    }, [])

    const fetchQuestionarios = async () => {
        try {
            const res = await fetch('/api/questionarios')
            if (res.ok) {
                const data = await res.json()
                setQuestionarios(data)
            }
        } catch (error) {
            console.error('Erro ao carregar questionários:', error)
        } finally {
            setLoading(false)
        }
    }

    if (loading) {
        return <div className="text-center py-12">Carregando...</div>
    }

    return (
        <div className="max-w-6xl">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900">Respostas</h1>
                <p className="text-gray-600 mt-2">
                    Visualize as respostas coletadas dos seus questionários
                </p>
            </div>

            {questionarios.length === 0 ? (
                <div className="bg-white p-12 rounded-xl shadow-sm border border-gray-200 text-center">
                    <div className="text-6xl mb-4">📋</div>
                    <h2 className="text-xl font-semibold text-gray-900 mb-2">
                        Nenhum questionário encontrado
                    </h2>
                    <p className="text-gray-600 mb-6">
                        Crie um questionário primeiro para começar a coletar respostas
                    </p>
                    <Link
                        href="/dashboard/questionarios/novo"
                        className="inline-block px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition"
                    >
                        Criar Questionário
                    </Link>
                </div>
            ) : (
                <div className="grid gap-6">
                    {questionarios.map((questionario) => (
                        <div
                            key={questionario.id}
                            className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition"
                        >
                            <div className="flex justify-between items-start">
                                <div className="flex-1">
                                    <h3 className="text-xl font-semibold text-gray-900 mb-2">
                                        {questionario.titulo}
                                    </h3>
                                    {questionario.descricao && (
                                        <p className="text-gray-600 mb-4">
                                            {questionario.descricao}
                                        </p>
                                    )}
                                    <div className="flex items-center space-x-4 text-sm text-gray-500">
                                        <span>
                                            📊 {questionario._count?.respondentes || 0} respostas
                                        </span>
                                        <span>
                                            ❓ {questionario.perguntas?.length || 0} perguntas
                                        </span>
                                        <span className={`px-2 py-1 rounded text-xs ${questionario.status === 'ativo'
                                                ? 'bg-green-100 text-green-700'
                                                : 'bg-gray-100 text-gray-700'
                                            }`}>
                                            {questionario.status === 'ativo' ? 'Ativo' : 'Inativo'}
                                        </span>
                                    </div>
                                </div>
                                <Link
                                    href={`/dashboard/respostas/${questionario.id}`}
                                    className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition"
                                >
                                    Ver Respostas
                                </Link>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}
