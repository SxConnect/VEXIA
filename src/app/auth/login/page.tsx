'use client'

import { useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'

export default function LoginPage() {
    const router = useRouter()
    const searchParams = useSearchParams()
    const [whatsapp, setWhatsapp] = useState('')
    const [code, setCode] = useState('')
    const [step, setStep] = useState<'phone' | 'code'>('phone')
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')

    const handleRequestCode = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        setError('')

        try {
            const res = await fetch('/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ whatsapp }),
            })

            const data = await res.json()

            if (!res.ok) {
                throw new Error(data.error || 'Erro ao solicitar código')
            }

            setStep('code')
        } catch (err: any) {
            setError(err.message)
        } finally {
            setLoading(false)
        }
    }

    const handleVerifyCode = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        setError('')

        try {
            const res = await fetch('/api/auth/verify', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ whatsapp, code }),
            })

            const data = await res.json()

            if (!res.ok) {
                throw new Error(data.error || 'Código inválido')
            }

            router.push('/dashboard')
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
                    Entrar
                </h2>

                {searchParams.get('registered') && (
                    <div className="mb-4 p-3 bg-green-50 border border-green-200 text-green-700 rounded-lg">
                        Cadastro realizado! Faça login para continuar.
                    </div>
                )}

                {error && (
                    <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg">
                        {error}
                    </div>
                )}

                {step === 'phone' ? (
                    <form onSubmit={handleRequestCode} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                WhatsApp
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
                            {loading ? 'Enviando...' : 'Enviar Código'}
                        </button>
                    </form>
                ) : (
                    <form onSubmit={handleVerifyCode} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Código de 6 dígitos
                            </label>
                            <input
                                type="text"
                                value={code}
                                onChange={(e) => setCode(e.target.value)}
                                placeholder="123456"
                                maxLength={6}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-center text-2xl tracking-widest"
                                required
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition disabled:opacity-50"
                        >
                            {loading ? 'Verificando...' : 'Verificar'}
                        </button>

                        <button
                            type="button"
                            onClick={() => setStep('phone')}
                            className="w-full py-2 text-sm text-gray-600 hover:text-gray-900"
                        >
                            Voltar
                        </button>
                    </form>
                )}

                <p className="mt-4 text-center text-sm text-gray-600">
                    Não tem conta?{' '}
                    <Link href="/auth/register" className="text-primary-600 hover:underline">
                        Cadastrar
                    </Link>
                </p>
            </div>
        </div>
    )
}
