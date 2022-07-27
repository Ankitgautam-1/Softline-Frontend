export interface AgentGroups {
  id: any;
  name: string;
  description: string;
  escalate_to?: number;
  unassigned_for: string;
  business_hours_id: any;
  created_at: Date;
  updated_at: Date;
  auto_ticket_assign: boolean;
  restricted: boolean;
  approval_required: boolean;
  ocs_schedule_id?: any;
  agent_ids: any[];
  members: any[];
  observers: any[];
  leaders: number[];
  members_pending_approval: any[];
  leaders_pending_approval: any[];
  observers_pending_approval: any[];
}
