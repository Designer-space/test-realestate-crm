'use client'

const statusColors: Record<string, string> = {
  New: 'bg-status-blue/15 text-status-blue border border-status-blue/25',
  Contacted: 'bg-status-pink/15 text-status-pink border border-status-pink/25',
  Qualified: 'bg-status-green/15 text-status-green border border-status-green/25',
  'Follow-up': 'bg-muted text-muted-foreground border border-border',
  Converted: 'bg-status-dark-green/20 text-status-green border border-status-dark-green/30',
  Rejected: 'bg-primary/15 text-primary border border-primary/25',
}

const formTypeColors: Record<string, string> = {
  'SRA Opportunity': 'bg-primary/15 text-primary border border-primary/25',
  Redevelopment: 'bg-status-blue/60 text-status-blue border border-status-blue/25',
  'Open Plot': 'bg-status-dark-green/20 text-status-green border border-status-dark-green/30',
  Others: 'bg-muted text-muted-foreground border border-border',
}

export function StatusBadge({ status }: { status: string }) {
  return (
    <span
      className={`inline-flex px-2 py-0.5 rounded-md text-xs font-medium ${statusColors[status] || 'bg-muted text-muted-foreground border border-border'}`}
    >
      {status}
    </span>
  )
}

export function FormTypeBadge({ formType }: { formType: string }) {
  return (
    <span
      className={`inline-flex px-2 py-0.5 rounded-md text-xs font-medium ${formTypeColors[formType] || 'bg-muted text-muted-foreground border border-border'}`}
    >
      {formType}
    </span>
  )
}
