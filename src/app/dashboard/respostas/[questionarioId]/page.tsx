'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'

export default function RespostasQuestionarioPage() {
    const params = useParams()
    const [respondentes, setRespondentes] = useState<any[]>([])
    const [questionario, setQuestionario] = useState<any>(null)
    const [loading, setLoading] = useState(true)
    const [modalAberto, setModalAberto] = useState(false)
    const [respostaSelecionada, setRespostaSelecionada] = useState<any>(null)

    useEffect(() => {
        fetchRespostas()
        fetchQuestionario()
    }, [])

    const fetchQuestionario = async () => {
        try {
            const res = await fetch(`/api/questionarios/${params.questionarioId}`)
            if (res.ok) {
                const data = await res.json()
                setQuestionario(data)
            }
        } catch (error) {
            console.error('Erro ao carregar questionário:', error)
        }
    }

    const fetchRespostas = async () => {
        try {
            const res = await fetch(`/api/respostas/${params.questionarioId}`)
            if (res.ok) {
                const data = await res.json()
                console.log('📥 Frontend - Respondentes recebidos:', data.length)
                if (data.length > 0) {
                    console.log('📥 Primeiro respondente:', data[0])
                    if (data[0].respostas) {
                        console.log('📥 Respostas do primeiro:', data[0].respostas)
                    }
                }
                setRespondentes(data)
            }
        } catch (error) {
            console.error('Erro ao carregar respostas:', error)
        } finally {
            setLoading(false)
        }
    }

    const getRespostaTexto = (resposta: any, pergunta: any) => {
        try {
            console.log('🔍 Processando resposta:', {
                perguntaId: pergunta.id,
                tipo: pergunta.tipo,
                resposta: resposta.resposta,
                respostaTexto: resposta.respostaTexto
            })

            if (pergunta.tipo === 'texto') {
                return resposta.resposta || '-'
            }

            if (!resposta.resposta && !resposta.respostaTexto) {
                console.log('⚠️ Resposta vazia')
                return '-'
            }

            const respostaData = resposta.resposta ? JSON.parse(resposta.resposta) : {}
            console.log('📦 Dados parseados:', respostaData)

            const partes: string[] = []

            if (respostaData.opcaoId) {
                const opcao = pergunta.opcoes?.find((o: any) => o.id === respostaData.opcaoId)
                if (opcao) partes.push(opcao.texto)
            }

            if (respostaData.opcoes && Array.isArray(respostaData.opcoes)) {
                const textos = respostaData.opcoes
                    .map((id: string) => pergunta.opcoes?.find((o: any) => o.id === id)?.texto)
                    .filter(Boolean)
                partes.push(...textos)
            }

            if (resposta.respostaTexto) {
                partes.push(`Outro: ${resposta.respostaTexto}`)
            }

            if (respostaData.campoCondicional) {
                partes.push(`💬 ${respostaData.campoCondicional}`)
            }

            const resultado = partes.length > 0 ? partes.join(' • ') : '-'
            console.log('✅ Resultado final:', resultado)
            return resultado
        } catch (error) {
            console.error('❌ Erro ao processar resposta:', error, resposta)
            return resposta.resposta || resposta.respostaTexto || '-'
        }
    }

    const exportarCSV = () => {
        if (!questionario || respondentes.length === 0) return

        const headers = ['Nome', 'WhatsApp', 'Tipo Empresa', 'Data']
        questionario.perguntas.forEach((p: any, i: number) => {
            headers.push(`Pergunta ${i + 1}`)
        })

        const rows = respondentes.map(respondente => {
            const row = [
                respondente.nome,
                respondente.whatsapp,
                respondente.tipoEmpresa || '',
                new Date(respondente.dataInicio).toLocaleString('pt-BR')
            ]

            questionario.perguntas.forEach((pergunta: any) => {
                const resposta = respondente.respostas?.find((r: any) => r.perguntaId === pergunta.id)
                const texto = resposta ? getRespostaTexto(resposta, pergunta) : '-'
                row.push(texto.replace(/"/g, '""'))
            })

            return row
        })

        const csvContent = [
            headers.map(h => `"${h}"`).join(','),
            ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
        ].join('\n')

        const blob = new Blob(['\ufeff' + csvContent], { type: 'text/csv;charset=utf-8;' })
        const link = document.createElement('a')
        link.href = URL.createObjectURL(blob)
        link.download = `respostas-${questionario.titulo.replace(/[^a-z0-9]/gi, '-')}-${Date.now()}.csv`
        link.click()
    }

    const abrirModal = (respondente: any) => {
        setRespostaSelecionada(respondente)
        setModalAberto(true)
    }

    if (loading) {
        return <div className="text-center py-12">Carregando...</div>
    }

    return (
        <div className="w-full">
            <div className="mb-6 flex flex-col gap-4">
                <Link href="/dashboard/respostas" className="text-primary-600 hover:text-primary-700 inline-block">
                    ← Voltar
                </Link>
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div>
                        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
                            {questionario?.titulo || 'Respostas'}
                        </h1>
                        <p className="text-gray-600 mt-1">
                            {respondentes.length} {respondentes.length === 1 ? 'resposta' : 'respostas'}
                        </p>
                    </div>
                    {respondentes.length > 0 && (
                        <button onClick={exportarCSV} className="w-full sm:w-auto px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition text-sm">
                            📥 Exportar CSV
                        </button>
                    )}
                </div>
            </div>

            {respondentes.length === 0 ? (
                <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-200 text-center">
                    <div className="text-5xl mb-4">📭</div>
                    <h2 className="text-xl font-semibold text-gray-900 mb-2">Nenhuma resposta ainda</h2>
                    <p className="text-gray-600 mb-6">Compartilhe o link do questionário</p>
                    <Link href={`/dashboard/questionarios/${params.questionarioId}`} className="inline-block px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition">
                        Ver Questionário
                    </Link>
                </div>
            ) : (
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-gray-50 border-b border-gray-200">
                                <tr>
                                    <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">Nome</th>
                                    <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">WhatsApp</th>
                                    {questionario?.perguntas.map((p: any, i: number) => (
                                        <th key={p.id} className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                                            P{i + 1}
                                        </th>
                                    ))}
                                    <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">Ações</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                                {respondentes.map((respondente) => (
                                    <tr key={respondente.id} className="hover:bg-gray-50">
                                        <td className="px-3 py-2 text-sm text-gray-900">{respondente.nome}</td>
                                        <td className="px-3 py-2 text-sm text-gray-600">{respondente.whatsapp}</td>
                                        {questionario?.perguntas.map((pergunta: any) => {
                                            const resposta = respondente.respostas?.find((r: any) => r.perguntaId === pergunta.id)
                                            const texto = resposta ? getRespostaTexto(resposta, pergunta) : '-'
                                            return (
                                                <td key={pergunta.id} className="px-3 py-2 text-sm text-gray-700 max-w-[200px] truncate" title={texto}>
                                                    {texto}
                                                </td>
                                            )
                                        })}
                                        <td className="px-3 py-2 text-sm">
                                            <button onClick={() => abrirModal(respondente)} className="text-primary-600 hover:text-primary-700 font-medium text-xs">
                                                Ver
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {modalAberto && respostaSelecionada && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-xl shadow-xl w-full max-w-3xl max-h-[90vh] overflow-y-auto">
                        <div className="p-4 sm:p-6 border-b border-gray-200 flex justify-between items-start sticky top-0 bg-white">
                            <div>
                                <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Detalhes</h2>
                                <div className="text-sm text-gray-600 mt-2 space-y-1">
                                    <p>👤 {respostaSelecionada.nome}</p>
                                    <p>📱 {respostaSelecionada.whatsapp}</p>
                                    {respostaSelecionada.tipoEmpresa && <p>🏢 {respostaSelecionada.tipoEmpresa}</p>}
                                    <p>📅 {new Date(respostaSelecionada.dataInicio).toLocaleString('pt-BR')}</p>
                                </div>
                            </div>
                            <button onClick={() => setModalAberto(false)} className="text-gray-400 hover:text-gray-600 text-3xl leading-none">×</button>
                        </div>
                        <div className="p-4 sm:p-6 space-y-4">
                            {respostaSelecionada.respostas && respostaSelecionada.respostas.length > 0 ? (
                                respostaSelecionada.respostas.map((resposta: any, index: number) => (
                                    <div key={resposta.id} className="border-l-4 border-primary-200 pl-4">
                                        <p className="font-medium text-gray-900 mb-2 text-sm">
                                            {index + 1}. {resposta.pergunta.texto}
                                        </p>
                                        <p className="text-gray-700 text-sm">
                                            {getRespostaTexto(resposta, resposta.pergunta)}
                                        </p>
                                    </div>
                                ))
                            ) : (
                                <p className="text-gray-500 text-center py-4">Nenhuma resposta registrada</p>
                            )}
                        </div>
                        <div className="p-4 sm:p-6 border-t border-gray-200 bg-gray-50">
                            <button onClick={() => setModalAberto(false)} className="w-full px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition">
                                Fechar
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}
