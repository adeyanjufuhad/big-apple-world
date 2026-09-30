import { cn } from "@/lib/cn";
import { CheckCircle2, Clock, XCircle } from "lucide-react";

const styles = {
  pending: { label: "Pending", icon: Clock, className: "bg-amber-50 text-amber-800 ring-amber-200" },
  paid: { label: "Paid", icon: CheckCircle2, className: "bg-emerald-50 text-emerald-800 ring-emerald-200" },
  cancelled: { label: "Cancelled", icon: XCircle, className: "bg-sand text-muted ring-line" },
};

export function StatusBadge({ status }: { status: keyof typeof styles }) {
  const { label, icon: Icon, className } = styles[status];
  return (
    <span className={cn("inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-medium ring-1", className)}>
      <Icon className="size-3.5" />
      {label}
    </span>
  );
}
