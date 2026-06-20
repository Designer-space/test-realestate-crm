'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { StatusBadge, FormTypeBadge } from '@/components/Badges'
import type { Lead } from '@/lib/supabase'

const FORM_TYPES = ['SRA Opportunity', 'Redevelopment', 'Open Plot', 'Others']
const STATUSES = ['New', 'Contacted', 'Qualified', 'Follow-up', 'Converted', 'Rejected']

export default function LeadsPage() {
  const [leads, setLeads] = useState<Lead[]>([])
  const [loading, setLoading] = useState(true)
  const [formFilter, setFormFilter] = useState('')
  const [statusFilter, setStatusFilter] = useState('')

  useEffect(() => {
    fetch('/api/leads')
      .then((res) => res.json())
      .then((data) => setLeads(data))
      .finally(() => setLoading(false))
  }, [])

  const filtered = leads.filter((lead) => {
    if (formFilter && lead.form_type !== formFilter) return false
    if (statusFilter && lead.status !== statusFilter) return false
    return true
  })

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-muted-foreground text-sm">Loading leads...</div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl text-foreground" style={{ fontFamily: 'var(--font-poppins), Poppins, sans-serif', fontWeight: 700 }}>
          All Leads
        </h1>
        <p className="text-muted-foreground text-sm mt-1">{filtered.length} leads found</p>
      </div>

      <div className="flex gap-3">
        <div>
          <label className="block text-xs uppercase tracking-widest text-muted-foreground mb-1.5" style={{ fontFamily: 'var(--font-roboto), Roboto, sans-serif', fontWeight: 700 }}>Form Type</label>
          <select
            value={formFilter}
            onChange={(e) => setFormFilter(e.target.value)}
            className="bg-card border border-border rounded-lg text-card-foreground text-sm px-3 py-2 focus:outline-none focus:border-primary/50"
          >
            <option value="">All Types</option>
            {FORM_TYPES.map((t) => (
              <option key={t} value={t}>{t}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-xs uppercase tracking-widest text-muted-foreground mb-1.5" style={{ fontFamily: 'var(--font-roboto), Roboto, sans-serif', fontWeight: 700 }}>Status</label>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-card border border-border rounded-lg text-card-foreground text-sm px-3 py-2 focus:outline-none focus:border-primary/50"
          >
            <option value="">All Statuses</option>
            {STATUSES.map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="bg-card border border-border rounded-xl overflow-hidden">
        <table className="w-full">
          <thead>
            <tr>
              <th className="text-left text-xs uppercase tracking-widest text-muted-foreground px-5 py-3.5" style={{ fontFamily: 'var(--font-roboto), Roboto, sans-serif', fontWeight: 700 }}>Name</th>
              <th className="text-left text-xs uppercase tracking-widest text-muted-foreground px-5 py-3.5" style={{ fontFamily: 'var(--font-roboto), Roboto, sans-serif', fontWeight: 700 }}>Phone</th>
              <th className="text-left text-xs uppercase tracking-widest text-muted-foreground px-5 py-3.5" style={{ fontFamily: 'var(--font-roboto), Roboto, sans-serif', fontWeight: 700 }}>Email</th>
              <th className="text-left text-xs uppercase tracking-widest text-muted-foreground px-5 py-3.5" style={{ fontFamily: 'var(--font-roboto), Roboto, sans-serif', fontWeight: 700 }}>Form Type</th>
              <th className="text-left text-xs uppercase tracking-widest text-muted-foreground px-5 py-3.5" style={{ fontFamily: 'var(--font-roboto), Roboto, sans-serif', fontWeight: 700 }}>Status</th>
              <th className="text-left text-xs uppercase tracking-widest text-muted-foreground px-5 py-3.5" style={{ fontFamily: 'var(--font-roboto), Roboto, sans-serif', fontWeight: 700 }}>Date Submitted</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={6} className="text-center py-12">
                  <div className="text-muted-foreground text-sm mb-2">No leads found</div>
                  {(formFilter || statusFilter) && (
                    <button
                      onClick={() => { setFormFilter(''); setStatusFilter('') }}
                      className="text-primary text-sm hover:underline"
                    >
                      Clear filters
                    </button>
                  )}
                </td>
              </tr>
            ) : (
              filtered.map((lead) => (
                <tr key={lead.id} className="hover:bg-accent/50">
                  <td className="px-5 py-3.5">
                    <Link href={`/leads/${lead.id}`} className="text-sm hover:text-primary transition-colors" style={{ fontFamily: 'var(--font-roboto), Roboto, sans-serif', fontWeight: 500 }}>
                      {lead.full_name}
                    </Link>
                  </td>
                  <td className="px-5 py-3.5 text-sm text-muted-foreground">{lead.phone_number}</td>
                  <td className="px-5 py-3.5 text-sm text-muted-foreground">{lead.email || '—'}</td>
                  <td className="px-5 py-3.5"><FormTypeBadge formType={lead.form_type} /></td>
                  <td className="px-5 py-3.5"><StatusBadge status={lead.status} /></td>
                  <td className="px-5 py-3.5 text-muted-foreground text-xs">
                    {new Date(lead.created_at).toLocaleDateString('en-IN')}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
