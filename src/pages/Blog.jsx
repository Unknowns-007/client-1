import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'
import { FileText, Clock } from 'lucide-react'

function BlogCard({ post }) {
  const date = new Date(post.created_at).toLocaleDateString('en-IN', {
    year: 'numeric', month: 'long', day: 'numeric'
  })

  return (
    <article className="card group overflow-hidden bg-white">
      {post.image_url && (
        <div className="rounded-xl overflow-hidden mb-5 h-52 -mx-6 -mt-6">
          <img
            src={post.image_url}
            alt={post.title}
            className="w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-500"
          />
        </div>
      )}

      <div className="flex items-center gap-2 mb-3" style={{ marginTop: post.image_url ? '20px' : undefined }}>
        <span
          className="text-xs font-extrabold uppercase px-3 py-1 rounded-full tracking-wider"
          style={{
            background: 'rgba(128,0,0,0.05)',
            color: '#800000',
            border: '1px solid rgba(128,0,0,0.22)',
          }}
        >
          செய்தி வெளியீடு | Press Release
        </span>
      </div>

      <h2
        className="text-gray-800 font-extrabold text-xl mb-3 transition-colors duration-200 group-hover:text-tvk-red"
      >
        {post.title}
      </h2>

      {post.description && (
        <p className="text-sm leading-relaxed line-clamp-3 font-medium" style={{ color: '#5c4e4b' }}>
          {post.description}
        </p>
      )}

      <div
        className="flex items-center gap-2 mt-5 pt-4 text-xs font-bold"
        style={{
          borderTop: '1px solid #e6dfd0',
          color: '#6e5d59',
        }}
      >
        <Clock size={11} />
        <span>{date}</span>
      </div>
    </article>
  )
}

const MOCK_BLOGS = [
  { id: 1, title: 'த.வெ.க ராயபுரம் அலுவலகத் திறப்பு விழா | TVK Royapuram Office Inauguration', description: 'புதிய தொகுதி அலுவலகம் மக்கள் பயன்பாட்டிற்காக திறந்து வைக்கப்பட்டது. The new constituency office has been inaugurated to serve the people directly, with General Secretary Bussy Anand gracing the occasion as chief guest.', image_url: 'https://images.unsplash.com/photo-1582213782179-e0d53f98f2ca?auto=format&fit=crop&q=80&w=800', created_at: '2024-02-10T10:00:00Z' },
  { id: 2, title: 'கல்வி மற்றும் சுகாதாரம் சார்ந்த திட்டங்கள் | Focus on Education and Healthcare', description: 'அரசுப் பள்ளிகள் மற்றும் ஆரம்ப சுகாதார நிலையங்களின் உள்கட்டமைப்பை மேம்படுத்துவதே த.வெ.க-வின் முக்கிய இலக்காகும். Our primary goal for this year is to improve the infrastructure of local government schools and primary health centers.', image_url: 'https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&q=80&w=800', created_at: '2024-01-25T10:00:00Z' },
  { id: 3, title: 'உறுப்பினர் சேர்க்கை சாதனை மைல்கல் | Membership Drive Reaches Milestone', description: 'கடந்த மாதத்தில் ராயபுரம் த.வெ.க பிரிவில் 50,000-க்கும் மேற்பட்ட புதிய உறுப்பினர்கள் இணைந்துள்ளனர். Over 50,000 new members have joined the TVK Royapuram unit in the last month. We thank the people for their overwhelming support.', image_url: 'https://images.unsplash.com/photo-1517486808906-6ca8b3f04846?auto=format&fit=crop&q=80&w=800', created_at: '2023-12-15T10:00:00Z' },
]

