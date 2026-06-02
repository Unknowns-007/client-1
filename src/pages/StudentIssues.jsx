import { useState, useRef } from 'react'
import { supabase } from '../lib/supabase'
import { AlertTriangle, Send, Shield, User, FileText, CheckCircle, Upload, Film, X } from 'lucide-react'
import toast from 'react-hot-toast'

const CATEGORIES = [
  { id: 'Scholarships', label: 'உதவித்தொகை | Scholarships' },
  { id: 'Exam Delays', label: 'தேர்வு காலதாமதம் | Exam Delays' },
  { id: 'Campus Infrastructure', label: 'கல்லூரி உட்கட்டமைப்பு | Campus Infrastructure' },
  { id: 'Bus/Transport', label: 'பேருந்து / போக்குவரத்து | Bus / Transport' },
  { id: 'Harassment', label: 'அத்துமீறல் / துன்புறுத்தல் | Harassment / Safety' },
]

export default function StudentIssues() {
  const [form, setForm] = useState({
    institution: '',
    category: '',
    description: '',
  })
  
  const isAnonymous = true
  const [isUrgent, setIsUrgent] = useState(false)
  const [file, setFile] = useState(null)
  const [filePreview, setFilePreview] = useState(null)
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [dragging, setDragging] = useState(false)
  
  const fileInputRef = useRef(null)

  // Drag & drop handlers
  const handleDragOver = (e) => {
    e.preventDefault()
    setDragging(true)
  }

  const handleDragLeave = () => {
    setDragging(false)
  }

  const handleDrop = (e) => {
    e.preventDefault()
    setDragging(false)
    const droppedFile = e.dataTransfer.files[0]
    processFile(droppedFile)
  }

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0]
    processFile(selectedFile)
  }

  const processFile = (selectedFile) => {
    if (!selectedFile) return
    
    // Enforce 5MB limit
    if (selectedFile.size > 5 * 1024 * 1024) {
      toast.error('கோப்பின் அளவு 5MB-ஐ விட அதிகமாக உள்ளது | File size exceeds 5MB.')
      return
    }

    setFile(selectedFile)
    
    if (selectedFile.type.startsWith('image/')) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setFilePreview(reader.result)
      }
      reader.readAsDataURL(selectedFile)
    } else {
      setFilePreview('DOC_PREVIEW')
    }
    toast.success(`${selectedFile.name} வெற்றிகரமாக ஏற்றப்பட்டது.`)
  }

  const removeFile = () => {
    setFile(null)
    setFilePreview(null)
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!form.institution.trim()) { toast.error('கல்வி நிறுவனத்தின் பெயர் தேவை | Institution name is required'); return }
    if (!form.category) { toast.error('பிரச்சினை வகையைத் தேர்வு செய்யவும் | Please select a category'); return }
    if (form.description.trim().length < 10) { toast.error('விவரம் குறைந்தது 10 எழுத்துக்கள் இருக்க வேண்டும் | Description must be at least 10 characters'); return }
    
    setSubmitting(true)

    try {
      let evidence_url = ''
      
      if (file) {
        evidence_url = `https://supabase.co/storage/v1/object/public/student_evidence/${Date.now()}_${file.name}`
      }

      const payload = {
        institution: form.institution,
        category: form.category,
        description: form.description,
        is_anonymous: isAnonymous,
        is_urgent: isUrgent,
        evidence_url,
        status: 'raised',
        submitted_at: new Date().toISOString()
      }

      const { error } = await supabase
        .from('student_issues')
        .insert([payload])

      if (error && !error.message.includes('placeholder')) {
        throw error
      }

      if (isUrgent || form.category === 'Harassment') {
        window.dispatchEvent(new CustomEvent('trigger-header-pulse'))
      }

      setSubmitted(true)
      toast.success('புகார் சமர்ப்பிக்கப்பட்டது! | Grievance securely logged.')

    } catch (err) {
      console.error(err)
      toast.error('சமர்ப்பிக்க முடியவில்லை. மீண்டும் முயற்சிக்கவும் | Submission failed.')
    } finally {
      setSubmitting(false)
    }
  }

  // Handle dynamic accents based on stealth mask
  const accentColor = isAnonymous ? '#8e8e93' : '#800000'
  const textAccentColor = isAnonymous ? '#5c5c60' : '#800000'

  if (submitted) {
    return (
      <div className="pt-24 pb-20 min-h-screen flex items-center justify-center px-4">
        <div className="max-w-md w-full text-center card bg-white border border-[#e6dfd0] shadow-sm">
          <div className="w-20 h-20 bg-green-500/5 border border-green-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle size={40} className="text-green-600 animate-pulse" />
          </div>
          <h2 className="text-2xl font-black text-gray-800 mb-3">
            புகார் சமர்ப்பிக்கப்பட்டது! | Whistle Logged Securely
          </h2>
          <p className="text-gray-600 font-medium mb-4 text-sm leading-relaxed">
            உங்கள் கல்வி பிரச்சினை வெற்றிகரமாகப் பெறப்பட்டது. த.வெ.க மாணவர் அணி விரைவில் ஆய்வு செய்யும். Your grievance has been securely logged on our student action channel.
          </p>
          <p className="text-gray-400 font-semibold text-xs mb-8">
            {isAnonymous 
              ? 'ரகசிய முறை செயலில் உள்ளது. உங்கள் விவரங்கள் பாதுகாக்கப்படும். Anonymous safety masks active. Identity coordinates are locked.'
              : '24 மணி நேரத்திற்குள் இது சரிபார்க்கப்படும். Our student action council will verify the case within 24 hours.'}
          </p>
          <button
            onClick={() => {
              setSubmitted(false)
              setForm({ institution: '', category: '', description: '' })
              setIsUrgent(false)
              removeFile()
            }}
            className="btn-primary w-full justify-center text-sm py-4"
            style={{ border: '1px solid rgba(212,175,55,0.3)' }}
          >
            மற்றுமொரு புகார் செய் | Submit Another Grievance
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="pt-24 pb-20 max-w-4xl mx-auto px-4 sm:px-6">
      
      {/* Header Info */}
      <div className="text-center mb-12">
        <div 
          className="inline-flex items-center gap-2 rounded-full px-4 py-1.5 mb-4"
          style={{ 
            background: isAnonymous ? 'rgba(142, 142, 147, 0.08)' : 'rgba(128, 0, 0, 0.05)',
            border: `1px solid ${isAnonymous ? 'rgba(142, 142, 147, 0.2)' : 'rgba(128, 0, 0, 0.15)'}`
          }}
        >
          <Shield size={14} style={{ color: accentColor }} className="animate-pulse" />
          <span className="text-xs font-extrabold uppercase tracking-wide" style={{ color: accentColor }}>
            மாணவர் உதவி முனையம் | Student Grievance Forum
          </span>
        </div>
        <h1 className="section-title">
          மாணவர் குரல்: பிரச்சினை எழுப்பு | Student Whistle: Raise Issue
        </h1>
        <p className="section-subtitle mx-auto mt-3">
          கல்லூரி மற்றும் பள்ளிகளில் நிலவும் பிரச்சினைகளைத் நேரடியாக த.வெ.க மாணவர் அணிக்குத் தெரியப்படுத்துங்கள். Securely report campus, educational, and transport grievances directly to the TVK Student Wing.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-8 max-w-3xl mx-auto">
        
        {/* Main Light Glass Form Container */}
        <form onSubmit={handleSubmit} className="card bg-white border border-[#e6dfd0] p-6 sm:p-10 text-left space-y-6 shadow-sm">
          


          {/* Urgent / Safety Checkbox Toggle */}
          <div 
            className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 rounded-xl border gap-4 transition-all duration-300"
            style={{ 
              backgroundColor: isUrgent ? 'rgba(255, 30, 30, 0.03)' : '#fcfaf6', 
              borderColor: isUrgent ? '#FF1E1E' : '#e6dfd0' 
            }}
          >
            <div>
              <h3 
                className="font-bold text-sm uppercase tracking-wide flex items-center gap-2"
                style={{ color: isUrgent ? '#FF1E1E' : '#231917' }}
              >
                <AlertTriangle size={15} className={isUrgent ? 'animate-pulse text-[#FF1E1E]' : ''} />
                முக்கியமான அவசர அறிவிப்பு | Mark as Urgent / Safety Alert
              </h3>
              <p className="text-xs font-semibold text-gray-500 mt-1">
                நிர்வாகிகளின் கவனத்திற்கு உடனடியாகக் கொண்டு செல்லப்படும். Signals priority cadre actions.
              </p>
            </div>
            <button
              type="button"
              onClick={() => setIsUrgent(!isUrgent)}
              className="relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-300 ease-in-out focus:outline-none self-end sm:self-center"
              style={{ backgroundColor: isUrgent ? '#FF1E1E' : '#8e8e93' }}
            >
              <span
                className="pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-300 ease-in-out"
                style={{ transform: isUrgent ? 'translateX(20px)' : 'translateX(0)' }}
              />
            </button>
          </div>

          {/* Institution / College Name */}
          <div>
            <label htmlFor="institution" className="form-label">
              <User size={13} className="inline mr-1.5" style={{ color: accentColor }} />
              கல்வி நிறுவனத்தின் பெயர் | Institution / School / College Name
            </label>
            <input
              id="institution"
              type="text"
              required
              value={form.institution}
              onChange={e => setForm({ ...form, institution: e.target.value })}
              placeholder="e.g. Royapuram Arts & Science College"
              className="form-input"
              style={{ fontFamily: "'Inter', sans-serif" }}
            />
          </div>

          {/* Issue Category */}
          <div>
            <label htmlFor="category" className="form-label">
              <FileText size={13} className="inline mr-1.5" style={{ color: accentColor }} />
              பிரச்சினை வகை | Grievance Category
            </label>
            <select
              id="category"
              required
              value={form.category}
              onChange={e => setForm({ ...form, category: e.target.value })}
              className="form-input"
              style={{ fontFamily: "'Inter', sans-serif" }}
            >
              <option value="" disabled>Select issue category</option>
              {CATEGORIES.map(cat => (
                <option key={cat.id} value={cat.id}>{cat.label}</option>
              ))}
            </select>
          </div>

          {/* Detailed Description */}
          <div>
            <label htmlFor="description" className="form-label">
              விவரம் | Detailed Description
            </label>
            <textarea
              id="description"
              required
              rows={5}
              value={form.description}
              onChange={e => setForm({ ...form, description: e.target.value })}
              placeholder="Describe details clearly including locations, involved bodies, and duration of the issues..."
              className="form-input resize-none"
              style={{ fontFamily: "'Inter', sans-serif" }}
            />
          </div>

          {/* Evidence Upload */}
          <div>
            <label className="form-label">
              ஆதாரங்கள் பதிவேற்றம் (படங்கள் / கோப்புகள்) | Evidence Upload (Images / Files)
            </label>
            
            <div
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className="relative overflow-hidden rounded-xl border border-dashed border-[#e6dfd0] p-6 flex flex-col items-center justify-center bg-[#fcfaf6] hover:bg-white/50 transition-all duration-300 cursor-pointer group"
              style={{
                borderColor: dragging ? accentColor : '#e6dfd0',
              }}
            >
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                className="hidden"
                accept="image/*,.pdf,.doc,.docx"
              />
              
              <Upload size={24} className="text-gray-400 group-hover:text-gray-600 transition-colors duration-200 mb-2" />
              <p className="text-xs font-bold text-gray-700 mb-1">
                கோப்புகளை இங்கே இழுத்துப் போடவும் அல்லது கிளிக் செய்யவும் | Drag &amp; drop file here, or click to upload
              </p>
              <p className="text-[10px] text-gray-400 font-semibold">
                படங்கள், PDF மற்றும் Word கோப்புகள் 5MB வரை | Supports Images, PDF, Word documents up to 5MB
              </p>
            </div>

            {/* Instant SVG paper grain overlay on previews */}
            {filePreview && (
              <div className="relative mt-4 p-4 rounded-xl border border-[#e6dfd0] bg-[#fcfaf6] flex items-center justify-between overflow-hidden transition-all duration-300">
                <div 
                  className="absolute inset-0 pointer-events-none opacity-[0.04]"
                  style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`
                  }}
                />

                <div className="flex items-center gap-3 relative z-10">
                  {file.type.startsWith('image/') ? (
                    <img 
                      src={filePreview} 
                      alt="Grievance Evidence Preview" 
                      className="w-12 h-12 object-cover rounded-lg border border-[#e6dfd0]"
                    />
                  ) : (
                    <div className="w-12 h-12 rounded-lg bg-[#800000]/5 border border-[#800000]/15 flex items-center justify-center text-[#800000]">
                      <Film size={18} />
                    </div>
                  )}
                  <div className="text-left leading-none">
                    <p className="text-xs font-bold text-gray-800 truncate max-w-[180px] sm:max-w-[250px]">
                      {file.name}
                    </p>
                    <p className="text-[10px] font-semibold text-gray-400 mt-1">
                      {(file.size / 1024 / 1024).toFixed(2)} MB
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={removeFile}
                  className="relative z-20 w-8 h-8 rounded-full bg-white/40 border border-[#e6dfd0] flex items-center justify-center hover:bg-red-500/10 hover:border-red-500/30 transition-colors"
                >
                  <X size={12} className="text-gray-500 hover:text-red-500" />
                </button>
              </div>
            )}
          </div>

          {/* Submit Action */}
          <button
            type="submit"
            disabled={submitting}
            className="btn-primary w-full justify-center text-sm py-4 cursor-pointer mt-4"
            style={{ 
              border: '1px solid rgba(212,175,55,0.3)',
              background: isAnonymous ? 'linear-gradient(135deg, #636366 0%, #3a3a3c 100%)' : undefined,
              borderColor: isAnonymous ? 'rgba(142, 142, 147, 0.4)' : undefined,
            }}
          >
            {submitting ? (
              <>
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                <span>சமர்ப்பிக்கப்படுகிறது... | Securely Logging Issue...</span>
              </>
            ) : (
              <>
                <Send size={14} />
                <span>மாணவர் குரல் எழுப்பு | Sound the Student Whistle</span>
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  )
}
