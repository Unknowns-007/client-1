import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'
import { CalendarDays, ImageIcon } from 'lucide-react'

function EventCard({ item }) {
  const date = new Date(item.event_date || item.created_at)
  const month = date.toLocaleString('en-IN', { month: 'short' }).toUpperCase()
  const day = date.getDate()

  return (
    <div className="flex gap-4 sm:gap-6 group">
      {/* Timeline dot + line */}
      <div className="flex flex-col items-center">
        <div className="w-14 h-14 rounded-xl bg-tvk-red/10 border border-tvk-red/30 flex flex-col items-center justify-center shrink-0 group-hover:bg-tvk-red group-hover:border-tvk-red transition-all duration-300">
          <span className="text-xs font-bold text-tvk-red group-hover:text-white transition-colors leading-none">{month}</span>
          <span className="text-xl font-black text-white leading-none">{day}</span>
        </div>
        <div className="w-px flex-1 bg-border mt-2 min-h-[40px]" />
      </div>

      {/* Card */}
      <div className="card flex-1 mb-6 hover:-translate-y-1">
        {item.image_url && (
          <div className="rounded-lg overflow-hidden mb-4 h-48">
            <img
              src={item.image_url}
              alt={item.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
          </div>
        )}
        <h3 className="text-white font-bold text-lg mb-2">{item.title}</h3>
        {item.description && (
          <p className="text-gray-400 text-sm leading-relaxed">{item.description}</p>
        )}
      </div>
    </div>
  )
}

const MOCK_EVENTS = [
  { id: 1, title: 'Mega Blood Donation Drive', description: 'A massive blood donation drive organized by the TVK Royapuram youth wing. Over 500 units of blood were collected for government hospitals.', image_url: 'https://images.unsplash.com/photo-1615461066841-6116e61058f4?auto=format&fit=crop&q=80&w=800', event_date: '2024-02-15' },
  { id: 2, title: 'Free Medical Camp', description: 'Specialized doctors provided free checkups, eye testing, and medicines for the elderly and children in the constituency.', image_url: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&q=80&w=800', event_date: '2024-01-20' },
  { id: 3, title: 'Relief Materials Distribution', description: 'Distribution of essential groceries, blankets, and relief materials to families affected by recent heavy rains.', image_url: 'https://images.unsplash.com/photo-1593113589914-075568e09100?auto=format&fit=crop&q=80&w=800', event_date: '2023-12-10' }
]

export default function Events() {
  const [events, setEvents] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    supabase
      .from('events_blog')
      .select('*')
      .eq('type', 'event')
      .order('event_date', { ascending: false })
      .then(({ data, error }) => {
        if (error || !data || data.length === 0) {
          setEvents(MOCK_EVENTS)
        } else {
          setEvents(data)
        }
        setLoading(false)
      })
      .catch(() => {
        setEvents(MOCK_EVENTS)
        setLoading(false)
      })
  }, [])

  return (
    <div className="pt-24 pb-20 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="text-center mb-14">
        <div className="inline-flex items-center gap-2 bg-tvk-yellow/10 border border-tvk-yellow/30 rounded-full px-4 py-1.5 mb-4">
          <CalendarDays size={14} className="text-tvk-yellow" />
          <span className="text-tvk-yellow text-sm font-medium">Welfare Activities</span>
        </div>
        <h1 className="section-title">Events & Local Work</h1>
        <p className="section-subtitle mx-auto">
          A chronological record of completed welfare work and community events.
        </p>
      </div>

      {loading ? (
        <div className="space-y-6">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="flex gap-6 animate-pulse">
              <div className="w-14 h-14 bg-surface-3 rounded-xl shrink-0" />
              <div className="card flex-1">
                <div className="h-40 bg-surface-3 rounded-lg mb-4" />
                <div className="h-4 bg-surface-3 rounded w-2/3 mb-2" />
                <div className="h-3 bg-surface-3 rounded w-full" />
              </div>
            </div>
          ))}
        </div>
      ) : events.length === 0 ? (
        <div className="text-center py-20 text-gray-500">
          <ImageIcon size={48} className="mx-auto mb-4 opacity-30" />
          <p>No events posted yet. Check back soon!</p>
        </div>
      ) : (
        <div className="relative">
          {events.map(item => <EventCard key={item.id} item={item} />)}
        </div>
      )}
    </div>
  )
}
