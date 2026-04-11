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
    "needs-attention": "bg-gray-100 text-gray-800 border border-gray-300",
    "in-progress": "bg-gray-200 text-gray-900 border border-gray-300",
    resolved: "bg-gray-50 text-gray-700 border border-gray-300",
  };

  return (
    <span className={`inline-flex px-3 py-1 rounded-full text-xs font-medium ${classMap[status]}`}>
      {labelMap[status]}
    </span> 
  );
}