export interface CustomFields {
  contact_type?: any;
}

export interface Role {
  role_id: any;
  assignment_scope: string;
  groups: any[];
}

export interface Scopes {
  ticket?: any;
  problem?: any;
  change?: any;
  release?: any;
  asset?: any;
  solution?: any;
  contract?: any;
}

export interface FirstAssigmentAgent {
  active: boolean;
  address?: any;
  auto_assign_status_changed_at: Date;
  auto_assign_tickets: boolean;
  background_information?: any;
  can_see_all_tickets_from_associated_departments: boolean;
  created_at: Date;
  custom_fields: CustomFields;
  department_ids: any[];
  email: string;
  external_id?: any;
  first_name: string;
  has_logged_in: boolean;
  id: any;
  job_title?: any;
  language: string;
  last_active_at: Date;
  last_login_at: Date;
  last_name: string;
  location_id?: number;
  mobile_phone_number: string;
  occasional: boolean;
  reporting_manager_id?: any;
  role_ids: any[];
  roles: Role[];
  scopes: Scopes;
  scoreboard_level_id: number;
  scoreboard_points: number;
  signature: string;
  time_format: string;
  time_zone: string;
  updated_at: Date;
  vip_user: boolean;
  work_phone_number: string;
  group_ids: any[];
  member_of: any[];
  observer_of: any[];
  member_of_pending_approval: any[];
  observer_of_pending_approval: any[];
}
