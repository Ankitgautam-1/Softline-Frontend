export interface SlaTarget {
  priority: number;
  escalation_enabled: boolean;
  respond_within: number;
  resolve_within: number;
  business_hours: boolean;
}

export interface All {
  name: string;
  operator: string;
  value: any;
  evaluate_on: string;
  field_type: string;
}

export interface ApplicableTo {
  all: All[];
}

export interface Response {
  level: string;
  escalation_when: string;
  escalation_time: number;
  agent_ids: any[];
  group_ids: any[];
}

export interface Resolution {
  level: string;
  escalation_when: string;
  escalation_time: number;
  agent_ids: any[];
  group_ids: any[];
}

export interface Escalation {
  response: Response;
  resolution: Resolution[];
}

export interface SLA {
  id: any;
  name: string;
  position: number;
  is_default: boolean;
  active: boolean;
  deleted: boolean;
  description: string;
  sla_targets: SlaTarget[];
  applicable_to: ApplicableTo;
  escalation: Escalation;
  created_at: Date;
  updated_at: Date;
}