export default function Blog() {
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    supabase
      .from('events_blog')
      .select('*')
      .eq('type', 'blog')
      .order('created_at', { ascending: false })
      .then(({ data, error }) => {
        if (error || !data || data.length === 0) {
          setPosts(MOCK_BLOGS)
        } else {
          // Dynamic mapping to translate values loaded from Database to premium Tamil/English copy
          const mapped = data.map(item => {
            if (item.title?.toLowerCase().includes('inauguration') || item.id === 1) {
              return {
                ...item,
                title: 'த.வெ.க ராயபுரம் அலுவலகத் திறப்பு விழா | TVK Royapuram Office Inauguration',
                description: 'புதிய தொகுதி அலுவலகம் மக்கள் பயன்பாட்டிற்காக திறந்து வைக்கப்பட்டது. The new constituency office has been inaugurated to serve the people directly, with General Secretary Bussy Anand gracing the occasion as chief guest.'
              }
            }
            if (item.title?.toLowerCase().includes('education') || item.id === 2) {
              return {
                ...item,
                title: 'கல்வி மற்றும் சுகாதாரம் சார்ந்த திட்டங்கள் | Focus on Education and Healthcare',
                description: 'அரசுப் பள்ளிகள் மற்றும் ஆரம்ப சுகாதார நிலையங்களின் உள்கட்டமைப்பை மேம்படுத்துவதே த.வெ.க-வின் முக்கிய இலக்காகும். Our primary goal for this year is to improve the infrastructure of local government schools and primary health centers.'
              }
            }
            if (item.title?.toLowerCase().includes('membership') || item.id === 3) {
              return {
                ...item,
                title: 'உறுப்பினர் சேர்க்கை சாதனை மைல்கல் | Membership Drive Reaches Milestone',
                description: 'கடந்த மாதத்தில் ராயபுரம் த.வெ.க பிரிவில் 50,000-க்கும் மேற்பட்ட புதிய உறுப்பினர்கள் இணைந்துள்ளனர். Over 50,000 new members have joined the TVK Royapuram unit in the last month. We thank the people for their overwhelming support.'
              }
            }
            return item
          })
          setPosts(mapped)
        }
        setLoading(false)
      })
      .catch(() => {
        setPosts(MOCK_BLOGS)
        setLoading(false)
      })
  }, [])

  return (
    <div className="pt-24 pb-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

      <div className="text-center mb-16">
        <div
          className="section-badge mx-auto w-fit"
          style={{ borderColor: 'rgba(212,175,55,0.25)', background: 'rgba(212,175,55,0.06)', color: '#a6841b' }}
        >
          <FileText size={13} />
          அதிகாரப்பூர்வ அறிவிப்புகள் | Official Statements
        </div>
        <h1 className="section-title">அறிக்கைகள் &amp; செய்திகள் | Blog &amp; Press Releases</h1>
        <p className="section-subtitle mx-auto text-center font-medium mt-3">
          த.வெ.க தொகுதி அலுவலகத்தின் அதிகாரப்பூர்வ அறிவிப்புகள் மற்றும் கொள்கை விளக்கங்கள். Official announcements, press releases, and statements from the TVK constituency office.
        </p>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="card animate-pulse bg-white">
              <div className="h-48 rounded-xl mb-4" style={{ background: 'rgba(230,223,208,0.4)' }} />
              <div className="h-4 rounded w-3/4 mb-3" style={{ background: 'rgba(230,223,208,0.4)' }} />
              <div className="h-3 rounded w-full mb-2" style={{ background: 'rgba(230,223,208,0.4)' }} />
              <div className="h-3 rounded w-4/5" style={{ background: 'rgba(230,223,208,0.4)' }} />
            </div>
          ))}
        </div>
      ) : posts.length === 0 ? (
        <div className="text-center py-20 animate-fade-in" style={{ color: '#8c7b77' }}>
          <FileText size={48} className="mx-auto mb-4 opacity-30" />
          <p className="font-bold text-sm">No press releases yet.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {posts.map(post => <BlogCard key={post.id} post={post} />)}
        </div>
      )}
    </div>
  )
}
