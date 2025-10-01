/**
 * Register Page - ENROLATION HUB
 * Simple registration: username + password only
 */

'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function RegisterPage() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()
  const supabase = createClient()

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    // Validate passwords match
    if (password !== confirmPassword) {
      setError('>> ERRO: Senhas não coincidem')
      setLoading(false)
      return
    }

    // Validate password length
    if (password.length < 6) {
      setError('>> ERRO: Senha deve ter pelo menos 6 caracteres')
      setLoading(false)
      return
    }

    // Validate username
    if (username.length < 3) {
      setError('>> ERRO: Username deve ter pelo menos 3 caracteres')
      setLoading(false)
      return
    }

    try {
      // Generate fake email from username (Supabase requires email)
      const fakeEmail = `${username.toLowerCase().replace(/\s/g, '_')}@enrolationhub.local`

      // Create auth user with fake email
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: fakeEmail,
        password,
        options: {
          data: {
            username,
            display_name: username,
          },
          emailRedirectTo: undefined, // Disable email confirmation
        },
      })

      if (authError) {
        // Check if username already exists
        if (authError.message.includes('already registered')) {
          throw new Error('>> ERRO: Username já existe. Escolha outro.')
        }
        throw authError
      }

      if (authData.user) {
        // Update profile with username
        const { error: profileError } = await supabase
          .from('profiles')
          .update({ username })
          .eq('id', authData.user.id)

        if (profileError) {
          console.error('Profile update error:', profileError)
        }

        // Auto login and redirect
        router.push('/dashboard')
        router.refresh()
      }
    } catch (err) {
      const error = err as Error
      setError(error.message || '>> ERRO: Falha ao criar conta')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-retro-dark via-retro-darker to-black flex items-center justify-center px-4 relative overflow-hidden">
      {/* Retro Grid Background */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,0,255,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(0,255,255,0.1)_1px,transparent_1px)] bg-[size:50px_50px]"></div>

      <div className="max-w-md w-full bg-retro-darker rounded-none shadow-2xl border-4 border-retro-magenta relative z-10">
        {/* Glowing borders effect */}
        <div className="absolute -inset-1 bg-gradient-to-r from-retro-magenta via-retro-cyan to-retro-magenta opacity-30 blur-lg"></div>

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
              &gt; CRIAR NOVA CONTA_
            </p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-4 p-4 bg-retro-red/20 border-2 border-retro-red text-retro-red text-sm font-mono">
              {error}
            </div>
          )}

          {/* Register Form */}
          <form onSubmit={handleRegister} className="space-y-6">
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
                className="w-full px-4 py-3 bg-retro-dark border-2 border-retro-magenta text-beige-100 font-mono focus:outline-none focus:border-retro-cyan focus:shadow-lg focus:shadow-retro-cyan/50 transition-all"
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
                className="w-full px-4 py-3 bg-retro-dark border-2 border-retro-magenta text-beige-100 font-mono focus:outline-none focus:border-retro-cyan focus:shadow-lg focus:shadow-retro-cyan/50 transition-all"
                placeholder="••••••••"
              />
            </div>

            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-bold text-retro-cyan mb-2 font-mono">
                &gt; CONFIRM PASSWORD
              </label>
              <input
                id="confirmPassword"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                className="w-full px-4 py-3 bg-retro-dark border-2 border-retro-magenta text-beige-100 font-mono focus:outline-none focus:border-retro-cyan focus:shadow-lg focus:shadow-retro-cyan/50 transition-all"
                placeholder="••••••••"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-retro-magenta to-retro-cyan text-retro-darker font-bold py-3 px-4 font-mono text-lg hover:from-retro-cyan hover:to-retro-magenta transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed border-2 border-retro-cyan shadow-lg shadow-retro-magenta/50 hover:shadow-retro-cyan/50"
            >
              {loading ? '&gt; PROCESSANDO...' : '&gt; CRIAR CONTA'}
            </button>
          </form>

          {/* Login Link */}
          <div className="mt-6 text-center">
            <p className="text-beige-400 font-mono text-sm">
              &gt; JÁ TEM CONTA?{' '}
              <Link href="/login" className="text-retro-cyan hover:text-retro-magenta font-bold transition-colors">
                [LOGIN]
              </Link>
            </p>
          </div>

          {/* Retro Footer */}
          <div className="mt-8 pt-4 border-t-2 border-retro-green/30">
            <p className="text-xs text-retro-green text-center font-mono">
              v1.0.0 | SYSTEM ONLINE | NO EMAIL REQUIRED
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
