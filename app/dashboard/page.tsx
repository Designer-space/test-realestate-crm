'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Users, Clock, PhoneCall, CheckCircle, TrendingUp } from 'lucide-react'
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts'
import { StatusBadge, FormTypeBadge } from '@/components/Badges'
import { Card, CardContent, CardHeader, CardTitle, CardAction } from '@/components/ui/card'
import { buttonVariants } from '@/components/ui/button'
import type { Lead } from '@/lib/supabase'

const typeColors: Record<string, string> = {
  'SRA Opportunity': '#D60039',
  Redevelopment: '#60AED0',
  'Open Plot': '#166846',
  Others: 'hsl(var(--muted-foreground))',
}

export default function DashboardPage() {
  const [leads, setLeads] = useState<Lead[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/leads')
      .then((res) => res.json())
      .then((data) => setLeads(data))
      .finally(() => setLoading(false))
  }, [])

  const total = leads.length
  const newCount = leads.filter((l) => l.status === 'New').length
  const contactedCount = leads.filter((l) => l.status === 'Contacted').length
  const convertedCount = leads.filter((l) => l.status === 'Converted').length

  const typeCounts = leads.reduce(
    (acc, lead) => {
      acc[lead.form_type] = (acc[lead.form_type] || 0) + 1
      return acc
    },
    {} as Record<string, number>
  )

  const chartData = Object.entries(typeCounts).map(([name, value]) => ({ name, value }))
  const recentLeads = leads.slice(0, 10)

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-muted-foreground text-sm">Loading dashboard...</div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl text-foreground" style={{ fontFamily: 'var(--font-poppins), Poppins, sans-serif', fontWeight: 700 }}>
          Dashboard
        </h1>
        <p className="text-muted-foreground text-sm mt-1">Lead pipeline overview</p>
      </div>

      <div className="grid grid-cols-4 gap-4">
        <StatCard icon={<Users size={16} />} label="Total Leads" value={total} iconBg="bg-muted" />
        <StatCard icon={<Clock size={16} />} label="New" value={newCount} iconBg="bg-status-blue/15" />
        <StatCard icon={<PhoneCall size={16} />} label="Contacted" value={contactedCount} iconBg="bg-status-pink/15" />
        <StatCard icon={<CheckCircle size={16} />} label="Converted" value={convertedCount} iconBg="bg-status-green/15" />
      </div>

      <div className="grid grid-cols-5 gap-6">
        <Card className="col-span-2">
          <CardHeader className="border-b">
            <CardTitle className="flex items-center gap-2 text-sm">
              <TrendingUp size={16} className="text-primary" />
              Leads by Type
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-4">
            {chartData.length === 0 ? (
              <div className="flex items-center justify-center h-48 text-muted-foreground text-sm">No data yet</div>
            ) : (
              <ResponsiveContainer width="100%" height={220}>
                <BarChart data={chartData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                  <XAxis
                    dataKey="name"
                    tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 11 }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <YAxis
                    tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 11 }}
                    axisLine={false}
                    tickLine={false}
                    allowDecimals={false}
                  />
                  <Tooltip
                    contentStyle={{
                      background: 'hsl(var(--card))',
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '8px',
                      color: 'hsl(var(--card-foreground))',
                      fontSize: 12,
                    }}
                    cursor={{ fill: 'hsl(var(--accent))' }}
                  />
                  <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                    {chartData.map((entry) => (
                      <Cell key={entry.name} fill={typeColors[entry.name] || 'hsl(var(--muted-foreground))'} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>

        <Card className="col-span-3">
          <CardHeader className="border-b">
            <CardTitle className="text-sm">Recent Leads</CardTitle>
            <CardAction>
              <Link href="/leads" className={buttonVariants({ variant: 'ghost', size: 'sm' })}>View all &rarr;</Link>
            </CardAction>
          </CardHeader>
          <CardContent className="pt-4">
            {recentLeads.length === 0 ? (
              <div className="flex items-center justify-center h-48 text-muted-foreground text-sm">No leads yet — submit a form to get started</div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-border">
                      <th className="text-left text-xs uppercase tracking-widest text-muted-foreground py-3" style={{ fontFamily: 'var(--font-roboto), Roboto, sans-serif', fontWeight: 700 }}>Name</th>
                      <th className="text-left text-xs uppercase tracking-widest text-muted-foreground py-3" style={{ fontFamily: 'var(--font-roboto), Roboto, sans-serif', fontWeight: 700 }}>Phone</th>
                      <th className="text-left text-xs uppercase tracking-widest text-muted-foreground py-3" style={{ fontFamily: 'var(--font-roboto), Roboto, sans-serif', fontWeight: 700 }}>Form Type</th>
                      <th className="text-left text-xs uppercase tracking-widest text-muted-foreground py-3" style={{ fontFamily: 'var(--font-roboto), Roboto, sans-serif', fontWeight: 700 }}>Status</th>
                      <th className="text-left text-xs uppercase tracking-widest text-muted-foreground py-3" style={{ fontFamily: 'var(--font-roboto), Roboto, sans-serif', fontWeight: 700 }}>Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentLeads.map((lead) => (
                      <tr key={lead.id} className="border-b border-border hover:bg-accent/50">
                        <td className="py-3">
                          <Link href={`/leads/${lead.id}`} className="text-sm hover:text-primary transition-colors font-medium">
                            {lead.full_name}
                          </Link>
                        </td>
                        <td className="text-sm text-muted-foreground py-3">{lead.phone_number}</td>
                        <td className="py-3"><FormTypeBadge formType={lead.form_type} /></td>
                        <td className="py-3"><StatusBadge status={lead.status} /></td>
                        <td className="text-muted-foreground text-xs py-3">
                          {new Date(lead.created_at).toLocaleDateString('en-IN')}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

function StatCard({ icon, label, value, iconBg }: { icon: React.ReactNode; label: string; value: number; iconBg: string }) {
  return (
    <Card>
      <CardContent>
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs uppercase tracking-widest text-muted-foreground font-bold">{label}</span>
          <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${iconBg}`}>
            {icon}
          </div>
        </div>
        <div className="text-3xl text-foreground" style={{ fontFamily: 'var(--font-poppins), Poppins, sans-serif', fontWeight: 700 }}>
          {value}
        </div>
      </CardContent>
    </Card>
  )
}
