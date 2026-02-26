'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function RegisterPage() {
    const router = useRouter()
    const [nome, setNome] = useState('')
    const [whatsapp, setWhatsapp] = useState('')
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        setError('')

        try {
            const res = await fetch('/api/auth/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ nome, whatsapp }),
            })

            const data = await res.json()

            if (!res.ok) {
                throw new Error(data.error || 'Erro ao cadastrar')
            }

            router.push('/auth/login?registered=true')
        } catch (err: any) {
            setError(err.message)
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
            <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md">
                <div className="text-center mb-6">
                    <h1 className="text-2xl font-bold text-gray-900 mb-1">
                        VEXIA
                    </h1>
                    <p className="text-xs text-gray-500 mb-4">
                        Validation Experience eXecution Intelligence Automation
                    </p>
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
                    Criar Conta
                </h2>

                {error && (
                    <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Nome Completo
                        </label>
                        <input
                            type="text"
                            value={nome}
                            onChange={(e) => setNome(e.target.value)}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                            required
                            minLength={3}
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            WhatsApp (formato internacional)
                        </label>
                        <input
                            type="tel"
                            value={whatsapp}
                            onChange={(e) => setWhatsapp(e.target.value)}
                            placeholder="+5511999999999"
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition disabled:opacity-50"
                    >
                        {loading ? 'Cadastrando...' : 'Cadastrar'}
                    </button>
                </form>

                <p className="mt-4 text-center text-sm text-gray-600">
                    Já tem conta?{' '}
                    <Link href="/auth/login" className="text-primary-600 hover:underline">
                        Entrar
                    </Link>
                </p>
            </div>
        </div>
    )
}
