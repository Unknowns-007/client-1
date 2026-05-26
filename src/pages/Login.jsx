import { useState } from 'react'
import { Navigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import toast from 'react-hot-toast'
import { Flame, Lock, Mail, Eye, EyeOff } from 'lucide-react'

export default function Login() {
  const { user, signIn, loading } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPass, setShowPass] = useState(false)
  const [submitting, setSubmitting] = useState(false)

  if (!loading && user) return <Navigate to="/admin" replace />

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSubmitting(true)
    const { error } = await signIn(email, password)
    setSubmitting(false)
    if (error) toast.error(error.message || 'Login failed')
    else toast.success('Logged in successfully')
  }

  return (
    <div className="min-h-screen bg-black flex items-center justify-center px-4 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(220,38,38,0.12),transparent_70%)]" />

      <div className="w-full max-w-md relative z-10">
        {/* Logo */}
        <div className="text-center mb-10">
          <div className="inline-flex w-16 h-16 bg-gradient-to-br from-tvk-red to-tvk-yellow rounded-2xl items-center justify-center mb-4 shadow-2xl shadow-tvk-red/30">
            <Flame size={30} className="text-white" />
          </div>
          <h1 className="text-2xl font-bold text-white">TVK Staff Portal</h1>
          <p className="text-gray-500 text-sm mt-1">Sign in to access the administrative dashboard</p>
        </div>

        <form onSubmit={handleSubmit} className="card space-y-5">
          {/* Email */}
          <div>
            <label htmlFor="login-email" className="form-label">
              <Mail size={13} className="inline mr-1.5 text-tvk-red" />
              Email Address
            </label>
            <input
              id="login-email"
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="worker@tvk.in"
              className="form-input"
              required
              autoComplete="email"
            />
          </div>

          {/* Password */}
          <div>
            <label htmlFor="login-password" className="form-label">
              <Lock size={13} className="inline mr-1.5 text-tvk-red" />
              Password
            </label>
            <div className="relative">
              <input
                id="login-password"
                type={showPass ? 'text' : 'password'}
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="••••••••"
                className="form-input pr-12"
                required
                autoComplete="current-password"
              />
              <button
                type="button"
                onClick={() => setShowPass(!showPass)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300 transition-colors"
              >
                {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          <button
            id="login-submit"
            type="submit"
            disabled={submitting}
            className="btn-primary w-full justify-center py-3.5 text-base"
          >
            {submitting ? (
              <>
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Signing in...
              </>
            ) : 'Sign In'}
          </button>
        </form>

        <p className="text-center text-gray-600 text-xs mt-6">
          Access is restricted to authorized TVK party workers only.
        </p>
      </div>
    </div>
  )
}
