import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'
import { Phone, Mail, MapPin, Users } from 'lucide-react'

function LeaderCard({ leader }) {
  const contact = leader.contact_details || {}
  return (
    <div className="card group flex flex-col items-center text-center hover:border-tvk-yellow/40 hover:-translate-y-1 transition-all duration-300">
      <div className="relative mb-5">
        <div className="w-24 h-24 rounded-full overflow-hidden ring-4 ring-tvk-red/30 group-hover:ring-tvk-yellow/50 transition-all">
          {leader.photo_url ? (
            <img src={leader.photo_url} alt={leader.name} className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-tvk-red to-tvk-yellow flex items-center justify-center">
              <Users size={32} className="text-white" />
            </div>
          )}
        </div>
        <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-5 h-5 bg-tvk-red rounded-full border-2 border-black" />
      </div>

      <h3 className="text-white font-bold text-lg">{leader.name}</h3>
      <p className="text-tvk-yellow text-sm font-medium mt-1">{leader.designation}</p>

      <div className="mt-4 w-full space-y-2 text-left">
        {contact.phone && (
          <a href={`tel:${contact.phone}`} className="flex items-center gap-2 text-gray-400 hover:text-white text-sm transition-colors">
            <Phone size={14} className="text-tvk-red shrink-0" />
            {contact.phone}
          </a>
        )}
        {contact.email && (
          <a href={`mailto:${contact.email}`} className="flex items-center gap-2 text-gray-400 hover:text-white text-sm transition-colors">
            <Mail size={14} className="text-tvk-red shrink-0" />
            {contact.email}
          </a>
        )}
        {contact.address && (
          <p className="flex items-start gap-2 text-gray-400 text-sm">
            <MapPin size={14} className="text-tvk-red shrink-0 mt-0.5" />
            {contact.address}
          </p>
        )}
      </div>
    </div>
  )
}

const MOCK_LEADERS = [
  { id: 1, name: 'Thalapathy Vijay', designation: 'Party President', photo_url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/cd/Vijay_at_the_Leo_Success_Meet.jpg/330px-Vijay_at_the_Leo_Success_Meet.jpg', contact_details: { phone: '+91 98765 43210', email: 'president@tvk.in', address: 'Panaiyur, Chennai' } },
  { id: 2, name: 'Bussy N. Anand', designation: 'General Secretary', photo_url: '', contact_details: { phone: '+91 98765 43211', email: 'gensec@tvk.in' } },
  { id: 3, name: 'Royapuram Secretary', designation: 'Constituency Head', photo_url: '', contact_details: { phone: '+91 98765 43212', email: 'royapuram@tvk.in', address: 'Royapuram, Chennai' } },
  { id: 4, name: 'Welfare Officer', designation: 'Ward Coordinator', photo_url: '', contact_details: { phone: '+91 98765 43213' } }
]

export default function About() {
  const [leaders, setLeaders] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    supabase
      .from('about_leads')
      .select('*')
      .order('display_order')
      .then(({ data, error }) => {
        if (error || !data || data.length === 0) {
          setLeaders(MOCK_LEADERS)
        } else {
          setLeaders(data)
        }
        setLoading(false)
      })
      .catch(() => {
        setLeaders(MOCK_LEADERS)
        setLoading(false)
      })
  }, [])

  return (
    <div className="pt-24 pb-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="text-center mb-14">
        <div className="inline-flex items-center gap-2 bg-tvk-red/10 border border-tvk-red/30 rounded-full px-4 py-1.5 mb-4">
          <Users size={14} className="text-tvk-red" />
          <span className="text-tvk-red text-sm font-medium">Constituency Leaders</span>
        </div>
        <h1 className="section-title">Meet Our Leaders</h1>
        <p className="section-subtitle mx-auto mt-3">
          Your elected and appointed representatives working tirelessly for this constituency.
        </p>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="card animate-pulse">
              <div className="w-24 h-24 rounded-full bg-surface-3 mx-auto mb-4" />
              <div className="h-4 bg-surface-3 rounded w-3/4 mx-auto mb-2" />
              <div className="h-3 bg-surface-3 rounded w-1/2 mx-auto" />
            </div>
          ))}
        </div>
      ) : leaders.length === 0 ? (
        <div className="text-center py-20 text-gray-500">
          <Users size={48} className="mx-auto mb-4 opacity-30" />
          <p>Leader profiles coming soon.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {leaders.map(leader => <LeaderCard key={leader.id} leader={leader} />)}
        </div>
      )}
    </div>
  )
}
