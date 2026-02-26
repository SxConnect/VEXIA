'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function NovoQuestionarioPage() {
    const router = useRouter()
    const [titulo, setTitulo] = useState('')
    const [descricao, setDescricao] = useState('')
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        setError('')

        try {
            const res = await fetch('/api/questionarios', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ titulo, descricao, status: 'ativo' }),
            })

            const data = await res.json()

            if (!res.ok) {
                throw new Error(data.error || 'Erro ao criar questionário')
            }

            router.push(`/dashboard/questionarios/${data.id}`)
        } catch (err: any) {
            setError(err.message)
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="max-w-2xl">
            <h1 className="text-3xl font-bold text-gray-900 mb-8">
                Novo Questionário
            </h1>

            {error && (
                <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg">
                    {error}
                </div>
            )}

            <form onSubmit={handleSubmit} className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 space-y-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Título
                    </label>
                    <input
                        type="text"
                        value={titulo}
                        onChange={(e) => setTitulo(e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                        required
                        minLength={3}
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Descrição (opcional)
                    </label>
                    <textarea
                        value={descricao}
                        onChange={(e) => setDescricao(e.target.value)}
                        rows={4}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    />
                </div>

                <div className="flex space-x-3">
                    <button
                        type="submit"
                        disabled={loading}
                        className="px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition disabled:opacity-50"
                    >
                        {loading ? 'Criando...' : 'Criar Questionário'}
                    </button>
                    <button
                        type="button"
                        onClick={() => router.back()}
                        className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition"
                    >
                        Cancelar
                    </button>
                </div>
            </form>
        </div>
    )
}
