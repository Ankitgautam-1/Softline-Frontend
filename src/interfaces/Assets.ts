export interface Asset {
  id: any;
  display_id: number;
  name: string;
  description: string;
  asset_type_id: any;
  impact: string;
  author_type: string;
  usage_type: string;
  asset_tag: string;
  user_id: any;
  department_id?: number;
  location_id: any;
  agent_id?: any;
  group_id?: any;
  assigned_on?: Date;
  created_at: Date;
  updated_at: Date;
}
