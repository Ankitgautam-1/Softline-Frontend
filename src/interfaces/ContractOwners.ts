export interface CustomFields {
  contact_type: string;
}

export interface ContractOwner {
  active: boolean;
  address?: any;
  background_information?: any;
  can_see_all_tickets_from_associated_departments: boolean;
  created_at: Date;
  custom_fields: CustomFields;
  department_ids: any[];
  external_id?: any;
  first_name: string;
  has_logged_in: boolean;
  id: number;
  is_agent: boolean;
  job_title?: any;
  language: string;
  last_name: string;
  location_id: number;
  mobile_phone_number?: any;
  primary_email: string;
  reporting_manager_id?: any;
  secondary_emails: any[];
  time_format: string;
  time_zone: string;
  updated_at: Date;
  vip_user: boolean;
  work_phone_number?: any;
}
