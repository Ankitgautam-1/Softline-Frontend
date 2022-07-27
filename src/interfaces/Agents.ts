export interface Root {
  ok: boolean;
  servicePackage: ServicePackage;
}

export interface ServicePackage {
  agents: ProjectManager[];
}

export interface ProjectManager {
  active: boolean;
  address: any;
  auto_assign_status_changed_at?: string;
  auto_assign_tickets: boolean;
  background_information: any;
  can_see_all_tickets_from_associated_departments: boolean;
  created_at: string;
  custom_fields: CustomFields;
  department_ids: number[];
  email: string;
  external_id: any;
  first_name: string;
  has_logged_in: boolean;
  id: number;
  job_title?: string;
  language: string;
  last_active_at?: string;
  last_login_at?: string;
  last_name: string;
  location_id?: number;
  mobile_phone_number?: string;
  occasional: boolean;
  reporting_manager_id?: number;
  role_ids: number[];
  roles: Role[];
  scopes: Scopes;
  scoreboard_level_id?: number;
  scoreboard_points?: number;
  signature: string;
  time_format: string;
  time_zone: string;
  updated_at: string;
  vip_user: boolean;
  work_phone_number?: string;
  group_ids: number[];
  member_of: number[];
  observer_of: any[];
  member_of_pending_approval: any[];
  observer_of_pending_approval: any[];
}

export interface CustomFields {
  alert_builder: any;
  idm_id?: string;
  idm_user_id?: string;
  test_for_lang: any;
  userid: any;
  tenantid: any;
  idm_id_num: any;
  contact_person?: boolean;
}

export interface Role {
  role_id: number;
  assignment_scope: string;
  groups: any[];
}

export interface Scopes {
  ticket: any;
  problem: any;
  change: any;
  release: any;
  asset: any;
  solution: any;
  contract: any;
}
