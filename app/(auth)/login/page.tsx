/**
 * Login Page - ENROLATION HUB
 * Simple login: username + password only
 */

'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function LoginPage() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()
  const supabase = createClient()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      // Convert username to fake email
      const fakeEmail = `${username.toLowerCase().replace(/\s/g, '_')}@enrolationhub.local`

      const { error } = await supabase.auth.signInWithPassword({
        email: fakeEmail,
        password,
      })

      if (error) {
        if (error.message.includes('Invalid login credentials')) {
          throw new Error('>> ERRO: Username ou senha incorretos')
        }
        throw error
      }

      router.push('/dashboard')
      router.refresh()
    } catch (err) {
      const error = err as Error
      setError(error.message || '>> ERRO: Falha ao fazer login')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-retro-dark via-retro-darker to-black flex items-center justify-center px-4 relative overflow-hidden">
      {/* Retro Grid Background */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,0,255,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(0,255,255,0.1)_1px,transparent_1px)] bg-[size:50px_50px]"></div>

      <div className="max-w-md w-full bg-retro-darker rounded-none shadow-2xl border-4 border-retro-cyan relative z-10">
        {/* Glowing borders effect */}
        <div className="absolute -inset-1 bg-gradient-to-r from-retro-cyan via-retro-green to-retro-cyan opacity-30 blur-lg"></div>

        <div className="relative bg-retro-darker p-8">
          {/* Logo */}
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold tracking-wider font-mono mb-2">
              <span className="text-retro-magenta rgb-shadow">ENROLATION</span>
            </h1>
            <h2 className="text-2xl font-bold text-retro-cyan font-mono mb-4">
              /// HUB
            </h2>
            <div className="h-1 w-32 mx-auto bg-gradient-to-r from-transparent via-retro-green to-transparent"></div>
            <p className="text-retro-green mt-4 font-mono text-sm">
              &gt; ACESSO AO SISTEMA_
            </p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-4 p-4 bg-retro-red/20 border-2 border-retro-red text-retro-red text-sm font-mono">
              {error}
            </div>
          )}

          {/* Login Form */}
          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label htmlFor="username" className="block text-sm font-bold text-retro-cyan mb-2 font-mono">
                &gt; USERNAME
              </label>
              <input
                id="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                className="w-full px-4 py-3 bg-retro-dark border-2 border-retro-cyan text-beige-100 font-mono focus:outline-none focus:border-retro-green focus:shadow-lg focus:shadow-retro-green/50 transition-all"
                placeholder="SEU_NOME"
                autoComplete="off"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-bold text-retro-cyan mb-2 font-mono">
                &gt; PASSWORD
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full px-4 py-3 bg-retro-dark border-2 border-retro-cyan text-beige-100 font-mono focus:outline-none focus:border-retro-green focus:shadow-lg focus:shadow-retro-green/50 transition-all"
                placeholder="••••••••"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-retro-cyan to-retro-green text-retro-darker font-bold py-3 px-4 font-mono text-lg hover:from-retro-green hover:to-retro-cyan transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed border-2 border-retro-green shadow-lg shadow-retro-cyan/50 hover:shadow-retro-green/50"
            >
              {loading ? '&gt; CONECTANDO...' : '&gt; ENTRAR'}
            </button>
          </form>

          {/* Register Link */}
          <div className="mt-6 text-center">
            <p className="text-beige-400 font-mono text-sm">
              &gt; NOVO USUÁRIO?{' '}
              <Link href="/register" className="text-retro-cyan hover:text-retro-green font-bold transition-colors">
                [CRIAR CONTA]
              </Link>
            </p>
          </div>

          {/* Retro Footer */}
          <div className="mt-8 pt-4 border-t-2 border-retro-cyan/30">
            <p className="text-xs text-retro-cyan text-center font-mono">
              v1.0.0 | ENROLATION HUB | READY_
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
