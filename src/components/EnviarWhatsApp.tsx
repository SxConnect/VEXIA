'use client'

import { useState } from 'react'

interface EnviarWhatsAppProps {
    questionarioId: string
    questionarioTitulo: string
    imagemUrl?: string
}

export default function EnviarWhatsApp({ questionarioId, questionarioTitulo, imagemUrl }: EnviarWhatsAppProps) {
    const [modalBotao, setModalBotao] = useState(false)
    const [modalCard, setModalCard] = useState(false)
    const [enviando, setEnviando] = useState(false)
    const [uploadando, setUploadando] = useState(false)

    const [destinatario, setDestinatario] = useState('')
    const [mensagem, setMensagem] = useState(`Olá! Gostaríamos da sua opinião sobre: ${questionarioTitulo}`)
    const [imagemUrlCustom, setImagemUrlCustom] = useState(imagemUrl || '')
    const [tituloCard, setTituloCard] = useState(questionarioTitulo)
    const [descricaoCard, setDescricaoCard] = useState('Clique no link abaixo para responder')

    const handleUploadImagem = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (!file) return

        setUploadando(true)
        try {
            const formData = new FormData()
            formData.append('file', file)

            const res = await fetch('/api/upload', {
                method: 'POST',
                body: formData,
            })

            const data = await res.json()

            if (res.ok) {
                setImagemUrlCustom(window.location.origin + data.url)
            } else {
                alert('❌ ' + (data.error || 'Erro no upload'))
            }
        } catch (error) {
            alert('❌ Erro ao fazer upload')
        } finally {
            setUploadando(false)
        }
    }

    const handleEnviarBotao = async () => {
        if (!destinatario || !mensagem) {
            alert('Preencha o destinatário e a mensagem')
            return
        }

        setEnviando(true)
        try {
            const res = await fetch(`/api/questionarios/${questionarioId}/enviar`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    tipo: 'botao',
                    destinatario,
                    mensagem,
                }),
            })

            const data = await res.json()

            if (res.ok) {
                alert('✅ Enviado com sucesso!')
                setModalBotao(false)
                setDestinatario('')
            } else {
                alert('❌ ' + (data.error || 'Erro ao enviar'))
            }
        } catch (error) {
            alert('❌ Erro ao enviar mensagem')
        } finally {
            setEnviando(false)
        }
    }

    const handleEnviarCard = async () => {
        if (!destinatario || !tituloCard) {
            alert('Preencha o destinatário e o título')
            return
        }

        setEnviando(true)
        try {
            const res = await fetch(`/api/questionarios/${questionarioId}/enviar`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    tipo: 'card',
                    destinatario,
                    mensagem: descricaoCard,
                    imagemUrl: imagemUrlCustom,
                    tituloCard,
                    descricaoCard,
                }),
            })

            const data = await res.json()

            if (res.ok) {
                alert('✅ Enviado com sucesso!')
                setModalCard(false)
                setDestinatario('')
            } else {
                alert('❌ ' + (data.error || 'Erro ao enviar'))
            }
        } catch (error) {
            alert('❌ Erro ao enviar mensagem')
        } finally {
            setEnviando(false)
        }
    }

    return (
        <>
            <div className="flex flex-col sm:flex-row gap-2">
                <button
                    onClick={() => setModalBotao(true)}
                    className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition flex items-center justify-center space-x-2"
                >
                    <span>📱</span>
                    <span>Enviar com Botão</span>
                </button>
                <button
                    onClick={() => setModalCard(true)}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition flex items-center justify-center space-x-2"
                >
                    <span>🖼️</span>
                    <span>Enviar com Card</span>
                </button>
            </div>

            {/* Modal Botão */}
            {modalBotao && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6">
                        <h3 className="text-xl font-bold text-gray-900 mb-4">📱 Enviar com Botão</h3>

                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Destinatário (WhatsApp ou ID do Grupo)
                                </label>
                                <input
                                    type="text"
                                    value={destinatario}
                                    onChange={(e) => setDestinatario(e.target.value)}
                                    placeholder="5521999999999 ou 120363..."
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                                />
                                <p className="text-xs text-gray-500 mt-1">
                                    Número com código do país (sem +) ou ID do grupo
                                </p>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Mensagem</label>
                                <textarea
                                    value={mensagem}
                                    onChange={(e) => setMensagem(e.target.value)}
                                    rows={4}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                                />
                            </div>
                        </div>

                        <div className="flex space-x-3 mt-6">
                            <button
                                onClick={() => setModalBotao(false)}
                                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                                disabled={enviando}
                            >
                                Cancelar
                            </button>
                            <button
                                onClick={handleEnviarBotao}
                                disabled={enviando}
                                className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50"
                            >
                                {enviando ? 'Enviando...' : 'Enviar'}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Modal Card */}
            {modalCard && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 overflow-y-auto">
                    <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full p-6 my-8">
                        <h3 className="text-xl font-bold text-gray-900 mb-6">🖼️ Enviar com Card</h3>

                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            {/* Formulário */}
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Destinatário (WhatsApp ou ID do Grupo)
                                    </label>
                                    <input
                                        type="text"
                                        value={destinatario}
                                        onChange={(e) => setDestinatario(e.target.value)}
                                        placeholder="5521999999999 ou 120363..."
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Título do Card</label>
                                    <input
                                        type="text"
                                        value={tituloCard}
                                        onChange={(e) => setTituloCard(e.target.value)}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Descrição</label>
                                    <textarea
                                        value={descricaoCard}
                                        onChange={(e) => setDescricaoCard(e.target.value)}
                                        rows={3}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Imagem do Card</label>
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={handleUploadImagem}
                                        disabled={uploadando}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                                    />
                                    {uploadando && <p className="text-sm text-blue-600 mt-2">Fazendo upload...</p>}
                                    {imagemUrlCustom && (
                                        <p className="text-xs text-green-600 mt-2">✓ Imagem carregada</p>
                                    )}
                                </div>

                                <div className="flex space-x-3 mt-6">
                                    <button
                                        onClick={() => setModalCard(false)}
                                        className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                                        disabled={enviando}
                                    >
                                        Cancelar
                                    </button>
                                    <button
                                        onClick={handleEnviarCard}
                                        disabled={enviando || uploadando}
                                        className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
                                    >
                                        {enviando ? 'Enviando...' : 'Enviar'}
                                    </button>
                                </div>
                            </div>

                            {/* Preview do Card */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-3">Preview do Card</label>
                                <div className="bg-gradient-to-b from-teal-500 to-teal-600 p-4 rounded-2xl">
                                    <div className="bg-white rounded-xl shadow-lg overflow-hidden max-w-sm mx-auto">
                                        {imagemUrlCustom && (
                                            <div className="w-full h-48 bg-gray-100 overflow-hidden">
                                                <img
                                                    src={imagemUrlCustom}
                                                    alt="Preview"
                                                    className="w-full h-full object-contain"
                                                />
                                            </div>
                                        )}
                                        {!imagemUrlCustom && (
                                            <div className="w-full h-48 bg-gray-200 flex items-center justify-center">
                                                <span className="text-gray-400 text-4xl">🖼️</span>
                                            </div>
                                        )}
                                        <div className="p-4">
                                            <h4 className="font-bold text-gray-900 text-lg mb-2">{tituloCard || 'Título do Card'}</h4>
                                            <p className="text-gray-600 text-sm mb-4 line-clamp-3">{descricaoCard || 'Descrição do card'}</p>
                                            <button className="w-full py-2 bg-teal-500 text-white rounded-lg text-sm font-medium">
                                                Responder Questionário
                                            </button>
                                        </div>
                                    </div>
                                    <p className="text-white text-xs text-center mt-3 opacity-75">
                                        Assim aparecerá no WhatsApp
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    )
}
