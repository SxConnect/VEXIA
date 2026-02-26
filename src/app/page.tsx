import Link from 'next/link'

export default function Home() {
    return (
        <main className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
            <div className="text-center">
                <h1 className="text-5xl font-bold text-gray-900 mb-4">
                    VEXIA
                </h1>
                <p className="text-lg text-gray-600 mb-2">
                    Validation Experience eXecution Intelligence Automation
                </p>
                <p className="text-md text-gray-500 mb-8">
                    Sistema profissional de questionários inteligentes
                </p>
                <div className="space-x-4">
                    <Link
                        href="/auth/login"
                        className="inline-block px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition"
                    >
                        Entrar
                    </Link>
                    <Link
                        href="/auth/register"
                        className="inline-block px-6 py-3 bg-white text-primary-600 border border-primary-600 rounded-lg hover:bg-primary-50 transition"
                    >
                        Cadastrar
                    </Link>
                </div>
            </div>
        </main>
    )
}
