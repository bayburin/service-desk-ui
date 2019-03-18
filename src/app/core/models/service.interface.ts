export interface ServiceI {
  id: number;
  category_id: number;
  name: string;
  short_description: string;
  install: string;
  is_sla: boolean;
  sla: string;
  popularity: number;
}
