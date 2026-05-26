import { useAuth } from '../../context/AuthContext'
import ContentManagerView from './ContentManagerView'
import WelfareOfficerView from './WelfareOfficerView'
import { Flame, ShieldX } from 'lucide-react'

export default function AdminDashboard() {
  const { profile, loading } = useAuth()

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 border-2 border-tvk-red border-t-transparent rounded-full animate-spin" />
          <p className="text-gray-400 text-sm">Loading your dashboard...</p>
        </div>
      </div>
    )
  }

  if (!profile?.role) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center px-4">
        <div className="text-center max-w-sm">
          <div className="w-16 h-16 bg-tvk-red/10 border border-tvk-red/30 rounded-full flex items-center justify-center mx-auto mb-6">
            <ShieldX size={32} className="text-tvk-red" />
          </div>
          <h2 className="text-white font-bold text-xl mb-2">No Role Assigned</h2>
          <p className="text-gray-400 text-sm mb-6">
            Your account exists but doesn't have a role yet. Please contact the TVK admin to assign your role in the <code className="bg-surface-3 px-1.5 py-0.5 rounded text-tvk-yellow text-xs">profiles</code> table.
          </p>
          <p className="text-gray-600 text-xs">Logged in as: {profile?.email}</p>
        </div>
      </div>
    )
  }

  if (profile.role === 'content_manager') return <ContentManagerView />
  if (profile.role === 'welfare_officer') return <WelfareOfficerView />

  return (
    <div className="min-h-screen bg-black flex items-center justify-center">
      <div className="text-center">
        <Flame size={40} className="text-tvk-red mx-auto mb-4" />
        <p className="text-white font-bold text-xl">Unknown Role</p>
        <p className="text-gray-500 text-sm mt-2">Role "{profile.role}" is not recognized.</p>
      </div>
    </div>
  )
}
