'use client'

const statusColors: Record<string, string> = {
  New: 'bg-[#60AED0]/15 text-[#60AED0] border border-[#60AED0]/25',
  Contacted: 'bg-[#F978A3]/15 text-[#F978A3] border border-[#F978A3]/25',
  Qualified: 'bg-[#67B290]/15 text-[#67B290] border border-[#67B290]/25',
  'Follow-up': 'bg-white/10 text-white/70 border border-white/15',
  Converted: 'bg-[#166846]/20 text-[#67B290] border border-[#166846]/30',
  Rejected: 'bg-[#D60039]/15 text-[#D60039] border border-[#D60039]/25',
}

const formTypeColors: Record<string, string> = {
  'SRA Opportunity': 'bg-[#D60039]/15 text-[#D60039] border border-[#D60039]/25',
  Redevelopment: 'bg-[#1B1D4D]/60 text-[#60AED0] border border-[#60AED0]/25',
  'Open Plot': 'bg-[#166846]/20 text-[#67B290] border border-[#166846]/30',
  Others: 'bg-white/8 text-white/50 border border-white/12',
}

export function StatusBadge({ status }: { status: string }) {
  return (
    <span
      className={`inline-flex px-2 py-0.5 rounded-md text-xs font-medium ${statusColors[status] || 'bg-white/10 text-white/50 border border-white/15'}`}
    >
      {status}
    </span>
  )
}

export function FormTypeBadge({ formType }: { formType: string }) {
  return (
    <span
      className={`inline-flex px-2 py-0.5 rounded-md text-xs font-medium ${formTypeColors[formType] || 'bg-white/8 text-white/50 border border-white/12'}`}
    >
      {formType}
    </span>
  )
}
