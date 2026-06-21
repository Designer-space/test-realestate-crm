import { Badge } from "@/components/ui/badge"

const statusVariants: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
  New: "secondary",
  Contacted: "secondary",
  Qualified: "secondary",
  "Follow-up": "outline",
  Converted: "default",
  Rejected: "destructive",
}

const statusColors: Record<string, string> = {
  New: 'bg-blue-50  text-blue-950  border border-blue-200  dark:bg-blue-900  dark:text-blue-50  dark:border-blue-700',
  Contacted: 'bg-pink-50  text-pink-950  border border-pink-200  dark:bg-pink-900  dark:text-pink-50  dark:border-pink-700',
  Qualified: 'bg-teal-50  text-teal-950  border border-teal-200  dark:bg-teal-900  dark:text-teal-50  dark:border-teal-700',
  'Follow-up': 'bg-amber-50 text-amber-950 border border-amber-200 dark:bg-amber-900 dark:text-amber-50 dark:border-amber-700',
  Converted: 'bg-green-50 text-green-950 border border-green-200 dark:bg-green-900 dark:text-green-50 dark:border-green-700',
  Rejected: 'bg-red-50   text-red-950   border border-red-200   dark:bg-red-900   dark:text-red-50   dark:border-red-700',
}
const formTypeColors: Record<string, string> = {
  Redevelopment: 'bg-sky-50     text-sky-950     border border-sky-200     dark:bg-sky-900     dark:text-sky-50     dark:border-sky-700',
  'SRA Opportunity': 'bg-rose-50    text-rose-950    border border-rose-200    dark:bg-rose-900    dark:text-rose-50    dark:border-rose-700',
  'Open Plot': 'bg-emerald-50 text-emerald-950 border border-emerald-200 dark:bg-emerald-900 dark:text-emerald-50 dark:border-emerald-700',
  Others: 'bg-slate-100  text-slate-900   border border-slate-200   dark:bg-slate-700   dark:text-slate-100  dark:border-slate-600',
}

export function StatusBadge({ status }: { status: string }) {
  const customColor = statusColors[status]
  return (
    <Badge
      variant={statusVariants[status] || "outline"}
      className={customColor ? `border ${customColor}` : undefined}
    >
      {status}
    </Badge>
  )
}

export function FormTypeBadge({ formType }: { formType: string }) {
  const customColor = formTypeColors[formType]
  return (
    <Badge
      variant="secondary"
      className={customColor ? `border ${customColor}` : undefined}
    >
      {formType}
    </Badge>
  )
}
