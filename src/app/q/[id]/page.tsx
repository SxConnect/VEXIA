'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'

interface Pergunta {
    id: string
    texto: string
    contexto?: string
    tipo: string
    obrigatoria: boolean
    permitirOutro: boolean
    opcoes: { id: string; texto: string; ordem: number }[]
    campoCondicional: boolean
    condicaoOpcoes: string | null
    campoCondicionalTexto: string | null
    campoObrigatorio: boolean
}

export default function ResponderQuestionarioPage() {
    const params = useParams()
    const [questionario, setQuestionario] = useState<any>(null)
    const [step, setStep] = useState<'info' | 'perguntas' | 'concluido'>('info')
    const [currentQuestion, setCurrentQuestion] = useState(0)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')

    // Dados do respondente - capturados da URL ou localStorage
    const [nome, setNome] = useState('')
    const [whatsapp, setWhatsapp] = useState('')
    const [tipoEmpresa, setTipoEmpresa] = useState('')

    // Respostas
    const [respostas, setRespostas] = useState<Record<string, any>>({})

    useEffect(() => {
        // Capturar dados da URL
        const urlParams = new URLSearchParams(window.location.search)
        const nomeUrl = urlParams.get('nome')
        const whatsappUrl = urlParams.get('whatsapp')
        const tipoEmpresaUrl = urlParams.get('tipo')

        // Tentar recuperar do localStorage
        const nomeStorage = localStorage.getItem('respondente_nome')
        const whatsappStorage = localStorage.getItem('respondente_whatsapp')
        const tipoEmpresaStorage = localStorage.getItem('respondente_tipo')

        // Prioridade: URL > localStorage > Padrão
        const nomeFinal = nomeUrl || nomeStorage || 'Respondente'
        const whatsappFinal = whatsappUrl || whatsappStorage || '+5500000000000'
        const tipoEmpresaFinal = tipoEmpresaUrl || tipoEmpresaStorage || ''

        setNome(nomeFinal)
        setWhatsapp(whatsappFinal)
        setTipoEmpresa(tipoEmpresaFinal)

        // Salvar no localStorage para próximas visitas
        if (nomeUrl) localStorage.setItem('respondente_nome', nomeUrl)
        if (whatsappUrl) localStorage.setItem('respondente_whatsapp', whatsappUrl)
        if (tipoEmpresaUrl) localStorage.setItem('respondente_tipo', tipoEmpresaUrl)

        fetchQuestionario()
    }, [])

    const fetchQuestionario = async () => {
        try {
            const res = await fetch(`/api/public/questionario/${params.id}`)
            const data = await res.json()

            if (!res.ok) {
                throw new Error(data.error || 'Questionário não encontrado')
            }

            setQuestionario(data)
        } catch (err: any) {
            setError(err.message)
        } finally {
            setLoading(false)
        }
    }

    const handleStartQuiz = () => {
        setStep('perguntas')
    }

    const handleAnswer = (perguntaId: string, value: any) => {
        setRespostas({ ...respostas, [perguntaId]: value })
    }

    // Verifica se o campo condicional deve ser mostrado
    const shouldShowConditionalField = (pergunta: Pergunta) => {
        if (!pergunta.campoCondicional || !pergunta.condicaoOpcoes) return false

        const resposta = respostas[pergunta.id]
        if (!resposta) return false

        // Converter condicaoOpcoes (índices) para IDs de opções
        const indicesCondicao = pergunta.condicaoOpcoes.split(',').map(i => parseInt(i))
        const opcoesCondicao = indicesCondicao.map(idx => pergunta.opcoes[idx]?.id).filter(Boolean)

        // Verificar se alguma opção condicional foi selecionada
        if (pergunta.tipo === 'unica') {
            return opcoesCondicao.includes(resposta.opcaoId)
        } else {
            return resposta.opcoes?.some((id: string) => opcoesCondicao.includes(id))
        }
    }

    const handleNext = async () => {
        const pergunta = questionario.perguntas[currentQuestion]

        if (pergunta.obrigatoria) {
            const resposta = respostas[pergunta.id]

            // Validar se tem resposta
            if (!resposta) {
                alert('Esta pergunta é obrigatória')
                return
            }

            // Para perguntas de múltipla escolha, verificar se tem pelo menos uma opção ou texto em "outro"
            if (pergunta.tipo !== 'texto') {
                const temOpcao = resposta.opcaoId || (resposta.opcoes && resposta.opcoes.length > 0)
                const temOutro = resposta.outro && resposta.outro.trim() !== ''

                if (!temOpcao && !temOutro) {
                    alert('Esta pergunta é obrigatória')
                    return
                }
            }
        }

        // Validar campo condicional obrigatório
        if (shouldShowConditionalField(pergunta) && pergunta.campoObrigatorio) {
            const resposta = respostas[pergunta.id]
            if (!resposta?.campoCondicional || resposta.campoCondicional.trim() === '') {
                alert('O campo adicional é obrigatório para esta resposta')
                return
            }
        }

        if (currentQuestion < questionario.perguntas.length - 1) {
            setCurrentQuestion(currentQuestion + 1)
        } else {
            await handleSubmit()
        }
    }

    const handleSubmit = async () => {
        setLoading(true)

        try {
            const respostasArray = Object.entries(respostas).map(([perguntaId, value]) => {
                // Se for resposta de texto simples
                if (typeof value === 'string') {
                    return {
                        perguntaId,
                        resposta: value,
                    }
                }

                // Se for resposta com opções e/ou outro - converter para JSON
                const respostaObj: any = {}

                // Adicionar opção única
                if (value.opcaoId) {
                    respostaObj.opcaoId = value.opcaoId
                }

                // Adicionar múltiplas opções
                if (value.opcoes && value.opcoes.length > 0) {
                    respostaObj.opcoes = value.opcoes
                }

                // Adicionar campo condicional
                if (value.campoCondicional && value.campoCondicional.trim() !== '') {
                    respostaObj.campoCondicional = value.campoCondicional
                }

                // Se o objeto está vazio e só tem "outro", não enviar resposta JSON vazia
                const temDados = Object.keys(respostaObj).length > 0

                return {
                    perguntaId,
                    resposta: temDados ? JSON.stringify(respostaObj) : null,
                    respostaTexto: value.outro && value.outro.trim() !== '' ? value.outro : null,
                }
            })

            console.log('📤 Enviando respostas:', JSON.stringify({ respostas: respostasArray }, null, 2))

            const res = await fetch('/api/public/responder', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    questionarioId: params.id,
                    nome,
                    whatsapp,
                    tipoEmpresa,
                    respostas: respostasArray,
                }),
            })

            if (!res.ok) {
                throw new Error('Erro ao enviar respostas')
            }

            setStep('concluido')
        } catch (err: any) {
            setError(err.message)
        } finally {
            setLoading(false)
        }
    }

    if (loading && !questionario) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
                    <p className="mt-4 text-gray-600">Carregando...</p>
                </div>
            </div>
        )
    }

    if (error) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
                <div className="bg-white p-8 rounded-2xl shadow-xl max-w-md text-center">
                    <div className="text-6xl mb-4">❌</div>
                    <h1 className="text-2xl font-bold text-gray-900 mb-2">Erro</h1>
                    <p className="text-gray-600">{error}</p>
                </div>
            </div>
        )
    }

    if (step === 'info') {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
                <div className="bg-white p-8 rounded-2xl shadow-xl max-w-2xl w-full">
                    {questionario.imagemUrl && (
                        <div className="mb-6 rounded-xl overflow-hidden">
                            <img
                                src={questionario.imagemUrl}
                                alt={questionario.titulo}
                                className="w-full h-64 object-cover"
                            />
                        </div>
                    )}
                    <h1 className="text-3xl font-bold text-gray-900 mb-4">
                        {questionario.titulo}
                    </h1>
                    {questionario.descricao && (
                        <p className="text-gray-600 mb-6 whitespace-pre-line">
                            {questionario.descricao}
                        </p>
                    )}
                    <button
                        onClick={handleStartQuiz}
                        className="w-full py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition text-lg font-medium"
                    >
                        Começar
                    </button>
                </div>
            </div>
        )
    }

    if (step === 'perguntas') {
        const pergunta = questionario.perguntas[currentQuestion]
        const progress = ((currentQuestion + 1) / questionario.perguntas.length) * 100

        return (
            <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4 py-8">
                <div className="max-w-2xl mx-auto">
                    {/* Progress Bar */}
                    <div className="mb-6">
                        <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                            <div
                                className="h-full bg-primary-600 transition-all duration-300"
                                style={{ width: `${progress}%` }}
                            />
                        </div>
                        <p className="text-sm text-gray-600 mt-2 text-center">
                            Pergunta {currentQuestion + 1} de {questionario.perguntas.length}
                        </p>
                    </div>

                    {/* Question Card */}
                    <div className="bg-white p-8 rounded-2xl shadow-xl">
                        <h2 className="text-2xl font-bold text-gray-900 mb-2 whitespace-pre-line">
                            {pergunta.texto}
                        </h2>
                        {pergunta.contexto && (
                            <p className="text-gray-600 mb-6 whitespace-pre-line">{pergunta.contexto}</p>
                        )}

                        <div className="space-y-3">
                            {pergunta.tipo === 'texto' ? (
                                <textarea
                                    value={respostas[pergunta.id] || ''}
                                    onChange={(e) => handleAnswer(pergunta.id, e.target.value)}
                                    rows={4}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                                    placeholder="Digite sua resposta..."
                                />
                            ) : (
                                <>
                                    {pergunta.opcoes.map((opcao: any) => (
                                        <label
                                            key={opcao.id}
                                            className="flex items-center p-4 border border-gray-300 rounded-lg hover:bg-gray-50 cursor-pointer transition"
                                        >
                                            <input
                                                type={pergunta.tipo === 'unica' ? 'radio' : 'checkbox'}
                                                name={pergunta.id}
                                                value={opcao.id}
                                                checked={
                                                    pergunta.tipo === 'unica'
                                                        ? respostas[pergunta.id]?.opcaoId === opcao.id
                                                        : respostas[pergunta.id]?.opcoes?.includes(opcao.id)
                                                }
                                                onChange={(e) => {
                                                    if (pergunta.tipo === 'unica') {
                                                        handleAnswer(pergunta.id, { opcaoId: opcao.id })
                                                    } else {
                                                        const current = respostas[pergunta.id]?.opcoes || []
                                                        const updated = e.target.checked
                                                            ? [...current, opcao.id]
                                                            : current.filter((id: string) => id !== opcao.id)
                                                        handleAnswer(pergunta.id, {
                                                            opcoes: updated,
                                                            outro: respostas[pergunta.id]?.outro
                                                        })
                                                    }
                                                }}
                                                className="mr-3"
                                            />
                                            <span className="text-gray-900">{opcao.texto}</span>
                                        </label>
                                    ))}

                                    {pergunta.permitirOutro && (
                                        <div className="mt-4">
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Outro (especifique):
                                            </label>
                                            <input
                                                type="text"
                                                value={respostas[pergunta.id]?.outro || ''}
                                                onChange={(e) => {
                                                    const current = respostas[pergunta.id] || {}
                                                    handleAnswer(pergunta.id, {
                                                        ...current,
                                                        outro: e.target.value
                                                    })
                                                }}
                                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                                                placeholder="Digite sua resposta personalizada..."
                                            />
                                        </div>
                                    )}

                                    {/* Campo Condicional */}
                                    {shouldShowConditionalField(pergunta) && (
                                        <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                                            <label className="block text-sm font-medium text-blue-900 mb-2">
                                                {pergunta.campoCondicionalTexto || 'Informação adicional'}
                                                {pergunta.campoObrigatorio && <span className="text-red-500 ml-1">*</span>}
                                            </label>
                                            <textarea
                                                value={respostas[pergunta.id]?.campoCondicional || ''}
                                                onChange={(e) => {
                                                    const current = respostas[pergunta.id] || {}
                                                    handleAnswer(pergunta.id, {
                                                        ...current,
                                                        campoCondicional: e.target.value
                                                    })
                                                }}
                                                rows={3}
                                                className="w-full px-4 py-2 border border-blue-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
                                                placeholder="Digite sua resposta..."
                                                required={pergunta.campoObrigatorio}
                                            />
                                        </div>
                                    )}
                                </>
                            )}
                        </div>

                        <button
                            onClick={handleNext}
                            disabled={loading}
                            className="w-full mt-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition disabled:opacity-50"
                        >
                            {loading
                                ? 'Enviando...'
                                : currentQuestion < questionario.perguntas.length - 1
                                    ? 'Avançar'
                                    : 'Finalizar'}
                        </button>
                    </div>
                </div>
            </div>
        )
    }

    if (step === 'concluido') {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
                <div className="bg-white p-8 rounded-2xl shadow-xl max-w-md text-center">
                    <div className="text-6xl mb-4">✅</div>
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">
                        Obrigado!
                    </h1>
                    <p className="text-gray-600">
                        Suas respostas foram enviadas com sucesso.
                    </p>
                </div>
            </div>
        )
    }

    return null
}
