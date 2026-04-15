export interface Ticket {
  id: number;
  title: string;
  content: string;
  status: "needs-attention" | "in-progress" | "resolved";
  priority: number;
  created_at: string;
  updated_at: string;
  ai_summary?: string | null;
  location?: {
    building_prefix?: string;
    room_number?: string;
  } | null;
  department?: {
    id: number;
    name: string;
  } | null;
}