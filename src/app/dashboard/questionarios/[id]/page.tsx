'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import EnviarWhatsApp from '@/components/EnviarWhatsApp'

export default function EditarQuestionarioPage() {
    const params = useParams()
    const router = useRouter()
    const [questionario, setQuestionario] = useState<any>(null)
    const [loading, setLoading] = useState(true)
    const [novaPergunta, setNovaPergunta] = useState({
        texto: '',
        contexto: '',
        tipo: 'unica',
        opcoes: ['', ''],
        permitirOutro: false,
        campoCondicional: false,
        condicaoOpcoes: [] as number[],
        campoCondicionalTexto: '',
        campoObrigatorio: false,
    })
    const [uploadando, setUploadando] = useState(false)

    // Estados para modais de envio
    const [modalBotao, setModalBotao] = useState(false)
    const [modalCard, setModalCard] = useState(false)
    const [enviando, setEnviando] = useState(false)

    // Dados do envio
    const [destinatario, setDestinatario] = useState('')
    const [mensagem, setMensagem] = useState('')
    const [imagemUrl, setImagemUrl] = useState('')
    const [tituloCard, setTituloCard] = useState('')
    const [descricaoCard, setDescricaoCard] = useState('')

    useEffect(() => {
        fetchQuestionario()
    }, [])

    const fetchQuestionario = async () => {
        try {
            const res = await fetch(`/api/questionarios/${params.id}`)
            if (res.ok) {
                const data = await res.json()
                setQuestionario(data)
            }
        } catch (error) {
            console.error('Erro ao carregar questionário:', error)
        } finally {
            setLoading(false)
        }
    }

    const handleAddOpcao = () => {
        setNovaPergunta({
            ...novaPergunta,
            opcoes: [...novaPergunta.opcoes, ''],
        })
    }

    const handleRemoveOpcao = (index: number) => {
        const novasOpcoes = novaPergunta.opcoes.filter((_, i) => i !== index)
        setNovaPergunta({ ...novaPergunta, opcoes: novasOpcoes })
    }

    const handleOpcaoChange = (index: number, value: string) => {
        const novasOpcoes = [...novaPergunta.opcoes]
        novasOpcoes[index] = value
        setNovaPergunta({ ...novaPergunta, opcoes: novasOpcoes })
    }

    const handleAddPergunta = async (e: React.FormEvent) => {
        e.preventDefault()

        try {
            const opcoesValidas = novaPergunta.opcoes.filter(o => o.trim() !== '')

            const res = await fetch(`/api/questionarios/${params.id}/perguntas`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    texto: novaPergunta.texto,
                    contexto: novaPergunta.contexto || undefined,
                    tipo: novaPergunta.tipo,
                    obrigatoria: true,
                    permitirOutro: novaPergunta.permitirOutro,
                    ordem: (questionario?.perguntas?.length || 0) + 1,
                    ativa: true,
                    opcoes: novaPergunta.tipo !== 'texto' ? opcoesValidas : undefined,
                    campoCondicional: novaPergunta.campoCondicional,
                    condicaoOpcoes: novaPergunta.campoCondicional
                        ? novaPergunta.condicaoOpcoes.join(',')
                        : null,
                    campoCondicionalTexto: novaPergunta.campoCondicional
                        ? novaPergunta.campoCondicionalTexto
                        : null,
                    campoObrigatorio: novaPergunta.campoObrigatorio,
                }),
            })

            if (res.ok) {
                setNovaPergunta({
                    texto: '',
                    contexto: '',
                    tipo: 'unica',
                    opcoes: ['', ''],
                    permitirOutro: false,
                    campoCondicional: false,
                    condicaoOpcoes: [],
                    campoCondicionalTexto: '',
                    campoObrigatorio: false,
                })
                fetchQuestionario()
            }
        } catch (error) {
            console.error('Erro ao adicionar pergunta:', error)
        }
    }

    const handleDeletePergunta = async (perguntaId: string) => {
        if (!confirm('Tem certeza que deseja excluir esta pergunta?')) return

        try {
            const res = await fetch(`/api/perguntas/${perguntaId}`, {
                method: 'DELETE',
            })

            if (res.ok) {
                fetchQuestionario()
            } else {
                const data = await res.json()
                alert(data.error || 'Erro ao deletar pergunta')
            }
        } catch (error) {
            console.error('Erro ao deletar pergunta:', error)
            alert('Erro ao deletar pergunta')
        }
    }

    const handleToggleStatus = async () => {
        try {
            const novoStatus = questionario.status === 'ativo' ? 'inativo' : 'ativo'

            const res = await fetch(`/api/questionarios/${params.id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ status: novoStatus }),
            })

            if (res.ok) {
                fetchQuestionario()
            }
        } catch (error) {
            console.error('Erro ao atualizar status:', error)
        }
    }

    const handleUploadImagem = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (!file) return

        setUploadando(true)
        try {
            const formData = new FormData()
            formData.append('file', file)

            const uploadRes = await fetch('/api/upload', {
                method: 'POST',
                body: formData,
            })

            const uploadData = await uploadRes.json()

            if (uploadRes.ok) {
                const imagemUrl = window.location.origin + uploadData.url

                // Atualizar questionário com a nova imagem
                const res = await fetch(`/api/questionarios/${params.id}`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ imagemUrl }),
                })

                if (res.ok) {
                    fetchQuestionario()
                    alert('✅ Imagem atualizada!')
                }
            } else {
                alert('❌ ' + (uploadData.error || 'Erro no upload'))
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
            const res = await fetch(`/api/questionarios/${params.id}/enviar`, {
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
                alert('Enviado com sucesso!')
                setModalBotao(false)
                setDestinatario('')
                setMensagem('')
            } else {
                alert(data.error || 'Erro ao enviar')
            }
        } catch (error) {
            console.error('Erro ao enviar:', error)
            alert('Erro ao enviar mensagem')
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
            const res = await fetch(`/api/questionarios/${params.id}/enviar`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    tipo: 'card',
                    destinatario,
                    mensagem: descricaoCard,
                    imagemUrl: imagemUrl || questionario.imagemUrl,
                    tituloCard,
                    descricaoCard,
                }),
            })

            const data = await res.json()

            if (res.ok) {
                alert('Enviado com sucesso!')
                setModalCard(false)
                setDestinatario('')
                setTituloCard('')
                setDescricaoCard('')
                setImagemUrl('')
            } else {
                alert(data.error || 'Erro ao enviar')
            }
        } catch (error) {
            console.error('Erro ao enviar:', error)
            alert('Erro ao enviar mensagem')
        } finally {
            setEnviando(false)
        }
    }

    if (loading) {
        return <div className="text-center py-12">Carregando...</div>
    }

    if (!questionario) {
        return <div className="text-center py-12">Questionário não encontrado</div>
    }

    const linkPublico = `${window.location.origin}/q/${params.id}`

    return (
        <div className="max-w-4xl">
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">{questionario.titulo}</h1>
                    {questionario.descricao && (
                        <p className="text-gray-600 mt-2">{questionario.descricao}</p>
                    )}
                </div>
                <div className="flex space-x-3">
                    <button
                        onClick={handleToggleStatus}
                        className={`px-4 py-2 rounded-lg transition ${questionario.status === 'ativo'
                            ? 'bg-green-100 text-green-700 hover:bg-green-200'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                            }`}
                    >
                        {questionario.status === 'ativo' ? '✓ Ativo' : '○ Inativo'}
                    </button>
                    <Link
                        href="/dashboard/questionarios"
                        className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition"
                    >
                        Voltar
                    </Link>
                </div>
            </div>

            {/* Link Público */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
                <h3 className="font-semibold text-blue-900 mb-2">🔗 Link Público</h3>
                <div className="flex items-center space-x-2">
                    <input
                        type="text"
                        value={linkPublico}
                        readOnly
                        className="flex-1 px-3 py-2 bg-white border border-blue-300 rounded text-sm"
                    />
                    <button
                        onClick={() => {
                            navigator.clipboard.writeText(linkPublico)
                            alert('Link copiado!')
                        }}
                        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
                    >
                        Copiar
                    </button>
                </div>
            </div>

            {/* Imagem do Questionário */}
            <div className="bg-purple-50 border border-purple-200 rounded-lg p-4 mb-4">
                <h3 className="font-semibold text-purple-900 mb-3">🖼️ Imagem do Questionário</h3>
                <div className="flex flex-col sm:flex-row gap-4 items-start">
                    <div className="flex-1">
                        <input
                            type="file"
                            accept="image/*"
                            onChange={handleUploadImagem}
                            disabled={uploadando}
                            className="w-full px-4 py-2 border border-purple-300 rounded-lg focus:ring-2 focus:ring-purple-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-purple-100 file:text-purple-700 hover:file:bg-purple-200"
                        />
                        {uploadando && <p className="text-sm text-purple-600 mt-2">Fazendo upload...</p>}
                        <p className="text-xs text-gray-600 mt-2">
                            Esta imagem será usada ao enviar o questionário via WhatsApp (Card)
                        </p>
                    </div>
                    {questionario.imagemUrl && (
                        <div className="w-32 h-32 rounded-lg overflow-hidden border-2 border-purple-200">
                            <img
                                src={questionario.imagemUrl}
                                alt="Preview"
                                className="w-full h-full object-cover"
                            />
                        </div>
                    )}
                </div>
            </div>

            {/* Enviar via WhatsApp */}
            <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-8">
                <h3 className="font-semibold text-green-900 mb-3">📱 Enviar via WhatsApp</h3>
                <EnviarWhatsApp
                    questionarioId={params.id as string}
                    questionarioTitulo={questionario.titulo}
                    imagemUrl={questionario.imagemUrl}
                />
            </div>

            {/* Lista de Perguntas */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 mb-8">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">
                    Perguntas ({questionario.perguntas?.length || 0})
                </h2>

                {questionario.perguntas && questionario.perguntas.length > 0 ? (
                    <div className="space-y-4">
                        {questionario.perguntas.map((pergunta: any, index: number) => (
                            <div
                                key={pergunta.id}
                                className="border border-gray-200 rounded-lg p-4"
                            >
                                <div className="flex justify-between items-start">
                                    <div className="flex-1">
                                        <div className="flex items-center space-x-2 mb-2">
                                            <span className="text-sm font-semibold text-gray-500">
                                                #{index + 1}
                                            </span>
                                            <span className={`text-xs px-2 py-1 rounded ${pergunta.tipo === 'unica' ? 'bg-blue-100 text-blue-700' :
                                                pergunta.tipo === 'multipla' ? 'bg-purple-100 text-purple-700' :
                                                    'bg-gray-100 text-gray-700'
                                                }`}>
                                                {pergunta.tipo === 'unica' ? 'Única escolha' :
                                                    pergunta.tipo === 'multipla' ? 'Múltipla escolha' :
                                                        'Texto'}
                                            </span>
                                        </div>
                                        <p className="text-gray-900 font-medium mb-2">{pergunta.texto}</p>
                                        {pergunta.opcoes && pergunta.opcoes.length > 0 && (
                                            <ul className="text-sm text-gray-600 space-y-1">
                                                {pergunta.opcoes.map((opcao: any) => (
                                                    <li key={opcao.id}>• {opcao.texto}</li>
                                                ))}
                                            </ul>
                                        )}
                                    </div>
                                    <button
                                        onClick={() => handleDeletePergunta(pergunta.id)}
                                        className="text-red-600 hover:text-red-700 text-sm"
                                    >
                                        Excluir
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <p className="text-gray-500 text-center py-8">
                        Nenhuma pergunta adicionada ainda
                    </p>
                )}
            </div>

            {/* Adicionar Nova Pergunta */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">
                    Adicionar Nova Pergunta
                </h2>

                <form onSubmit={handleAddPergunta} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Texto da Pergunta
                        </label>
                        <input
                            type="text"
                            value={novaPergunta.texto}
                            onChange={(e) => setNovaPergunta({ ...novaPergunta, texto: e.target.value })}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                            required
                        />
                        <p className="text-xs text-gray-500 mt-1">
                            Use Enter para quebrar linhas e formatar o texto
                        </p>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Contexto / Descrição (opcional)
                        </label>
                        <textarea
                            value={novaPergunta.contexto}
                            onChange={(e) => setNovaPergunta({ ...novaPergunta, contexto: e.target.value })}
                            rows={3}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                            placeholder="Adicione informações extras ou contexto para a pergunta..."
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Tipo de Resposta
                        </label>
                        <select
                            value={novaPergunta.tipo}
                            onChange={(e) => setNovaPergunta({ ...novaPergunta, tipo: e.target.value })}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                        >
                            <option value="unica">Única escolha</option>
                            <option value="multipla">Múltipla escolha</option>
                            <option value="texto">Texto livre</option>
                        </select>
                    </div>

                    {novaPergunta.tipo !== 'texto' && (
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Opções de Resposta
                            </label>
                            <div className="space-y-2">
                                {novaPergunta.opcoes.map((opcao, index) => (
                                    <div key={index} className="flex space-x-2">
                                        <input
                                            type="text"
                                            value={opcao}
                                            onChange={(e) => handleOpcaoChange(index, e.target.value)}
                                            placeholder={`Opção ${index + 1}`}
                                            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                                        />
                                        {novaPergunta.opcoes.length > 2 && (
                                            <button
                                                type="button"
                                                onClick={() => handleRemoveOpcao(index)}
                                                className="px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg transition"
                                            >
                                                ✕
                                            </button>
                                        )}
                                    </div>
                                ))}
                                <button
                                    type="button"
                                    onClick={handleAddOpcao}
                                    className="text-sm text-primary-600 hover:text-primary-700"
                                >
                                    + Adicionar opção
                                </button>
                            </div>
                        </div>
                    )}

                    {/* Opções Avançadas */}
                    <div className="border-t pt-4 space-y-3">
                        <h3 className="text-sm font-semibold text-gray-700">Opções Avançadas</h3>

                        {/* Permitir Outro */}
                        {novaPergunta.tipo !== 'texto' && (
                            <label className="flex items-center space-x-2">
                                <input
                                    type="checkbox"
                                    checked={novaPergunta.permitirOutro}
                                    onChange={(e) => setNovaPergunta({
                                        ...novaPergunta,
                                        permitirOutro: e.target.checked
                                    })}
                                    className="rounded border-gray-300"
                                />
                                <span className="text-sm text-gray-700">
                                    Permitir opção "Outro" (campo de texto livre)
                                </span>
                            </label>
                        )}

                        {/* Campo Condicional */}
                        {novaPergunta.tipo !== 'texto' && (
                            <div className="space-y-3">
                                <label className="flex items-center space-x-2">
                                    <input
                                        type="checkbox"
                                        checked={novaPergunta.campoCondicional}
                                        onChange={(e) => setNovaPergunta({
                                            ...novaPergunta,
                                            campoCondicional: e.target.checked,
                                            condicaoOpcoes: e.target.checked ? novaPergunta.condicaoOpcoes : [],
                                            campoCondicionalTexto: e.target.checked ? novaPergunta.campoCondicionalTexto : '',
                                        })}
                                        className="rounded border-gray-300"
                                    />
                                    <span className="text-sm text-gray-700">
                                        Mostrar campo adicional baseado na resposta (lógica condicional)
                                    </span>
                                </label>

                                {novaPergunta.campoCondicional && (
                                    <div className="ml-6 space-y-3 p-4 bg-gray-50 rounded-lg">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Mostrar campo quando selecionar:
                                            </label>
                                            <div className="space-y-2">
                                                {novaPergunta.opcoes.map((opcao, index) => (
                                                    opcao.trim() && (
                                                        <label key={index} className="flex items-center space-x-2">
                                                            <input
                                                                type="checkbox"
                                                                checked={novaPergunta.condicaoOpcoes.includes(index)}
                                                                onChange={(e) => {
                                                                    const novasCondicoes = e.target.checked
                                                                        ? [...novaPergunta.condicaoOpcoes, index]
                                                                        : novaPergunta.condicaoOpcoes.filter(i => i !== index)
                                                                    setNovaPergunta({
                                                                        ...novaPergunta,
                                                                        condicaoOpcoes: novasCondicoes
                                                                    })
                                                                }}
                                                                className="rounded border-gray-300"
                                                            />
                                                            <span className="text-sm text-gray-600">{opcao}</span>
                                                        </label>
                                                    )
                                                ))}
                                            </div>
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                                Texto do campo adicional
                                            </label>
                                            <input
                                                type="text"
                                                value={novaPergunta.campoCondicionalTexto}
                                                onChange={(e) => setNovaPergunta({
                                                    ...novaPergunta,
                                                    campoCondicionalTexto: e.target.value
                                                })}
                                                placeholder="Ex: Por que você usaria? Em qual tipo de projeto?"
                                                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                                            />
                                        </div>

                                        <label className="flex items-center space-x-2">
                                            <input
                                                type="checkbox"
                                                checked={novaPergunta.campoObrigatorio}
                                                onChange={(e) => setNovaPergunta({
                                                    ...novaPergunta,
                                                    campoObrigatorio: e.target.checked
                                                })}
                                                className="rounded border-gray-300"
                                            />
                                            <span className="text-sm text-gray-700">
                                                Campo adicional obrigatório
                                            </span>
                                        </label>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>

                    <button
                        type="submit"
                        className="w-full py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition"
                    >
                        Adicionar Pergunta
                    </button>
                </form>
            </div>
        </div>
    )
}
