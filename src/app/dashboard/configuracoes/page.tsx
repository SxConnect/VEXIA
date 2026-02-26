'use client'

import { useState, useEffect } from 'react'

export default function ConfiguracoesPage() {
    const [config, setConfig] = useState({
        papiUrl: '',
        papiInstanceId: '',
        papiApiKey: '',
    })
    const [loading, setLoading] = useState(false)
    const [message, setMessage] = useState('')

    useEffect(() => {
        // Carregar configurações atuais
        loadConfig()
    }, [])

    const loadConfig = async () => {
        try {
            const res = await fetch('/api/config')
            if (res.ok) {
                const data = await res.json()
                setConfig(data)
            }
        } catch (error) {
            console.error('Erro ao carregar configurações:', error)
        }
    }

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        setMessage('')

        try {
            const res = await fetch('/api/config', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(config),
            })

            if (res.ok) {
                setMessage('✅ Configurações salvas com sucesso! Reinicie o servidor para aplicar.')
            } else {
                setMessage('❌ Erro ao salvar configurações')
            }
        } catch (error) {
            setMessage('❌ Erro ao salvar configurações')
        } finally {
            setLoading(false)
        }
    }

    const handleTest = async () => {
        setLoading(true)
        setMessage('')

        try {
            const res = await fetch('/api/config/test', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(config),
            })

            const data = await res.json()

            if (res.ok) {
                setMessage('✅ Conexão com PAPI API funcionando!')
            } else {
                setMessage(`❌ Erro: ${data.error || 'Falha na conexão'}`)
            }
        } catch (error) {
            setMessage('❌ Erro ao testar conexão')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="max-w-2xl">
            <h1 className="text-3xl font-bold text-gray-900 mb-8">Configurações</h1>

            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">
                    Integração PAPI API (WhatsApp)
                </h2>

                <form onSubmit={handleSave} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            URL da PAPI API
                        </label>
                        <input
                            type="url"
                            value={config.papiUrl}
                            onChange={(e) => setConfig({ ...config, papiUrl: e.target.value })}
                            placeholder="https://api.seudominio.com"
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                            required
                        />
                        <p className="text-xs text-gray-500 mt-1">
                            URL completa da sua instância PAPI API
                        </p>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Instance ID
                        </label>
                        <input
                            type="text"
                            value={config.papiInstanceId}
                            onChange={(e) => setConfig({ ...config, papiInstanceId: e.target.value })}
                            placeholder="default"
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                            required
                        />
                        <p className="text-xs text-gray-500 mt-1">
                            Nome da instância criada na PAPI
                        </p>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            API Key (opcional)
                        </label>
                        <input
                            type="password"
                            value={config.papiApiKey}
                            onChange={(e) => setConfig({ ...config, papiApiKey: e.target.value })}
                            placeholder="Deixe vazio se não usar proteção"
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                        />
                        <p className="text-xs text-gray-500 mt-1">
                            Chave de API (se você configurou PANEL_API_KEY na PAPI)
                        </p>
                    </div>

                    {message && (
                        <div className={`p-3 rounded-lg ${message.includes('✅')
                                ? 'bg-green-50 border border-green-200 text-green-700'
                                : 'bg-red-50 border border-red-200 text-red-700'
                            }`}>
                            {message}
                        </div>
                    )}

                    <div className="flex space-x-3">
                        <button
                            type="submit"
                            disabled={loading}
                            className="px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition disabled:opacity-50"
                        >
                            {loading ? 'Salvando...' : 'Salvar Configurações'}
                        </button>
                        <button
                            type="button"
                            onClick={handleTest}
                            disabled={loading}
                            className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition disabled:opacity-50"
                        >
                            {loading ? 'Testando...' : 'Testar Conexão'}
                        </button>
                    </div>
                </form>

                <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                    <h3 className="font-semibold text-blue-900 mb-2">ℹ️ Como obter estas informações:</h3>
                    <ol className="text-sm text-blue-800 space-y-1 list-decimal list-inside">
                        <li>Acesse o painel da sua PAPI API</li>
                        <li>Crie uma instância (se ainda não tiver)</li>
                        <li>Copie o ID da instância</li>
                        <li>Se usar proteção, copie a API Key do painel</li>
                        <li>Cole as informações acima e clique em "Testar Conexão"</li>
                    </ol>
                </div>

                <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                    <h3 className="font-semibold text-yellow-900 mb-2">⚠️ Importante:</h3>
                    <p className="text-sm text-yellow-800">
                        Após salvar as configurações, você precisa <strong>reiniciar o servidor</strong> para que as mudanças tenham efeito.
                    </p>
                </div>
            </div>
        </div>
    )
}
