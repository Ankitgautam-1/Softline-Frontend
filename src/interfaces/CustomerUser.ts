export interface CustomFields {
  contact_type: string;
}

export interface CustomerUser {
  active: boolean;
  address: string;
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
  job_title: string;
  language: string;
  last_name: string;
  location_id: number;
  mobile_phone_number: string;
  primary_email: string;
  reporting_manager_id: number;
  secondary_emails: any[];
  time_format: string;
  time_zone: string;
  updated_at: Date;
  vip_user: boolean;
  work_phone_number: string;
}
