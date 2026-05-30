import { useAuth } from '../../context/AuthContext'
import ContentManagerView from './ContentManagerView'
import WelfareOfficerView from './WelfareOfficerView'
import { Flame, ShieldX } from 'lucide-react'

export default function AdminDashboard() {
  const { profile, loading } = useAuth()

  if (loading) {
    return (
      <div className="min-h-screen bg-[#faf7f0] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 border-2 border-tvk-red border-t-transparent rounded-full animate-spin" />
          <p className="text-gray-600 font-bold text-sm">Loading your dashboard...</p>
        </div>
      </div>
    )
  }

  if (!profile?.role) {
    return (
      <div className="min-h-screen bg-[#faf7f0] flex items-center justify-center px-4">
        <div className="text-center max-w-sm card bg-white">
          <div className="w-16 h-16 bg-tvk-red/5 border border-tvk-red/20 rounded-full flex items-center justify-center mx-auto mb-6">
            <ShieldX size={32} className="text-tvk-red" />
          </div>
          <h2 className="text-gray-800 font-black text-xl mb-2">No Role Assigned</h2>
          <p className="text-gray-600 font-medium text-sm mb-6">
            Your account exists but doesn't have a role yet. Please contact the TVK admin to assign your role in the <code className="bg-tvk-yellow/10 px-1.5 py-0.5 rounded text-tvk-yellow-dark text-xs font-bold border border-tvk-yellow/30">profiles</code> table.
          </p>
          <p className="text-gray-400 font-semibold text-xs">Logged in as: {profile?.email}</p>
        </div>
      </div>
    )
  }

  if (profile.role === 'content_manager') return <ContentManagerView />
  if (profile.role === 'welfare_officer') return <WelfareOfficerView />

  return (
    <div className="min-h-screen bg-[#faf7f0] flex items-center justify-center">
      <div className="text-center card bg-white">
        <Flame size={40} className="text-tvk-red mx-auto mb-4 animate-bounce" />
        <p className="text-gray-800 font-black text-xl">Unknown Role</p>
        <p className="text-gray-500 font-bold text-sm mt-2">Role "{profile.role}" is not recognized.</p>
      </div>
    </div>
  )
}
