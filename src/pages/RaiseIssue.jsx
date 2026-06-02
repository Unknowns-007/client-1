import { useState, useRef } from 'react'
import { supabase } from '../lib/supabase'
import toast from 'react-hot-toast'
import { AlertTriangle, Send, CheckCircle, Phone, User, MessageSquare, Tag, Users, Upload, Film, X } from 'lucide-react'

const ISSUE_TYPES = [
  'Potholes',
  'Water Supply',
  'Streetlights',
  'Garbage Collection',
  'Drainage',
  'Public Parks',
  'Other',
]

export default function RaiseIssue() {
  const [form, setForm] = useState({
    citizen_name: '',
    phone_number: '',
    issue_type: '',
    description: '',
  })
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [errors, setErrors] = useState({})

  const [file, setFile] = useState(null)
  const [filePreview, setFilePreview] = useState(null)
  const [dragging, setDragging] = useState(false)
  const fileInputRef = useRef(null)

  const validate = () => {
    const e = {}
    if (!form.citizen_name.trim()) e.citizen_name = 'Name is required'
    if (!/^[6-9][0-9]{9}$/.test(form.phone_number)) e.phone_number = 'Enter a valid 10-digit Indian mobile number'
    if (!form.issue_type) e.issue_type = 'Please select an issue type'
    if (form.description.trim().length < 10) e.description = 'Please describe the issue in at least 10 characters'
    return e
  }

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
    const errs = validate()
    if (Object.keys(errs).length > 0) { setErrors(errs); return }
    setErrors({})
    setSubmitting(true)

    try {
      let evidence_url = ''
      if (file) {
        evidence_url = `https://supabase.co/storage/v1/object/public/grievance_evidence/${Date.now()}_${file.name}`
      }

      const { error } = await supabase.from('grievances').insert([{ ...form, evidence_url }])

      if (error) {
        throw error
      }

      setSubmitted(true)
      toast.success('Your issue has been submitted!')
    } catch (err) {
      console.error(err)
      toast.error('Submission failed. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  if (submitted) {
    return (
      <div className="pt-24 pb-20 min-h-screen flex items-center justify-center px-4">
        <div className="max-w-md w-full text-center card bg-white">
          <div className="w-20 h-20 bg-green-500/5 border border-green-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle size={40} className="text-green-600" />
          </div>
          <h2 className="text-2xl font-black text-gray-800 mb-3">புகார் சமர்ப்பிக்கப்பட்டது! | Issue Submitted!</h2>
          <p className="text-gray-600 font-medium mb-2">
            உங்கள் புகார் வெற்றிகரமாக பெறப்பட்டது. த.வெ.க தொகுதி அலுவலகம் விரைவில் ஆய்வு செய்யும். Your grievance has been received. The TVK welfare office will review it shortly.
          </p>
          <p className="text-gray-400 font-semibold text-sm mb-8">
            பரிசீலனைக்கு பின் உங்களுக்கு அறிவிக்கப்படும். You will be notified once reviewed.
          </p>
          <button
            onClick={() => {
              setSubmitted(false)
              setForm({ citizen_name: '', phone_number: '', issue_type: '', description: '' })
              removeFile()
            }}
            className="btn-primary w-full justify-center"
            style={{ border: '1px solid rgba(212,175,55,0.3)' }}
          >
            மற்றுமொரு புகார் செய் | Submit Another Issue
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="pt-24 pb-20 max-w-5xl mx-auto px-4 sm:px-6">
      {/* Header */}
      <div className="text-center mb-12">
        <div className="inline-flex items-center gap-2 bg-tvk-red/5 border border-tvk-red/20 rounded-full px-4 py-1.5 mb-4">
          <AlertTriangle size={14} className="text-tvk-red" />
          <span className="text-tvk-red text-sm font-extrabold uppercase tracking-wide">த.வெ.க மக்கள் குரல் | TVK Civic Whistle Portal</span>
        </div>
        <h1 className="section-title">குடிமக்கள் விசில் சத்தம் | Sound the Civic Whistle</h1>
        <p className="section-subtitle mx-auto mt-3">
          நமது வீதிகளில் உள்ள குறைகளையும், பொதுமக்களின் தேவைகளையும் சுட்டிக்காட்டுவது ஒவ்வொரு குடிமகனின் கடமை என்று தலைவர் தளபதி விஜய் அறிவுறுத்தியுள்ளார். CM Vijay has mandated that every citizen act as a watchdog to report local neglect directly to the TVK welfare office.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[1.2fr_1fr] gap-10 items-start">
        {/* Left Column: Form */}
        <form onSubmit={handleSubmit} className="card bg-white space-y-6">
          {/* Name */}
          <div>
            <label htmlFor="citizen_name" className="form-label">
              <User size={14} className="inline mr-1.5 text-tvk-red" />
              முழு பெயர் | Full Name
            </label>
            <input
              id="citizen_name"
              type="text"
              value={form.citizen_name}
              onChange={e => setForm({ ...form, citizen_name: e.target.value })}
              placeholder="Your full name"
              className={`form-input ${errors.citizen_name ? 'border-red-500' : ''}`}
            />
            {errors.citizen_name && <p className="text-red-600 text-xs font-bold mt-1">{errors.citizen_name}</p>}
          </div>

          {/* Phone */}
          <div>
            <label htmlFor="phone_number" className="form-label">
              <Phone size={14} className="inline mr-1.5 text-tvk-red" />
              அலைபேசி எண் | Mobile Number
            </label>
            <input
              id="phone_number"
              type="tel"
              value={form.phone_number}
              onChange={e => setForm({ ...form, phone_number: e.target.value })}
              placeholder="10-digit mobile number"
              maxLength={10}
              className={`form-input ${errors.phone_number ? 'border-red-500' : ''}`}
            />
            {errors.phone_number && <p className="text-red-600 text-xs font-bold mt-1">{errors.phone_number}</p>}
          </div>

          {/* Issue Type */}
          <div>
            <label htmlFor="issue_type" className="form-label">
              <Tag size={14} className="inline mr-1.5 text-tvk-red" />
              பிரச்சினை வகை | Issue Type
            </label>
            <select
              id="issue_type"
              value={form.issue_type}
              onChange={e => setForm({ ...form, issue_type: e.target.value })}
              className={`form-input ${errors.issue_type ? 'border-red-500' : ''}`}
            >
              <option value="" disabled>Select issue type</option>
              {ISSUE_TYPES.map(t => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>
            {errors.issue_type && <p className="text-red-600 text-xs font-bold mt-1">{errors.issue_type}</p>}
          </div>

          {/* Description */}
          <div>
            <label htmlFor="description" className="form-label">
              <MessageSquare size={14} className="inline mr-1.5 text-tvk-red" />
              விவரம் | Description
            </label>
            <textarea
              id="description"
              rows={5}
              value={form.description}
              onChange={e => setForm({ ...form, description: e.target.value })}
              placeholder="Describe your issue clearly — include location, severity, and how long it has persisted..."
              className={`form-input resize-none ${errors.description ? 'border-red-500' : ''}`}
            />
            {errors.description && <p className="text-red-600 text-xs font-bold mt-1">{errors.description}</p>}
            <p className="text-gray-400 text-xs font-bold mt-1 text-right">{form.description.length} chars</p>
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
                borderColor: dragging ? '#800000' : '#e6dfd0',
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

          {/* Disclaimer */}
          <p className="text-gray-700 text-xs font-bold border border-tvk-yellow/30 rounded-xl p-4 bg-tvk-yellow/5 leading-relaxed text-left">
            ⚠️ இந்த புகார் த.வெ.க மக்கள் நல அதிகாரியால் மதிப்பாய்வு செய்யப்படும். This complaint will be reviewed by the TVK welfare officer. Do not submit false or misleading complaints.
          </p>

          <button
            type="submit"
            disabled={submitting}
            className="btn-primary w-full justify-center text-base py-4 cursor-pointer"
            id="submit-grievance"
            style={{ border: '1px solid rgba(212,175,55,0.3)' }}
          >
            {submitting ? (
              <>
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                சமர்ப்பிக்கப்படுகிறது... | Submitting...
              </>
            ) : (
              <>
                <Send size={18} />
                சமர்ப்பி | Submit Issue
              </>
            )}
          </button>
        </form>

        {/* Right Column: Whistleblower Mandate */}
        <div className="card bg-white border border-[#e6dfd0] p-8 text-left space-y-6 lg:sticky lg:top-24 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-tvk-red/5 border border-tvk-red/20 rounded-xl flex items-center justify-center text-tvk-red shadow-sm">
              <AlertTriangle size={24} />
            </div>
            <div>
              <h3 className="text-gray-800 font-extrabold text-lg leading-none">விசில் சத்தம் | Civic Whistle</h3>
              <p className="text-[#a6841b] text-xs font-bold mt-1.5">விசில் சத்தம் · Royapuram</p>
            </div>
          </div>

          <div className="w-full h-px" style={{ background: 'linear-gradient(90deg, #e6dfd0, transparent)' }} />

          <p className="text-xs font-semibold leading-relaxed italic text-gray-600 border-l-2 border-tvk-yellow pl-3">
            "நமது வீதிகளில் உள்ள குறைகளையும், பொதுமக்களின் தேவைகளையும் சுட்டிக்காட்டுவது ஒவ்வொரு குடிமகனின் கடமை. உங்கள் குரலே நமது பேரியக்கத்தின் வழிகாட்டி." <br />
            <span className="text-tvk-red-dark font-extrabold not-italic block mt-1.5">— தலைவர் தளபதி விஜய்</span>
          </p>

          <div className="space-y-4">
            <h4 className="text-gray-800 font-extrabold text-xs uppercase tracking-wider">நாங்கள் தீர்வு காணும் முறை | How We Resolve It:</h4>
            <ol className="space-y-3.5">
              {[
                { step: '1', title: 'தொகுதி கள ஆய்வு | Cadre Verification', desc: 'TVK local ward volunteers inspect the reported location within 24 hours to verify details.' },
                { step: '2', title: 'அதிகாரப்பூர்வ நடவடிக்கை | Official Escalation', desc: 'The TVK Welfare Officer formalizes the complaint directly with the Chennai Corporation authorities.' },
                { step: '3', title: 'நிகழ்நேர கண்காணிப்பு | Live Tracker', desc: 'You receive instant SMS updates once the issue is accepted and scheduled for local resolution work.' }
              ].map(({ step, title, desc }) => (
                <li key={step} className="flex gap-3">
                  <div className="w-6 h-6 rounded-full bg-tvk-yellow/15 border border-tvk-yellow/30 text-tvk-yellow-dark flex items-center justify-center text-xs font-black shrink-0">{step}</div>
                  <div>
                    <h5 className="text-[#800000] font-bold text-xs leading-none mb-1">{title}</h5>
                    <p className="text-[11px] text-gray-500 font-bold leading-normal">{desc}</p>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </div>

      {/* TVK Local Ward Helpdesks (உதவி முனையங்கள்) */}
      <section className="mt-20 pt-16 border-t border-[#e6dfd0] w-full">
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 bg-[#d4af37]/10 border border-[#d4af37]/30 rounded-full px-4 py-1.5 mb-3 text-[#a6841b]">
            <Users size={13} />
            <span className="text-xs font-extrabold uppercase tracking-wide">உள்ளூர் வார்டு உதவி முனையம் | TVK Local Ward Assistance</span>
          </div>
          <h2 className="text-2xl font-black text-gray-800">வார்டு உதவி மையங்கள் | Royapuram Ward Helpdesks</h2>
          <p className="text-sm font-medium text-gray-500 mt-2">
            நேரடியாக தொடர்பு கொள்ள வேண்டுமா? Connect directly with our TVK ward secretaries and action wing coordinators.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full">
          {[
            { ward: 'வார்டு 49 உதவி மையம் (மேற்கு) | Ward 49 Helpdesk', leader: 'Thiru. R. Loganathan', contact: '+91 98401 23456', role: 'Ward Secretary', duty: 'Sanitation, streetlights, and basic infrastructure support.' },
            { ward: 'வார்டு 50 உதவி மையம் (கிழக்கு) | Ward 50 Helpdesk', leader: 'Thirumathi. S. Deepa', contact: '+91 98401 78901', role: 'Women Wing Coord.', duty: 'Drinking water, ration supply, and local livelihood welfare.' },
            { ward: 'த.வெ.க இலவச சட்ட உதவி மையம் | TVK Legal Aid Council', leader: 'Adv. K. Parthiban', contact: '+91 94440 55667', role: 'Legal Wing Head', duty: 'Free legal aid, consumer disputes, and human rights advocacy.' }
          ].map(({ ward, leader, contact, role, duty }) => (
            <div key={ward} className="card bg-white p-6 border border-[#e6dfd0] text-left relative overflow-hidden group hover:border-[#800000]/30 transition-all duration-300">
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#800000] to-[#d4af37] opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <span className="text-xs font-extrabold text-[#a6841b] uppercase tracking-wide">{ward}</span>
              <h3 className="text-gray-800 font-extrabold text-base mt-2">{leader}</h3>
              <p className="text-xs font-bold text-gray-400 mt-0.5">{role}</p>
              
              <p className="text-xs text-gray-500 font-medium leading-relaxed my-4">{duty}</p>
              
              <div className="w-full h-px my-4" style={{ background: 'linear-gradient(90deg, #e6dfd0, transparent)' }} />
              
              <a
                href={`tel:${contact.replace(/\s+/g, '')}`}
                className="inline-flex items-center gap-2 text-xs font-extrabold text-[#800000] hover:text-[#5c0000] transition-colors duration-200"
              >
                <Phone size={13} className="text-[#800000]" />
                <span>Call {contact}</span>
              </a>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}
