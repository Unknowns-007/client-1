import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'
import { Droplets, RefreshCw, Clock, Heart, ShieldAlert, User, Phone, MapPin, Send, Plus, Award } from 'lucide-react'
import toast from 'react-hot-toast'

const bloodColors = {
  'A+':  { bg: 'rgba(128,0,0,0.04)',    border: 'rgba(128,0,0,0.22)',    text: '#800000',   dot: '#800000' },
  'A-':  { bg: 'rgba(168,28,28,0.04)', border: 'rgba(168,28,28,0.22)', text: '#a81c1c',   dot: '#a81c1c' },
  'B+':  { bg: 'rgba(194,65,12,0.04)',  border: 'rgba(194,65,12,0.22)',  text: '#c2410c',   dot: '#c2410c' },
  'B-':  { bg: 'rgba(180,83,9,0.04)',   border: 'rgba(180,83,9,0.22)',   text: '#b45309',   dot: '#b45309' },
  'AB+': { bg: 'rgba(109,40,217,0.04)', border: 'rgba(109,40,217,0.22)', text: '#6d28d9',   dot: '#6d28d9' },
  'AB-': { bg: 'rgba(67,56,202,0.04)',  border: 'rgba(67,56,202,0.22)', text: '#4357ca',   dot: '#4357ca' },
  'O+':  { bg: 'rgba(21,128,61,0.04)',  border: 'rgba(21,128,61,0.22)',  text: '#15803d',   dot: '#15803d' },
  'O-':  { bg: 'rgba(15,118,110,0.04)', border: 'rgba(15,118,110,0.22)', text: '#0f766e',   dot: '#0f766e' },
}

