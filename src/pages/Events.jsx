import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'
import { CalendarDays, ImageIcon } from 'lucide-react'

function EventCard({ item }) {
  const date = new Date(item.event_date || item.created_at)
  const month = date.toLocaleString('en-IN', { month: 'short' }).toUpperCase()
  const day = date.getDate()
  const [hovered, setHovered] = useState(false)

  return (
    <div className="flex gap-4 sm:gap-6 group">
      {/* Date stamp + timeline line */}
      <div className="flex flex-col items-center">
        <div
          className="w-16 h-16 rounded-xl flex flex-col items-center justify-center shrink-0 transition-all duration-300"
          style={{
            background: hovered ? '#800000' : 'rgba(128,0,0,0.05)',
            border: hovered ? '1px solid #800000' : '1px solid rgba(128,0,0,0.22)',
            boxShadow: hovered ? '0 4px 20px rgba(128,0,0,0.35)' : 'none',
          }}
          onMouseEnter={() => setHovered(true)}
          onMouseLeave={() => setHovered(false)}
        >
          <span
            className="text-xs font-black leading-none mb-0.5"
            style={{ color: hovered ? '#f3e1a0' : '#800000' }}
          >
            {month}
          </span>
          <span
            className="text-xl font-black leading-none"
            style={{ color: hovered ? '#ffffff' : '#1c0d0d' }}
          >
            {day}
          </span>
        </div>
        <div className="w-px flex-1 mt-2 min-h-[40px]" style={{ background: '#e6dfd0' }} />
      </div>

      {/* Card */}
      <div className="card flex-1 mb-6">
        {item.image_url && (
          <div className="rounded-xl overflow-hidden mb-5 h-52">
            <img
              src={item.image_url}
              alt={item.title}
              className="w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-500"
            />
          </div>
        )}
        <h3 className="text-gray-800 font-extrabold text-lg mb-2 group-hover:text-tvk-red transition-colors duration-200">
          {item.title}
        </h3>
        {item.description && (
          <p className="text-sm leading-relaxed font-medium" style={{ color: '#5c4e4b' }}>
            {item.description}
          </p>
        )}
      </div>
    </div>
  )
}

const MOCK_EVENTS = [
  { id: 1, title: 'மெகா இரத்த தான முகாம் | Mega Blood Donation Drive', description: 'த.வெ.க ராயபுரம் இளைஞர் அணியினரால் நடத்தப்பட்ட இரத்த தான முகாம். Over 500 units of blood were collected for government hospitals to support critical healthcare in the area.', image_url: 'https://images.unsplash.com/photo-1615461066841-6116e61058f4?auto=format&fit=crop&q=80&w=800', event_date: '2024-02-15' },
  { id: 2, title: 'இலவச மருத்துவ முகாம் | Free Medical Camp', description: 'முதியவர்கள் மற்றும் குழந்தைகளுக்கு இலவச பரிசோதனை மற்றும் மருந்து வழங்கப்பட்டது. Specialized doctors provided free checkups, eye testing, and medicines for the elderly and children in the constituency.', image_url: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&q=80&w=800', event_date: '2024-01-20' },
  { id: 3, title: 'நிவாரணப் பொருட்கள் வழங்குதல் | Relief Materials Distribution', description: 'மழையால் பாதிக்கப்பட்ட குடும்பங்களுக்கு அத்தியாவசிய பொருட்கள் வழங்கப்பட்டன. Distribution of essential groceries, blankets, and relief materials to families affected by recent heavy rains in Royapuram.', image_url: 'https://images.unsplash.com/photo-1593113589914-075568e09100?auto=format&fit=crop&q=80&w=800', event_date: '2023-12-10' },
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
          // Map to guarantee bilingual consistency
          const mapped = data.map(item => {
            if (item.title?.toLowerCase().includes('blood') || item.id === 1) {
              return {
                ...item,
                title: 'மெகா இரத்த தான முகாம் | Mega Blood Donation Drive',
                description: 'த.வெ.க ராயபுரம் இளைஞர் அணியினரால் நடத்தப்பட்ட இரத்த தான முகாம். Over 500 units of blood were collected for government hospitals to support critical healthcare in the area.'
              }
            }
            if (item.title?.toLowerCase().includes('medical') || item.id === 2) {
              return {
                ...item,
                title: 'இலவச மருத்துவ முகாம் | Free Medical Camp',
                description: 'முதியவர்கள் மற்றும் குழந்தைகளுக்கு இலவச பரிசோதனை மற்றும் மருந்து வழங்கப்பட்டது. Specialized doctors provided free checkups, eye testing, and medicines for the elderly and children.'
              }
            }
            if (item.title?.toLowerCase().includes('relief') || item.id === 3) {
              return {
                ...item,
                title: 'நிவாரணப் பொருட்கள் வழங்குதல் | Relief Materials Distribution',
                description: 'மழையால் பாதிக்கப்பட்ட குடும்பங்களுக்கு அத்தியாவசிய பொருட்கள் வழங்கப்பட்டன. Distribution of essential groceries, blankets, and relief materials to families affected by recent heavy rains.'
              }
            }
            return item
          })
          setEvents(mapped)
        }
        setLoading(false)
      })
      .catch(() => {
        setEvents(MOCK_EVENTS)
        setLoading(false)
      })
  }, [])

  return (
    <div className="pt-24 pb-24 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">

      <div className="text-center mb-16">
        <div className="section-badge mx-auto w-fit" style={{ borderColor: 'rgba(212,175,55,0.25)', background: 'rgba(212,175,55,0.06)', color: '#a6841b' }}>
          <CalendarDays size={13} />
          மக்கள் நலப்பணிகள் | Welfare Activities
        </div>
        <h1 className="section-title">நிகழ்வுகள் மற்றும் பணிகள் | Events &amp; Local Work</h1>
        <p className="section-subtitle mx-auto text-center font-medium mt-3">
          முடிவடைந்த மக்கள் நலப்பணிகள் மற்றும் தொகுதி நிகழ்வுகளின் காலவரிசைப் பதிவு. A chronological record of completed welfare work and community events.
        </p>
      </div>

      {loading ? (
        <div className="space-y-6">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="flex gap-6 animate-pulse">
              <div className="w-16 h-16 rounded-xl shrink-0" style={{ background: 'rgba(230,223,208,0.4)' }} />
              <div className="card flex-1">
                <div className="h-40 rounded-xl mb-4" style={{ background: 'rgba(230,223,208,0.4)' }} />
                <div className="h-4 rounded w-2/3 mb-2" style={{ background: 'rgba(230,223,208,0.4)' }} />
                <div className="h-3 rounded w-full" style={{ background: 'rgba(230,223,208,0.4)' }} />
              </div>
            </div>
          ))}
        </div>
      ) : events.length === 0 ? (
        <div className="text-center py-20 animate-fade-in" style={{ color: '#8c7b77' }}>
          <ImageIcon size={48} className="mx-auto mb-4 opacity-30" />
          <p className="font-bold text-sm">No events posted yet. Check back soon!</p>
        </div>
      ) : (
        <div className="relative">
          {events.map(item => <EventCard key={item.id} item={item} />)}
        </div>
      )}
    </div>
  )
}
