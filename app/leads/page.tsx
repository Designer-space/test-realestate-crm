'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { StatusBadge, FormTypeBadge } from '@/components/Badges'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
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
    if (formFilter && formFilter !== 'all' && lead.form_type !== formFilter) return false
    if (statusFilter && statusFilter !== 'all' && lead.status !== statusFilter) return false
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
          <label className="block text-xs uppercase tracking-widest text-muted-foreground mb-1.5 font-bold">Form Type</label>
          <Select value={formFilter} onValueChange={(v) => setFormFilter(v ?? '')}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="All Types" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              {FORM_TYPES.map((t) => (
                <SelectItem key={t} value={t}>{t}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div>
          <label className="block text-xs uppercase tracking-widest text-muted-foreground mb-1.5 font-bold">Status</label>
          <Select value={statusFilter} onValueChange={(v) => setStatusFilter(v ?? '')}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="All Statuses" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              {STATUSES.map((s) => (
                <SelectItem key={s} value={s}>{s}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <Card>
        <CardContent className="p-0">
          <table className="w-full">
            <thead>
              <tr>
                <th className="text-left text-xs uppercase tracking-widest text-muted-foreground px-5 py-3.5 font-bold">Name</th>
                <th className="text-left text-xs uppercase tracking-widest text-muted-foreground px-5 py-3.5 font-bold">Phone</th>
                <th className="text-left text-xs uppercase tracking-widest text-muted-foreground px-5 py-3.5 font-bold">Email</th>
                <th className="text-left text-xs uppercase tracking-widest text-muted-foreground px-5 py-3.5 font-bold">Form Type</th>
                <th className="text-left text-xs uppercase tracking-widest text-muted-foreground px-5 py-3.5 font-bold">Status</th>
                <th className="text-left text-xs uppercase tracking-widest text-muted-foreground px-5 py-3.5 font-bold">Date Submitted</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center py-12">
                    <div className="text-muted-foreground text-sm mb-2">No leads found</div>
                    {(formFilter || statusFilter) && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => { setFormFilter(''); setStatusFilter('') }}
                        className="text-primary hover:text-primary/80"
                      >
                        Clear filters
                      </Button>
                    )}
                  </td>
                </tr>
              ) : (
                filtered.map((lead) => (
                  <tr key={lead.id} className="hover:bg-accent/50">
                    <td className="px-5 py-3.5">
                      <Link href={`/leads/${lead.id}`} className="text-sm hover:text-primary transition-colors font-medium">
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
        </CardContent>
      </Card>
    </div>
  )
}
