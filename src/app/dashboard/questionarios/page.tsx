'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'

export default function QuestionariosPage() {
    const [questionarios, setQuestionarios] = useState<any[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        fetchQuestionarios()
    }, [])

    const fetchQuestionarios = async () => {
        try {
            const res = await fetch('/api/questionarios')
            const data = await res.json()
            setQuestionarios(data)
        } catch (error) {
            console.error('Erro ao buscar questionários:', error)
        } finally {
            setLoading(false)
        }
    }

    const handleDelete = async (id: string) => {
        if (!confirm('Tem certeza que deseja excluir este questionário?')) return

        try {
            await fetch(`/api/questionarios/${id}`, { method: 'DELETE' })
            fetchQuestionarios()
        } catch (error) {
            console.error('Erro ao deletar:', error)
        }
    }

    if (loading) {
        return <div className="text-center py-12">Carregando...</div>
    }

    return (
        <div>
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-bold text-gray-900">Questionários</h1>
                <Link
                    href="/dashboard/questionarios/novo"
                    className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition"
                >
                    + Novo Questionário
                </Link>
            </div>

            {questionarios.length === 0 ? (
                <div className="bg-white p-12 rounded-xl shadow-sm border border-gray-200 text-center">
                    <p className="text-gray-600 mb-4">Nenhum questionário criado ainda</p>
                    <Link
                        href="/dashboard/questionarios/novo"
                        className="inline-block px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition"
                    >
                        Criar Primeiro Questionário
                    </Link>
                </div>
            ) : (
                <div className="grid gap-4">
                    {questionarios.map((q) => (
                        <div
                            key={q.id}
                            className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition"
                        >
                            <div className="flex justify-between items-start">
                                <div className="flex-1">
                                    <h3 className="text-xl font-semibold text-gray-900 mb-2">
                                        {q.titulo}
                                    </h3>
                                    {q.descricao && (
                                        <p className="text-gray-600 mb-3">{q.descricao}</p>
                                    )}
                                    <div className="flex items-center space-x-4 text-sm text-gray-500">
                                        <span>📝 {q.perguntas?.length || 0} perguntas</span>
                                        <span>💬 {q._count?.respondentes || 0} respostas</span>
                                        <span
                                            className={`px-2 py-1 rounded ${q.status === 'ativo'
                                                    ? 'bg-green-100 text-green-700'
                                                    : 'bg-gray-100 text-gray-700'
                                                }`}
                                        >
                                            {q.status}
                                        </span>
                                    </div>
                                </div>
                                <div className="flex space-x-2">
                                    <Link
                                        href={`/dashboard/questionarios/${q.id}`}
                                        className="px-3 py-2 text-sm bg-gray-100 text-gray-700 rounded hover:bg-gray-200 transition"
                                    >
                                        Editar
                                    </Link>
                                    <Link
                                        href={`/dashboard/respostas/${q.id}`}
                                        className="px-3 py-2 text-sm bg-primary-100 text-primary-700 rounded hover:bg-primary-200 transition"
                                    >
                                        Ver Respostas
                                    </Link>
                                    <button
                                        onClick={() => handleDelete(q.id)}
                                        className="px-3 py-2 text-sm bg-red-100 text-red-700 rounded hover:bg-red-200 transition"
                                    >
                                        Excluir
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}
