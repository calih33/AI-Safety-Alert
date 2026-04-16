interface TicketStatusProps {
  status: "needs-attention" | "in-progress" | "resolved";
}

export default function TicketStatusBadge({ status }: TicketStatusProps) {
  const labelMap = {
    "needs-attention": "Needs Attention",
    "in-progress": "In Progress",
    resolved: "Resolved",
  };

  const classMap = {
    "needs-attention": "bg-red-100 text-red-800 border border-red-200",
    "in-progress": "bg-yellow-100 text-yellow-800 border border-yellow-200",
    resolved: "bg-green-100 text-green-800 border border-green-200",
  };

  return (
    <span className={`inline-flex px-3 py-1 rounded-full text-xs font-medium ${classMap[status]}`}>
      {labelMap[status]}
    </span>
  );
}