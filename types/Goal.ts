export interface Goal {
  id: number;
  title: string;
  description: string;
  tags: string[];
  achieveBy: Date;
  status: "running" | "completed";
  imageUrl: string | null;
}