const compatibility = {
  'A+':  { receive: ['A+', 'A-', 'O+', 'O-'], donate: ['A+', 'AB+'] },
  'A-':  { receive: ['A-', 'O-'], donate: ['A+', 'A-', 'AB+', 'AB-'] },
  'B+':  { receive: ['B+', 'B-', 'O+', 'O-'], donate: ['B+', 'AB+'] },
  'B-':  { receive: ['B-', 'O-'], donate: ['B+', 'B-', 'AB+', 'AB-'] },
  'AB+': { receive: ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'], donate: ['AB+'] },
  'AB-': { receive: ['A-', 'B-', 'AB-', 'O-'], donate: ['AB+', 'AB-'] },
  'O+':  { receive: ['O+', 'O-'], donate: ['A+', 'B+', 'AB+', 'O+'] },
  'O-':  { receive: ['O-'], donate: ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'] },
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
  
  // Interactive filters & selections
  const [selectedGroup, setSelectedGroup] = useState('O+')
  const [filterType, setFilterType] = useState('ALL') // ALL, AVAILABLE, CRITICAL
  
  // Interactive Forms State
  const [requestForm, setRequestForm] = useState({
    patient_name: '',
    blood_group: 'O+',
    units_needed: '1',
    hospital_name: '',
    phone_number: '',
  })
  
  const [donorForm, setDonorForm] = useState({
    donor_name: '',
    blood_group: 'O+',
    age: '',
    phone_number: '',
  })
  
  const [requestSubmitting, setRequestSubmitting] = useState(false)
  const [donorSubmitting, setDonorSubmitting] = useState(false)

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

    const channel = supabase
      .channel('blood_inventory_changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'blood_inventory' }, fetchInventory)
      .subscribe()

    return () => supabase.removeChannel(channel)
  }, [])

  const handleGroupSelect = (group) => {
    setSelectedGroup(group)
    setRequestForm(prev => ({ ...prev, blood_group: group }))
    setDonorForm(prev => ({ ...prev, blood_group: group }))
  }

  const handleRequestSubmit = (e) => {
    e.preventDefault()
    if (!requestForm.patient_name.trim()) { toast.error('Please enter patient name'); return }
    if (!/^[6-9][0-9]{9}$/.test(requestForm.phone_number)) { toast.error('Please enter a valid Indian mobile number'); return }
    if (!requestForm.hospital_name.trim()) { toast.error('Please enter hospital details'); return }
    
    setRequestSubmitting(true)
    setTimeout(() => {
      setRequestSubmitting(false)
      toast.success(`Request submitted! TVK Blood Brigade has been alerted for ${requestForm.blood_group}.`)
      setRequestForm({
        patient_name: '',
        blood_group: selectedGroup,
        units_needed: '1',
        hospital_name: '',
        phone_number: '',
      })
    }, 1200)
  }

  const handleDonorSubmit = (e) => {
    e.preventDefault()
    if (!donorForm.donor_name.trim()) { toast.error('Please enter donor name'); return }
    if (!/^[6-9][0-9]{9}$/.test(donorForm.phone_number)) { toast.error('Please enter a valid Indian mobile number'); return }
    const ageNum = parseInt(donorForm.age)
    if (isNaN(ageNum) || ageNum < 18 || ageNum > 65) { toast.error('Donors must be between 18 and 65 years old'); return }
    
    setDonorSubmitting(true)
    setTimeout(() => {
      setDonorSubmitting(false)
      toast.success('Congratulations! Registered in TVK Blood Brigade.')
      setDonorForm({
        donor_name: '',
        blood_group: selectedGroup,
        age: '',
        phone_number: '',
      })
    }, 1200)
  }

  // Filter logic
  const filteredInventory = inventory.filter(item => {
    const units = item.units_available
    if (filterType === 'AVAILABLE') return units > 0
    if (filterType === 'CRITICAL') return units < 5
    return true
  })

  // Selected Group Details
  const selectedInfo = inventory.find(item => item.blood_group === selectedGroup) || { units_available: 0 }
  const selectedCompat = compatibility[selectedGroup] || { receive: [], donate: [] }

  return (
    <div className="pt-24 pb-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

      {/* Header */}
      <div className="text-center mb-8">
        <div
          className="section-badge mx-auto w-fit"
          style={{ borderColor: 'rgba(128,0,0,0.22)', background: 'rgba(128,0,0,0.05)', color: '#800000' }}
        >
          <Droplets size={13} />
          நேரடி இருப்பு | Live Inventory
        </div>
        <h1 className="section-title">குருதி இருப்பு விவரம் | Blood Availability</h1>
        <p className="section-subtitle mx-auto text-center font-medium mt-3">
          ராயபுரம் த.வெ.க மத்திய மக்கள் நல மையத்தில் நிகழ்நேரத்தில் கண்காணிக்கப்படும் குருதி இருப்பு அலகுகள். Real-time blood units tracked at our TVK Royapuram central welfare desk.
        </p>
      </div>

      {/* Last updated + Refresh */}
      <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-10">
        {lastUpdated && (
          <p className="flex items-center gap-1.5 text-xs sm:text-sm font-semibold" style={{ color: '#6e5d59' }}>
            <Clock size={12} />
            புதுப்பிக்கப்பட்டது | Updated {lastUpdated.toLocaleTimeString('en-IN')}
          </p>
        )}
        <div className="flex gap-4">
          <button
            onClick={fetchInventory}
            disabled={refreshing}
            className="flex items-center gap-1.5 text-xs sm:text-sm font-bold transition-colors duration-200 hover:text-tvk-red-light cursor-pointer"
            style={{ color: '#800000' }}
          >
            <RefreshCw size={13} className={refreshing ? 'animate-spin' : ''} />
            இருப்பை புதுப்பி | Refresh Inventory
          </button>
        </div>
      </div>

      {/* Interactive Inventory Filter Bar */}
      <div className="flex justify-center gap-2 mb-10 overflow-x-auto pb-2 scrollbar-none w-full max-w-xl mx-auto">
        {[
          { type: 'ALL', label: 'அனைத்து பிரிவுகள் | All Groups' },
          { type: 'AVAILABLE', label: 'இருப்பில் உள்ளவை | In Stock' },
          { type: 'CRITICAL', label: 'மிகக் குறைந்த இருப்பு | Low/Critical' }
        ].map(btn => (
          <button
            key={btn.type}
            onClick={() => setFilterType(btn.type)}
            className={`px-4 py-2 rounded-full text-xs font-bold transition-all duration-300 cursor-pointer border shrink-0`}
            style={{
              background: filterType === btn.type ? '#800000' : '#ffffff',
              color: filterType === btn.type ? '#ffffff' : '#5c4e4b',
              borderColor: filterType === btn.type ? '#800000' : '#e6dfd0',
              boxShadow: filterType === btn.type ? '0 4px 12px rgba(128,0,0,0.15)' : 'none'
            }}
          >
            {btn.label}
          </button>
        ))}
      </div>

      {/* Loading Skeleton or Cards Grid */}
      {loading ? (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-12">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="rounded-2xl animate-pulse h-48 sm:h-52 bg-surface-3 border border-[#e6dfd0]" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 lg:gap-6 mb-12">
          {filteredInventory.map(item => {
            const style = bloodColors[item.blood_group] || bloodColors['A+']
            const units = item.units_available
            const isSelected = selectedGroup === item.blood_group
            const status = units === 0 ? 'இருப்பு இல்லை | Out of Stock' : units < 5 ? 'குறைந்த இருப்பு | Low Stock' : 'இருப்பில் உள்ளது | Available'
            const statusColor = units === 0 ? '#dc2626' : units < 5 ? '#d97706' : '#16a34a'

            return (
              <div
                key={item.id}
                onClick={() => handleGroupSelect(item.blood_group)}
                className={`rounded-2xl p-4 sm:p-6 flex flex-col items-center gap-3 sm:gap-4 transition-all duration-300 relative overflow-hidden group shadow-sm bg-white cursor-pointer`}
                style={{
                  border: `1px solid ${isSelected ? style.text : '#e6dfd0'}`,
                  transform: isSelected ? 'scale(1.03) translateY(-4px)' : 'none',
                  boxShadow: isSelected ? `0 12px 30px ${style.bg.replace('0.04', '0.12')}, 0 4px 12px rgba(35,25,23,0.03)` : '0 4px 16px rgba(35,25,23,0.01)',
                }}
              >
                {/* Visual glow on hover or select */}
                <div
                  className="absolute top-0 left-0 right-0 h-1 transition-opacity duration-300"
                  style={{
                    background: `linear-gradient(90deg, transparent, ${style.text}, transparent)`,
                    opacity: isSelected ? 1 : 0
                  }}
                />

                <div
                  className="w-12 h-12 sm:w-16 sm:h-16 rounded-full flex items-center justify-center transition-all duration-300"
                  style={{
                    background: style.bg,
                    border: `2px solid ${isSelected ? style.text : style.border}`,
                    transform: isSelected ? 'rotate(12deg)' : 'none'
                  }}
                >
                  <Droplets size={isSelected ? 32 : 26} style={{ color: style.text }} className="transition-all duration-300" />
                </div>

                <p className="text-2xl sm:text-3xl font-black" style={{ color: style.text }}>{item.blood_group}</p>

                <div className="text-center">
                  <p className="text-3xl sm:text-4xl font-black text-gray-800">{units}</p>
                  <p className="text-[10px] sm:text-xs font-bold mt-0.5" style={{ color: '#5c4e4b' }}>அலகுகள் உள்ளன | units available</p>
                </div>

                <div className="flex items-center gap-1.5 mt-auto">
                  <div
                    className="w-1.5 h-1.5 rounded-full animate-pulse"
                    style={{ background: units === 0 ? '#dc2626' : units < 5 ? '#d97706' : '#16a34a' }}
                  />
                  <span className="text-[10px] sm:text-xs font-bold" style={{ color: statusColor }}>{status}</span>
                </div>
              </div>
            )
          })}
        </div>
      )}

      {/* ── Interactive Compatibility Matcher Dashboard ── */}
      {selectedGroup && (
        <div
          className="card max-w-4xl mx-auto p-6 sm:p-8 mb-16 bg-white border border-[#e6dfd0] shadow-sm relative overflow-hidden transition-all duration-500"
          style={{
            borderColor: (bloodColors[selectedGroup] || bloodColors['A+']).border,
          }}
        >
          {/* Accent top stripe */}
          <div
            className="absolute top-0 left-0 right-0 h-1.5"
            style={{ background: `linear-gradient(90deg, #800000, ${(bloodColors[selectedGroup] || bloodColors['A+']).text}, #d4af37)` }}
          />

          <div className="flex flex-col md:flex-row items-center gap-8">
            {/* Selected blood display */}
            <div className="text-center md:border-r border-[#e6dfd0] md:pr-10 shrink-0">
              <div
                className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4 border-2"
                style={{
                  background: (bloodColors[selectedGroup] || bloodColors['A+']).bg,
                  borderColor: (bloodColors[selectedGroup] || bloodColors['A+']).text
                }}
              >
                <Droplets size={36} style={{ color: (bloodColors[selectedGroup] || bloodColors['A+']).text }} />
              </div>
              <h3 className="text-2xl font-black text-gray-800">பிரிவு | Group {selectedGroup}</h3>
              <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mt-1">தேர்ந்தெடுக்கப்பட்ட வகை | Selected Type</p>
              <div className="mt-4 px-3 py-1.5 rounded-xl border w-fit mx-auto text-xs font-extrabold" style={{ background: (bloodColors[selectedGroup] || bloodColors['A+']).bg, borderColor: (bloodColors[selectedGroup] || bloodColors['A+']).border, color: (bloodColors[selectedGroup] || bloodColors['A+']).text }}>
                {selectedInfo.units_available} அலகுகள் இருப்பில் உள்ளன | units in stock
              </div>
            </div>

            {/* Compatibility matching */}
            <div className="flex-1 w-full text-left space-y-5">
              <div className="flex items-center gap-2">
                <ShieldAlert size={16} className="text-tvk-red" />
                <h4 className="text-gray-800 font-extrabold text-sm uppercase tracking-wider">உயிரியல் இணக்கத்தன்மை | Biological Compatibility</h4>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Can Receive From */}
                <div className="p-4 rounded-xl border border-[#e6dfd0] bg-[#faf7f0]">
                  <p className="text-xs font-extrabold text-gray-400 uppercase tracking-wide mb-2.5">குருதி வழங்கக்கூடியவர்கள் | Compatible Donors (Can Receive From)</p>
                  <div className="flex flex-wrap gap-1.5">
                    {selectedCompat.receive.map(g => (
                      <span
                        key={g}
                        onClick={() => handleGroupSelect(g)}
                        className="px-2.5 py-1 rounded-lg text-xs font-black border transition-all duration-300 hover:scale-105 cursor-pointer"
                        style={{
                          background: (bloodColors[g] || bloodColors['A+']).bg,
                          borderColor: (bloodColors[g] || bloodColors['A+']).border,
                          color: (bloodColors[g] || bloodColors['A+']).text
                        }}
                      >
                        {g}
                      </span>
                    ))}
                  </div>
                  <p className="text-[10px] font-bold text-gray-500 mt-3 leading-normal">
                    இந்த இணக்கமான பிரிவுகளில் இருந்து குருதியை பாதுகாப்பாக பெற முடியும். Can safely receive red blood cell transplants from these compatible groups.
                  </p>
                </div>

                {/* Can Donate To */}
                <div className="p-4 rounded-xl border border-[#e6dfd0] bg-[#faf7f0]">
                  <p className="text-xs font-extrabold text-gray-400 uppercase tracking-wide mb-2.5">குருதி பெறக்கூடியவர்கள் | Compatible Recipients (Can Donate To)</p>
                  <div className="flex flex-wrap gap-1.5">
                    {selectedCompat.donate.map(g => (
                      <span
                        key={g}
                        onClick={() => handleGroupSelect(g)}
                        className="px-2.5 py-1 rounded-lg text-xs font-black border transition-all duration-300 hover:scale-105 cursor-pointer"
                        style={{
                          background: (bloodColors[g] || bloodColors['A+']).bg,
                          borderColor: (bloodColors[g] || bloodColors['A+']).border,
                          color: (bloodColors[g] || bloodColors['A+']).text
                        }}
                      >
                        {g}
                      </span>
                    ))}
                  </div>
                  <p className="text-[10px] font-bold text-gray-500 mt-3 leading-normal">
                    இந்த இணக்கமான பிரிவுகளுக்கு பாதுகாப்பாக குருதிக்கொடை அளிக்க முடியும். Can safely donate red blood cells to these compatible recipient groups.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── Interactive Split Screen Request & Register Desks ── */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto items-stretch">
        
        {/* Left Column: Request Emergency Stock */}
        <div id="request-blood" className="card bg-white p-6 sm:p-8 border border-[#e6dfd0] flex flex-col text-left space-y-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-tvk-red/5 border border-tvk-red/20 rounded-xl flex items-center justify-center text-tvk-red">
              <ShieldAlert size={20} />
            </div>
            <div>
              <h3 className="text-gray-800 font-extrabold text-base leading-none">அவசர குருதி வேண்டுதல் | Emergency Blood Request</h3>
              <p className="text-[#a6841b] text-xs font-bold mt-1.5">குருதி வேண்டுதல் முனையம் | Request Emergency Stock</p>
            </div>
          </div>

          <div className="w-full h-px" style={{ background: 'linear-gradient(90deg, #e6dfd0, transparent)' }} />

          <form onSubmit={handleRequestSubmit} className="space-y-4 flex-1 flex flex-col justify-between">
            <div className="space-y-4">
              {/* Patient Name */}
              <div>
                <label className="form-label text-xs">
                  <User size={12} className="inline mr-1 text-tvk-red" />
                  நோயாளி பெயர் | Patient Name
                </label>
                <input
                  type="text"
                  value={requestForm.patient_name}
                  onChange={e => setRequestForm({ ...requestForm, patient_name: e.target.value })}
                  placeholder="Patient full name"
                  className="form-input text-sm py-2 px-3 h-10"
                />
              </div>

              {/* Group & Units */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="form-label text-xs">
                    இரத்த பிரிவு | Blood Group
                  </label>
                  <select
                    value={requestForm.blood_group}
                    onChange={e => setRequestForm({ ...requestForm, blood_group: e.target.value })}
                    className="form-input text-sm py-2 px-3 h-10"
                  >
                    {inventory.map(item => (
                      <option key={item.blood_group} value={item.blood_group}>{item.blood_group}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="form-label text-xs">
                    தேவைப்படும் அலகுகள் | Units Needed
                  </label>
                  <select
                    value={requestForm.units_needed}
                    onChange={e => setRequestForm({ ...requestForm, units_needed: e.target.value })}
                    className="form-input text-sm py-2 px-3 h-10"
                  >
                    {[1,2,3,4,5,6,7,8,9,10].map(u => (
                      <option key={u} value={u}>{u} {u === 1 ? 'Unit' : 'Units'}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Hospital Location */}
              <div>
                <label className="form-label text-xs">
                  <MapPin size={12} className="inline mr-1 text-tvk-red" />
                  மருத்துவமனை மற்றும் வார்டு முகவரி | Hospital Name &amp; Ward Address
                </label>
                <input
                  type="text"
                  value={requestForm.hospital_name}
                  onChange={e => setRequestForm({ ...requestForm, hospital_name: e.target.value })}
                  placeholder="e.g. Stanley Hospital, Ward 4"
                  className="form-input text-sm py-2 px-3 h-10"
                />
              </div>

              {/* Contact Mobile */}
              <div>
                <label className="form-label text-xs">
                  <Phone size={12} className="inline mr-1 text-tvk-red" />
                  தொடர்பு எண் | Contact Mobile
                </label>
                <input
                  type="tel"
                  maxLength={10}
                  value={requestForm.phone_number}
                  onChange={e => setRequestForm({ ...requestForm, phone_number: e.target.value })}
                  placeholder="10-digit mobile number"
                  className="form-input text-sm py-2 px-3 h-10"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={requestSubmitting}
              className="btn-primary w-full justify-center text-sm py-3.5 mt-6 cursor-pointer"
              style={{ border: '1px solid rgba(212,175,55,0.3)' }}
            >
              {requestSubmitting ? (
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  <Send size={14} />
                  <span>அவசர எச்சரிக்கை சமர்ப்பி | Submit Emergency Alert</span>
                </>
              )}
            </button>
          </form>
        </div>

        {/* Right Column: Register in TVK Blood Brigade */}
        <div id="join-brigade" className="card bg-white p-6 sm:p-8 border border-[#e6dfd0] flex flex-col text-left space-y-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-[#d4af37]/10 border border-[#d4af37]/30 rounded-xl flex items-center justify-center text-[#a6841b]">
              <Award size={20} />
            </div>
            <div>
              <h3 className="text-gray-800 font-extrabold text-base leading-none">த.வெ.க குருதிக்கொடை வீரர் அணி | TVK Blood Brigade Force</h3>
              <p className="text-[#a6841b] text-xs font-bold mt-1.5">குருதிக்கொடை வீரர் அணி | Join Blood Brigade Force</p>
            </div>
          </div>

          <div className="w-full h-px" style={{ background: 'linear-gradient(90deg, #e6dfd0, transparent)' }} />

          <form onSubmit={handleDonorSubmit} className="space-y-4 flex-1 flex flex-col justify-between">
            <div className="space-y-4">
              {/* Donor Name */}
              <div>
                <label className="form-label text-xs">
                  <User size={12} className="inline mr-1 text-[#a6841b]" />
                  கொடையாளர் பெயர் | Donor Name
                </label>
                <input
                  type="text"
                  value={donorForm.donor_name}
                  onChange={e => setDonorForm({ ...donorForm, donor_name: e.target.value })}
                  placeholder="Your full name"
                  className="form-input text-sm py-2 px-3 h-10"
                />
              </div>

              {/* Group & Age */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="form-label text-xs">
                    இரத்த பிரிவு | Blood Group
                  </label>
                  <select
                    value={donorForm.blood_group}
                    onChange={e => setDonorForm({ ...donorForm, blood_group: e.target.value })}
                    className="form-input text-sm py-2 px-3 h-10"
                  >
                    {inventory.map(item => (
                      <option key={item.blood_group} value={item.blood_group}>{item.blood_group}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="form-label text-xs">
                    கொடையாளர் வயது | Donor Age
                  </label>
                  <input
                    type="number"
                    min={18}
                    max={65}
                    value={donorForm.age}
                    onChange={e => setDonorForm({ ...donorForm, age: e.target.value })}
                    placeholder="e.g. 24"
                    className="form-input text-sm py-2 px-3 h-10"
                  />
                </div>
              </div>

              {/* Phone Number */}
              <div>
                <label className="form-label text-xs">
                  <Phone size={12} className="inline mr-1 text-[#a6841b]" />
                  செயலில் உள்ள அலைபேசி எண் | Active Mobile Phone
                </label>
                <input
                  type="tel"
                  maxLength={10}
                  value={donorForm.phone_number}
                  onChange={e => setDonorForm({ ...donorForm, phone_number: e.target.value })}
                  placeholder="10-digit mobile number"
                  className="form-input text-sm py-2 px-3 h-10"
                />
              </div>

              {/* Pledge note */}
              <div className="p-4 rounded-xl border border-[#e6dfd0] bg-[#faf7f0] text-[11px] font-bold text-gray-500 leading-relaxed mt-2">
                📢 <strong className="text-gray-800">த.வெ.க உறுதிமொழி | TVK Oath:</strong> By joining, I pledge to donate blood voluntarily to any local hospital in case of emergency ward requirements coordinated by the TVK constituency desk.
              </div>
            </div>

            <button
              type="submit"
              disabled={donorSubmitting}
              className="btn-yellow w-full justify-center text-sm py-3.5 mt-6 cursor-pointer"
              style={{ border: '1px solid rgba(212,175,55,0.3)' }}
            >
              {donorSubmitting ? (
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  <Plus size={14} />
                  <span>குருதிக்கொடை வீரர் அணியில் சேர் | Join Blood Brigade Force</span>
                </>
              )}
            </button>
          </form>
        </div>

      </div>

    </div>
  )
}
