'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import { CheckCircle, User, Phone, Mail, Calendar } from 'lucide-react'
import { StatusBadge, FormTypeBadge } from '@/components/Badges'
import type { Lead } from '@/lib/supabase'

const STATUSES = ['New', 'Contacted', 'Qualified', 'Follow-up', 'Converted', 'Rejected']

const METADATA_LABELS: Record<string, Record<string, string>> = {
  'SRA Opportunity': {
    society_name: 'Society Name',
    number_of_families: 'Families',
    carpet_area_sqft: 'Carpet Area (sqft)',
    year_built: 'Year Built',
    address: 'Address',
    age_of_building: 'Building Age',
    plot_size: 'Plot Size',
    google_drive_link: 'Google Drive Link',
    file_upload: 'Attached File',
  },
  Redevelopment: {
    building_name: 'Building Name',
    number_of_floors: 'Floors',
    built_up_area: 'Built-up Area',
    age_of_building: 'Age of Building',
    plot_area: 'Plot Area',
    number_of_units: 'Units',
    google_drive_link: 'Google Drive Link',
    file_upload: 'Attached File',
  },
  'Open Plot': {
    plot_location: 'Plot Location',
    plot_size: 'Plot Size',
    zone: 'Zone',
    road_frontage: 'Road Frontage',
    families: 'Families',
    google_drive_link: 'Google Drive Link',
    file_upload: 'Attached File',
  },
  Others: {
    opportunity_type: 'Opportunity Type',
    property_description: 'Description',
    google_drive_link: 'Google Drive Link',
    file_upload: 'Attached File',
  },
}

export default function LeadDetailPage() {
  const params = useParams()
  const id = params.id as string
  const [lead, setLead] = useState<Lead | null>(null)
  const [loading, setLoading] = useState(true)
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    fetch(`/api/leads/${id}`)
      .then((res) => res.json())
      .then((data) => setLead(data))
      .finally(() => setLoading(false))
  }, [id])

  const handleStatusChange = async (newStatus: string) => {
    if (!lead) return
    setLead({ ...lead, status: newStatus as Lead['status'] })

    await fetch(`/api/leads/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: newStatus }),
    })

    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-white/40 text-sm">Loading lead...</div>
      </div>
    )
  }

  if (!lead) {
    return (
      <div className="text-center py-12">
        <p className="text-white/30 text-sm">Lead not found</p>
        <Link href="/leads" className="text-[#D60039] text-sm hover:underline mt-2 inline-block">
          Back to leads
        </Link>
      </div>
    )
  }

  const labels = METADATA_LABELS[lead.form_type] || {}
  const metadataEntries = Object.entries(lead.metadata).filter(([key]) => key in labels)

  return (
    <div className="max-w-3xl space-y-6">
      <Link href="/leads" className="text-white/40 text-sm hover:text-white/70 transition-colors">
        &larr; Back to leads
      </Link>

      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl text-white" style={{ fontFamily: 'var(--font-poppins), Poppins, sans-serif', fontWeight: 700 }}>
            {lead.full_name}
          </h1>
          <div className="flex items-center gap-2 mt-2">
            <FormTypeBadge formType={lead.form_type} />
            <span className="text-white/20 text-xs">&bull;</span>
            <span className="text-white/40 text-xs">
              {new Date(lead.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
            </span>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <select
            value={lead.status}
            onChange={(e) => handleStatusChange(e.target.value)}
            className="bg-[#1e2352] border border-white/10 rounded-lg text-white text-sm px-3 py-2 focus:outline-none focus:border-[#D60039]/50"
          >
            {STATUSES.map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
          {saved && (
            <div className="flex items-center gap-1 text-[#67B290] text-sm">
              <CheckCircle size={14} />
              <span>Saved</span>
            </div>
          )}
        </div>
      </div>

      <div className="bg-[#1e2352] border border-white/8 rounded-xl p-5">
        <h3 className="text-xs uppercase tracking-widest text-white/30 mb-4" style={{ fontFamily: 'var(--font-roboto), Roboto, sans-serif', fontWeight: 700 }}>
          Contact Information
        </h3>
        <div className="grid grid-cols-2 gap-4">
          <FieldRow icon={<User size={14} />} label="Full Name" value={lead.full_name} />
          <FieldRow icon={<Phone size={14} />} label="Phone" value={lead.phone_number} />
          <FieldRow icon={<Mail size={14} />} label="Email" value={lead.email || '—'} />
          <FieldRow icon={<Calendar size={14} />} label="Submitted" value={new Date(lead.created_at).toLocaleDateString('en-IN')} />
        </div>
      </div>

      <div className="bg-[#1e2352] border border-white/8 rounded-xl p-5">
        <h3 className="text-xs uppercase tracking-widest text-white/30 mb-4" style={{ fontFamily: 'var(--font-roboto), Roboto, sans-serif', fontWeight: 700 }}>
          Current Status
        </h3>
        <StatusBadge status={lead.status} />
      </div>

      <div className="bg-[#1e2352] border border-white/8 rounded-xl p-5">
        <h3 className="text-xs uppercase tracking-widest text-white/30 mb-4" style={{ fontFamily: 'var(--font-roboto), Roboto, sans-serif', fontWeight: 700 }}>
          {lead.form_type} Details
        </h3>
        <div className="grid grid-cols-2 gap-4">
          {metadataEntries.map(([key, value]) => (
            <div key={key}>
              <div className="text-white/30 text-xs mb-0.5">{labels[key]}</div>
              <div className="text-white text-sm" style={{ fontFamily: 'var(--font-roboto), Roboto, sans-serif', fontWeight: 700 }}>
                {String(value) || '—'}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-[#1e2352] border border-white/8 rounded-xl p-5">
        <h3 className="text-xs uppercase tracking-widest text-white/30 mb-4" style={{ fontFamily: 'var(--font-roboto), Roboto, sans-serif', fontWeight: 700 }}>
          Debug
        </h3>
        <span className="font-mono text-white/20 text-xs">{lead.id}</span>
      </div>
    </div>
  )
}

function FieldRow({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="flex items-center gap-3">
      <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center text-white/40">
        {icon}
      </div>
      <div>
        <div className="text-white/30 text-xs">{label}</div>
        <div className="text-white text-sm" style={{ fontFamily: 'var(--font-roboto), Roboto, sans-serif', fontWeight: 700 }}>
          {value}
        </div>
      </div>
    </div>
  )
}
