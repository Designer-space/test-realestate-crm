'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import { CheckCircle, User, Phone, Mail, Calendar } from 'lucide-react'
import { StatusBadge, FormTypeBadge } from '@/components/Badges'
import type { Lead } from '@/lib/supabase'

const STATUSES = ['New', 'Contacted', 'Qualified', 'Follow-up', 'Converted', 'Rejected']

function isUrl(value: unknown): boolean {
  if (typeof value !== 'string') return false
  try {
    const url = new URL(value)
    return url.protocol === 'http:' || url.protocol === 'https:'
  } catch {
    return false
  }
}

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
        <div className="text-muted-foreground text-sm">Loading lead...</div>
      </div>
    )
  }

  if (!lead) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground text-sm">Lead not found</p>
        <Link href="/leads" className="text-primary text-sm hover:underline mt-2 inline-block">
          Back to leads
        </Link>
      </div>
    )
  }

  const labels = METADATA_LABELS[lead.form_type] || {}
  const metadataEntries = Object.entries(lead.metadata).filter(([key]) => key in labels)

  return (
    <div className="max-w-3xl space-y-6">
      <Link href="/leads" className="text-muted-foreground text-sm hover:text-foreground transition-colors">
        &larr; Back to leads
      </Link>

      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl text-foreground" style={{ fontFamily: 'var(--font-poppins), Poppins, sans-serif', fontWeight: 700 }}>
            {lead.full_name}
          </h1>
          <div className="flex items-center gap-2 mt-2">
            <FormTypeBadge formType={lead.form_type} />
            <span className="text-muted-foreground text-xs">&bull;</span>
            <span className="text-muted-foreground text-xs">
              {new Date(lead.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
            </span>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <select
            value={lead.status}
            onChange={(e) => handleStatusChange(e.target.value)}
            className="bg-card border border-border rounded-lg text-card-foreground text-sm px-3 py-2 focus:outline-none focus:border-primary/50"
          >
            {STATUSES.map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
          {saved && (
            <div className="flex items-center gap-1 text-status-green text-sm">
              <CheckCircle size={14} />
              <span>Saved</span>
            </div>
          )}
        </div>
      </div>

      <div className="bg-card border border-border rounded-xl p-5">
        <h3 className="text-xs uppercase tracking-widest text-muted-foreground mb-4" style={{ fontFamily: 'var(--font-roboto), Roboto, sans-serif', fontWeight: 700 }}>
          Contact Information
        </h3>
        <div className="grid grid-cols-2 gap-4">
          <FieldRow icon={<User size={14} />} label="Full Name" value={lead.full_name} />
          <FieldRow icon={<Phone size={14} />} label="Phone" value={lead.phone_number} />
          <FieldRow icon={<Mail size={14} />} label="Email" value={lead.email || '—'} />
          <FieldRow icon={<Calendar size={14} />} label="Submitted" value={new Date(lead.created_at).toLocaleDateString('en-IN')} />
        </div>
      </div>

      <div className="bg-card border border-border rounded-xl p-5">
        <h3 className="text-xs uppercase tracking-widest text-muted-foreground mb-4" style={{ fontFamily: 'var(--font-roboto), Roboto, sans-serif', fontWeight: 700 }}>
          Current Status
        </h3>
        <StatusBadge status={lead.status} />
      </div>

      <div className="bg-card border border-border rounded-xl p-5">
        <h3 className="text-xs uppercase tracking-widest text-muted-foreground mb-4" style={{ fontFamily: 'var(--font-roboto), Roboto, sans-serif', fontWeight: 700 }}>
          {lead.form_type} Details
        </h3>
        <div className="grid grid-cols-2 gap-4">
          {metadataEntries.map(([key, value]) => (
            <div key={key}>
              <div className="text-muted-foreground text-xs mb-0.5">{labels[key]}</div>
              {isUrl(value) ? (
                <a
                  href={String(value)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary text-sm hover:underline break-all"
                  style={{ fontFamily: 'var(--font-roboto), Roboto, sans-serif', fontWeight: 700 }}
                >
                  {String(value)}
                </a>
              ) : (
                <p className="text-card-foreground text-sm" style={{ fontFamily: 'var(--font-roboto), Roboto, sans-serif', fontWeight: 700 }}>
                  {String(value) || '—'}
                </p>
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="bg-card border border-border rounded-xl p-5">
        <h3 className="text-xs uppercase tracking-widest text-muted-foreground mb-4" style={{ fontFamily: 'var(--font-roboto), Roboto, sans-serif', fontWeight: 700 }}>
          Debug
        </h3>
        <span className="font-mono text-muted-foreground text-xs">{lead.id}</span>
      </div>
    </div>
  )
}

function FieldRow({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="flex items-center gap-3">
      <div className="w-8 h-8 rounded-lg bg-accent flex items-center justify-center text-muted-foreground">
        {icon}
      </div>
      <div>
        <div className="text-muted-foreground text-xs">{label}</div>
        <div className="text-card-foreground text-sm" style={{ fontFamily: 'var(--font-roboto), Roboto, sans-serif', fontWeight: 700 }}>
          {value}
        </div>
      </div>
    </div>
  )
}
