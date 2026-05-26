import { useState } from 'react'
import { supabase } from '../lib/supabase'
import toast from 'react-hot-toast'
import { AlertTriangle, Send, CheckCircle, Phone, User, MessageSquare, Tag } from 'lucide-react'

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

  const validate = () => {
    const e = {}
    if (!form.citizen_name.trim()) e.citizen_name = 'Name is required'
    if (!/^[6-9][0-9]{9}$/.test(form.phone_number)) e.phone_number = 'Enter a valid 10-digit Indian mobile number'
    if (!form.issue_type) e.issue_type = 'Please select an issue type'
    if (form.description.trim().length < 10) e.description = 'Please describe the issue in at least 10 characters'
    return e
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const errs = validate()
    if (Object.keys(errs).length > 0) { setErrors(errs); return }
    setErrors({})
    setSubmitting(true)

    const { error } = await supabase.from('grievances').insert([{ ...form }])

    setSubmitting(false)
    if (error) {
      toast.error('Submission failed. Please try again.')
    } else {
      setSubmitted(true)
      toast.success('Your issue has been submitted!')
    }
  }

  if (submitted) {
    return (
      <div className="pt-24 pb-20 min-h-screen flex items-center justify-center px-4">
        <div className="max-w-md w-full text-center card">
          <div className="w-20 h-20 bg-green-500/10 border border-green-500/30 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle size={40} className="text-green-400" />
          </div>
          <h2 className="text-2xl font-bold text-white mb-3">Issue Submitted!</h2>
          <p className="text-gray-400 mb-2">
            Your grievance has been received. The TVK welfare office will review and acknowledge your issue shortly.
          </p>
          <p className="text-gray-500 text-sm mb-8">
            You will be notified once your issue has been accepted.
          </p>
          <button
            onClick={() => { setSubmitted(false); setForm({ citizen_name: '', phone_number: '', issue_type: '', description: '' }) }}
            className="btn-primary w-full justify-center"
          >
            Submit Another Issue
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="pt-24 pb-20 max-w-2xl mx-auto px-4 sm:px-6">
      {/* Header */}
      <div className="text-center mb-10">
        <div className="inline-flex items-center gap-2 bg-tvk-red/10 border border-tvk-red/30 rounded-full px-4 py-1.5 mb-4">
          <AlertTriangle size={14} className="text-tvk-red" />
          <span className="text-tvk-red text-sm font-medium">Grievance Portal</span>
        </div>
        <h1 className="section-title">Raise an Issue</h1>
        <p className="section-subtitle mx-auto mt-3">
          Submit your local civic complaint. Our welfare team reviews every issue.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="card space-y-6">
        {/* Name */}
        <div>
          <label htmlFor="citizen_name" className="form-label">
            <User size={14} className="inline mr-1.5 text-tvk-red" />
            Full Name
          </label>
          <input
            id="citizen_name"
            type="text"
            value={form.citizen_name}
            onChange={e => setForm({ ...form, citizen_name: e.target.value })}
            placeholder="Your full name"
            className={`form-input ${errors.citizen_name ? 'border-red-500' : ''}`}
          />
          {errors.citizen_name && <p className="text-red-400 text-xs mt-1">{errors.citizen_name}</p>}
        </div>

        {/* Phone */}
        <div>
          <label htmlFor="phone_number" className="form-label">
            <Phone size={14} className="inline mr-1.5 text-tvk-red" />
            Mobile Number
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
          {errors.phone_number && <p className="text-red-400 text-xs mt-1">{errors.phone_number}</p>}
        </div>

        {/* Issue Type */}
        <div>
          <label htmlFor="issue_type" className="form-label">
            <Tag size={14} className="inline mr-1.5 text-tvk-red" />
            Issue Type
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
          {errors.issue_type && <p className="text-red-400 text-xs mt-1">{errors.issue_type}</p>}
        </div>

        {/* Description */}
        <div>
          <label htmlFor="description" className="form-label">
            <MessageSquare size={14} className="inline mr-1.5 text-tvk-red" />
            Description
          </label>
          <textarea
            id="description"
            rows={5}
            value={form.description}
            onChange={e => setForm({ ...form, description: e.target.value })}
            placeholder="Describe your issue clearly — include location, severity, and how long it has persisted..."
            className={`form-input resize-none ${errors.description ? 'border-red-500' : ''}`}
          />
          {errors.description && <p className="text-red-400 text-xs mt-1">{errors.description}</p>}
          <p className="text-gray-600 text-xs mt-1 text-right">{form.description.length} chars</p>
        </div>

        {/* Disclaimer */}
        <p className="text-gray-600 text-xs border border-border rounded-lg p-3 bg-surface">
          ⚠️ This complaint will be reviewed by the TVK welfare officer. You will be notified when it is acknowledged. Do not submit false or misleading complaints.
        </p>

        <button
          type="submit"
          disabled={submitting}
          className="btn-primary w-full justify-center text-base py-4"
          id="submit-grievance"
        >
          {submitting ? (
            <>
              <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              Submitting...
            </>
          ) : (
            <>
              <Send size={18} />
              Submit Issue
            </>
          )}
        </button>
      </form>
    </div>
  )
}
