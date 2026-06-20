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
  New: "bg-status-blue/15 text-status-blue border-status-blue/25",
  Contacted: "bg-status-pink/15 text-status-pink border-status-pink/25",
  Qualified: "bg-status-green/15 text-status-green border-status-green/25",
  "Follow-up": "",
  Converted: "bg-status-dark-green/20 text-status-green border-status-dark-green/30",
  Rejected: "bg-primary/15 text-primary border-primary/25",
}

const formTypeColors: Record<string, string> = {
  "SRA Opportunity": "bg-primary/15 text-primary border-primary/25",
  Redevelopment: "bg-status-blue/15 text-status-blue border-status-blue/25",
  "Open Plot": "bg-status-dark-green/20 text-status-green border-status-dark-green/30",
  Others: "border-black/25 text-black",
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
