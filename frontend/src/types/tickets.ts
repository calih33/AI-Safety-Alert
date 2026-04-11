export interface Ticket {
  id: number;
  title: string;
  content: string;
  status: "needs-attention" | "in-progress" | "resolved";
  priority: number | string;
  created_at: string;
  updated_at: string;
}