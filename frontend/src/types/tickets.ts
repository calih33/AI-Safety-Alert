export interface Ticket {
  id: number;
  title: string;
  content: string;
  status: "needs-attention" | "in-progress" | "resolved";
  priority: number | string;
  created_at: string;
  updated_at: string;
  department?: {
    id: number;
    name: string;
  };
  location?: {
    id: number;
    building_prefix: string;
    room_number: string;
  };
  history?: {
    id: number;
    old_status: string;
    new_status: string;
    created_at: string;
  }[];
}