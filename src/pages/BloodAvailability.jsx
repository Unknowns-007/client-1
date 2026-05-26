import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'
import { Droplets, RefreshCw, Clock } from 'lucide-react'

const bloodColors = {
  'A+':  { bg: 'bg-red-900/20',    border: 'border-red-700/30',    text: 'text-red-400',    dot: 'bg-red-400' },
  'A-':  { bg: 'bg-rose-900/20',   border: 'border-rose-700/30',   text: 'text-rose-400',   dot: 'bg-rose-400' },
  'B+':  { bg: 'bg-orange-900/20', border: 'border-orange-700/30', text: 'text-orange-400', dot: 'bg-orange-400' },
  'B-':  { bg: 'bg-amber-900/20',  border: 'border-amber-700/30',  text: 'text-amber-400',  dot: 'bg-amber-400' },
  'AB+': { bg: 'bg-purple-900/20', border: 'border-purple-700/30', text: 'text-purple-400', dot: 'bg-purple-400' },
  'AB-': { bg: 'bg-violet-900/20', border: 'border-violet-700/30', text: 'text-violet-400', dot: 'bg-violet-400' },
  'O+':  { bg: 'bg-green-900/20',  border: 'border-green-700/30',  text: 'text-green-400',  dot: 'bg-green-400' },
  'O-':  { bg: 'bg-teal-900/20',   border: 'border-teal-700/30',   text: 'text-teal-400',   dot: 'bg-teal-400' },
}

function BloodGroupCard({ item }) {
  const style = bloodColors[item.blood_group] || bloodColors['A+']
  const units = item.units_available
  const status = units === 0 ? 'Out of Stock' : units < 5 ? 'Low Stock' : 'Available'
  const statusColor = units === 0 ? 'text-red-400' : units < 5 ? 'text-yellow-400' : 'text-green-400'

  return (
    <div className={`${style.bg} border ${style.border} rounded-xl p-6 flex flex-col items-center gap-4 hover:scale-[1.03] transition-all duration-300`}>
      <div className={`w-16 h-16 rounded-full ${style.bg} border-2 ${style.border} flex items-center justify-center`}>
        <Droplets size={28} className={style.text} />
      </div>

      <div className="text-center">
        <p className={`text-4xl font-black ${style.text}`}>{item.blood_group}</p>
      </div>

      <div className="text-center">
        <p className="text-5xl font-black text-white">{units}</p>
        <p className="text-gray-400 text-sm mt-1">units available</p>
      </div>

      <div className="flex items-center gap-2">
        <div className={`w-2 h-2 rounded-full ${style.dot} ${units > 0 ? 'animate-pulse' : ''}`} />
        <span className={`text-xs font-medium ${statusColor}`}>{status}</span>
      </div>
    </div>
  )
}

const MOCK_BLOOD = [
  { id: 1, blood_group: 'A+', units_available: 12 },
  { id: 2, blood_group: 'A-', units_available: 3 },
  { id: 3, blood_group: 'B+', units_available: 24 },
  { id: 4, blood_group: 'B-', units_available: 0 },
  { id: 5, blood_group: 'AB+', units_available: 8 },
  { id: 6, blood_group: 'AB-', units_available: 1 },
  { id: 7, blood_group: 'O+', units_available: 35 },
  { id: 8, blood_group: 'O-', units_available: 5 },
]

export default function BloodAvailability() {
  const [inventory, setInventory] = useState([])
  const [loading, setLoading] = useState(true)
  const [lastUpdated, setLastUpdated] = useState(null)
  const [refreshing, setRefreshing] = useState(false)

  const fetchInventory = async () => {
    setRefreshing(true)
    const { data } = await supabase
      .from('blood_inventory')
      .select('*')
      .order('blood_group')
    if (data && data.length > 0) {
      setInventory(data)
    } else {
      setInventory(MOCK_BLOOD)
    }
    setLastUpdated(new Date())
    setRefreshing(false)
    setLoading(false)
  }

  useEffect(() => {
    fetchInventory()

    // Real-time subscription
    const channel = supabase
      .channel('blood_inventory_changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'blood_inventory' }, fetchInventory)
      .subscribe()

    return () => supabase.removeChannel(channel)
  }, [])

  return (
    <div className="pt-24 pb-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="text-center mb-4">
        <div className="inline-flex items-center gap-2 bg-red-900/20 border border-red-700/30 rounded-full px-4 py-1.5 mb-4">
          <Droplets size={14} className="text-red-400" />
          <span className="text-red-400 text-sm font-medium">Live Inventory</span>
        </div>
        <h1 className="section-title">Blood Availability</h1>
        <p className="section-subtitle mx-auto">
          Real-time blood unit tracking managed by our local TVK welfare office.
        </p>
      </div>

      {/* Last updated + Refresh */}
      <div className="flex items-center justify-center gap-4 mb-12">
        {lastUpdated && (
          <p className="text-gray-500 text-sm flex items-center gap-1.5">
            <Clock size={12} />
            Updated {lastUpdated.toLocaleTimeString('en-IN')}
          </p>
        )}
        <button
          onClick={fetchInventory}
          disabled={refreshing}
          className="text-tvk-red hover:text-tvk-yellow text-sm flex items-center gap-1.5 transition-colors"
        >
          <RefreshCw size={13} className={refreshing ? 'animate-spin' : ''} />
          Refresh
        </button>
      </div>

      {loading ? (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="bg-surface-2 border border-border rounded-xl p-6 animate-pulse h-48" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 lg:gap-6">
          {inventory.map(item => <BloodGroupCard key={item.id} item={item} />)}
        </div>
      )}

      {/* Donate CTA */}
      <div className="mt-16 text-center bg-gradient-to-r from-tvk-red/10 via-transparent to-tvk-red/10 border border-tvk-red/20 rounded-2xl p-10">
        <Droplets size={40} className="text-tvk-red mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-white mb-3">Want to Donate Blood?</h2>
        <p className="text-gray-400 mb-6 max-w-md mx-auto">
          Contact the TVK welfare office to schedule your blood donation. Every drop saves a life.
        </p>
        <a
          href="tel:+910000000000"
          className="btn-primary"
        >
          Call Welfare Office
        </a>
      </div>
    </div>
  )
}
