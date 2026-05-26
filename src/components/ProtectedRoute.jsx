import { Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function ProtectedRoute({ children }) {
  const { user, loading } = useAuth()

  if (loading) {
    return (
      <div className="min-h-screen bg-surface flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 border-2 border-tvk-red border-t-transparent rounded-full animate-spin" />
          <p className="text-gray-400 text-sm">Authenticating...</p>
        </div>
      </div>
    )
  }

  if (!user) return <Navigate to="/login" replace />
  return children
}
