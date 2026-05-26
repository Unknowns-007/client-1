import { useEffect, useState } from 'react'
import { supabase } from '../../lib/supabase'
import { useAuth } from '../../context/AuthContext'
import toast from 'react-hot-toast'
import {
  Flame, LogOut, LayoutDashboard, Droplets, AlertTriangle,
  CheckCircle, Clock, Phone, User, RefreshCw, Save
} from 'lucide-react'

const BLOOD_GROUPS = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-']

// ─── Grievances Table ─────────────────────────────────────────
function GrievancesPanel() {
  const [grievances, setGrievances] = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('all') // 'all' | 'pending' | 'accepted'
  const [updating, setUpdating] = useState(null)

  const fetchGrievances = async () => {
    setLoading(true)
    let query = supabase
      .from('grievances')
      .select('*')
      .order('created_at', { ascending: false })

    if (filter !== 'all') query = query.eq('status', filter)

    const { data } = await query
    setGrievances(data || [])
    setLoading(false)
  }

  useEffect(() => { fetchGrievances() }, [filter])

  const handleAccept = async (grievance) => {
    setUpdating(grievance.id)
    const { error } = await supabase
      .from('grievances')
      .update({ status: 'accepted' })
      .eq('id', grievance.id)
    if (error) toast.error('Failed to update status')
    else {
      toast.success(`Issue accepted — ${grievance.citizen_name} will be notified`)
      fetchGrievances()
    }
    setUpdating(null)
  }

  const counts = {
    total: grievances.length,
    pending: grievances.filter(g => g.status === 'pending').length,
    accepted: grievances.filter(g => g.status === 'accepted').length,
  }

  return (
    <div>
      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        {[
          { label: 'Total Issues', value: counts.total, color: 'text-white' },
          { label: 'Pending', value: counts.pending, color: 'text-tvk-yellow' },
          { label: 'Accepted', value: counts.accepted, color: 'text-green-400' },
        ].map(({ label, value, color }) => (
          <div key={label} className="card text-center py-4">
            <p className={`text-3xl font-black ${color}`}>{value}</p>
            <p className="text-gray-500 text-xs mt-1">{label}</p>
          </div>
        ))}
      </div>

      {/* Filter Tabs + Refresh */}
      <div className="flex items-center justify-between mb-5">
        <div className="flex gap-2 bg-surface-2 border border-border rounded-xl p-1">
          {['all', 'pending', 'accepted'].map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-1.5 rounded-lg text-sm font-medium capitalize transition-all ${
                filter === f ? 'bg-tvk-red text-white' : 'text-gray-400 hover:text-white'
              }`}
            >
              {f}
            </button>
          ))}
        </div>
        <button onClick={fetchGrievances} className="text-gray-500 hover:text-white transition-colors">
          <RefreshCw size={16} />
        </button>
      </div>

      {/* Table */}
      {loading ? (
        <div className="space-y-3">
          {[...Array(4)].map((_, i) => <div key={i} className="h-20 bg-surface-3 rounded-xl animate-pulse" />)}
        </div>
      ) : grievances.length === 0 ? (
        <div className="text-center py-16 text-gray-500 border border-dashed border-border rounded-xl">
          <AlertTriangle size={32} className="mx-auto mb-3 opacity-30" />
          <p className="text-sm">No {filter === 'all' ? '' : filter} grievances found.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {grievances.map(g => (
            <div
              key={g.id}
              className={`bg-surface-2 border rounded-xl p-4 transition-colors ${
                g.status === 'pending' ? 'border-tvk-yellow/20 hover:border-tvk-yellow/40' : 'border-green-700/20'
              }`}
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 mb-2 flex-wrap">
                    <div className="flex items-center gap-1.5 text-white font-semibold">
                      <User size={14} className="text-gray-400" />
                      {g.citizen_name}
                    </div>
                    <div className="flex items-center gap-1.5 text-gray-400 text-sm">
                      <Phone size={12} />
                      {g.phone_number}
                    </div>
                    <span className="bg-surface-3 text-gray-300 text-xs px-2 py-0.5 rounded-full border border-border">
                      {g.issue_type}
                    </span>
                    {g.status === 'pending'
                      ? <span className="badge-pending flex items-center gap-1"><Clock size={10} /> Pending</span>
                      : <span className="badge-accepted flex items-center gap-1"><CheckCircle size={10} /> Accepted</span>
                    }
                  </div>
                  <p className="text-gray-400 text-sm leading-relaxed line-clamp-2">{g.description}</p>
                  <p className="text-gray-600 text-xs mt-2">
                    {new Date(g.created_at).toLocaleString('en-IN')}
                  </p>
                </div>

                {g.status === 'pending' && (
                  <button
                    onClick={() => handleAccept(g)}
                    disabled={updating === g.id}
                    className="btn-yellow shrink-0 text-sm py-2 px-4"
                    title="Accept this grievance"
                  >
                    {updating === g.id
                      ? <span className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin" />
                      : <><CheckCircle size={15} /> Accept</>
                    }
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

// ─── Blood Inventory Manager ──────────────────────────────────
function BloodInventoryPanel() {
  const [inventory, setInventory] = useState([])
  const [loading, setLoading] = useState(true)
  const [edits, setEdits] = useState({})
  const [saving, setSaving] = useState(null)

  const fetchInventory = async () => {
    const { data } = await supabase.from('blood_inventory').select('*').order('blood_group')
    setInventory(data || [])
    const defaults = {}
    data?.forEach(item => { defaults[item.blood_group] = item.units_available })
    setEdits(defaults)
    setLoading(false)
  }

  useEffect(() => { fetchInventory() }, [])

  const handleUpdate = async (group) => {
    const units = parseInt(edits[group])
    if (isNaN(units) || units < 0) { toast.error('Units must be 0 or more'); return }
    setSaving(group)
    const { error } = await supabase
      .from('blood_inventory')
      .update({ units_available: units })
      .eq('blood_group', group)
    if (error) toast.error('Update failed')
    else { toast.success(`${group} updated to ${units} units`); fetchInventory() }
    setSaving(null)
  }

  return (
    <div>
      <div className="flex items-center gap-2 mb-6">
        <Droplets size={18} className="text-red-400" />
        <h2 className="text-white font-bold text-xl">Blood Inventory</h2>
        <span className="text-gray-500 text-sm ml-2">— Update unit counts manually</span>
      </div>

      {loading ? (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[...Array(8)].map((_, i) => <div key={i} className="h-32 bg-surface-3 rounded-xl animate-pulse" />)}
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {inventory.map(item => (
            <div key={item.id} className="card flex flex-col items-center gap-3 text-center">
              <div className="w-12 h-12 bg-tvk-red/10 border border-tvk-red/30 rounded-full flex items-center justify-center">
                <Droplets size={20} className="text-tvk-red" />
              </div>
              <p className="text-white font-black text-2xl">{item.blood_group}</p>
              <input
                type="number"
                min={0}
                value={edits[item.blood_group] ?? item.units_available}
                onChange={e => setEdits({ ...edits, [item.blood_group]: e.target.value })}
                className="form-input text-center text-lg font-bold w-full py-2"
              />
              <button
                onClick={() => handleUpdate(item.blood_group)}
                disabled={saving === item.blood_group}
                className="btn-primary text-xs py-2 px-4 w-full justify-center"
              >
                {saving === item.blood_group
                  ? <span className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  : <><Save size={13} /> Update</>
                }
              </button>
              <p className="text-gray-600 text-xs">
                Updated {new Date(item.updated_at).toLocaleDateString('en-IN')}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

// ─── Main Welfare Officer View ────────────────────────────────
const TABS = [
  { id: 'grievances', label: 'Grievances', icon: AlertTriangle },
  { id: 'blood', label: 'Blood Inventory', icon: Droplets },
]

export default function WelfareOfficerView() {
  const [activeTab, setActiveTab] = useState('grievances')
  const { profile, signOut } = useAuth()

  return (
    <div className="min-h-screen bg-black">
      {/* Top Bar */}
      <header className="bg-surface-2 border-b border-border sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-16">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-gradient-to-br from-tvk-red to-tvk-yellow rounded-lg flex items-center justify-center">
              <Flame size={18} className="text-white" />
            </div>
            <div>
              <p className="text-white font-bold text-sm leading-none">Welfare Officer</p>
              <p className="text-gray-500 text-xs mt-0.5">{profile?.email}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <a href="/" target="_blank" className="text-gray-400 hover:text-white text-sm transition-colors flex items-center gap-1.5">
              <LayoutDashboard size={14} /> View Site
            </a>
            <button onClick={signOut} className="text-gray-400 hover:text-tvk-red transition-colors flex items-center gap-1.5 text-sm">
              <LogOut size={14} /> Sign Out
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Tab Nav */}
        <div className="flex gap-2 mb-8 bg-surface-2 border border-border rounded-xl p-1.5 w-fit">
          {TABS.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setActiveTab(id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                activeTab === id
                  ? 'bg-tvk-red text-white shadow-lg'
                  : 'text-gray-400 hover:text-white hover:bg-surface-3'
              }`}
            >
              <Icon size={15} /> {label}
            </button>
          ))}
        </div>

        {activeTab === 'grievances' && <GrievancesPanel />}
        {activeTab === 'blood' && <BloodInventoryPanel />}
      </div>
    </div>
  )
}
