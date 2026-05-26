import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'
import { FileText, Clock } from 'lucide-react'

function BlogCard({ post }) {
  const date = new Date(post.created_at).toLocaleDateString('en-IN', {
    year: 'numeric', month: 'long', day: 'numeric'
  })

  return (
    <article className="card hover:-translate-y-1 group">
      {post.image_url && (
        <div className="rounded-lg overflow-hidden mb-5 h-52">
          <img
            src={post.image_url}
            alt={post.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        </div>
      )}
      <div className="flex items-center gap-2 mb-3">
        <span className="bg-tvk-red/10 text-tvk-red border border-tvk-red/20 text-xs font-medium px-2.5 py-0.5 rounded-full">
          Press Release
        </span>
      </div>
      <h2 className="text-white font-bold text-xl mb-3 group-hover:text-tvk-yellow transition-colors">{post.title}</h2>
      {post.description && (
        <p className="text-gray-400 text-sm leading-relaxed line-clamp-3">{post.description}</p>
      )}
      <div className="flex items-center gap-2 mt-5 pt-4 border-t border-border text-gray-500 text-xs">
        <Clock size={12} />
        <span>{date}</span>
      </div>
    </article>
  )
}

const MOCK_BLOGS = [
  { id: 1, title: 'TVK Royapuram Office Inauguration', description: 'The new constituency office has been inaugurated to serve the people directly. General Secretary Bussy Anand graced the occasion.', image_url: 'https://images.unsplash.com/photo-1582213782179-e0d53f98f2ca?auto=format&fit=crop&q=80&w=800', created_at: '2024-02-10T10:00:00Z' },
  { id: 2, title: 'Focus on Education and Healthcare', description: 'Our primary goal for this year is to improve the infrastructure of local government schools and primary health centers.', image_url: 'https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&q=80&w=800', created_at: '2024-01-25T10:00:00Z' },
  { id: 3, title: 'Membership Drive Reaches Milestone', description: 'Over 50,000 new members have joined the TVK Royapuram unit in the last month. We thank the people for their overwhelming support.', image_url: 'https://images.unsplash.com/photo-1517486808906-6ca8b3f04846?auto=format&fit=crop&q=80&w=800', created_at: '2023-12-15T10:00:00Z' }
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
          setPosts(data)
        }
        setLoading(false)
      })
      .catch(() => {
        setPosts(MOCK_BLOGS)
        setLoading(false)
      })
  }, [])

  return (
    <div className="pt-24 pb-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="text-center mb-14">
        <div className="inline-flex items-center gap-2 bg-purple-500/10 border border-purple-500/30 rounded-full px-4 py-1.5 mb-4">
          <FileText size={14} className="text-purple-400" />
          <span className="text-purple-400 text-sm font-medium">Official Statements</span>
        </div>
        <h1 className="section-title">Blog & Press Releases</h1>
        <p className="section-subtitle mx-auto">
          Official announcements, press releases, and statements from the TVK constituency office.
        </p>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="card animate-pulse">
              <div className="h-48 bg-surface-3 rounded-lg mb-4" />
              <div className="h-4 bg-surface-3 rounded w-3/4 mb-3" />
              <div className="h-3 bg-surface-3 rounded w-full mb-2" />
              <div className="h-3 bg-surface-3 rounded w-4/5" />
            </div>
          ))}
        </div>
      ) : posts.length === 0 ? (
        <div className="text-center py-20 text-gray-500">
          <FileText size={48} className="mx-auto mb-4 opacity-30" />
          <p>No press releases yet.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {posts.map(post => <BlogCard key={post.id} post={post} />)}
        </div>
      )}
    </div>
  )
}
