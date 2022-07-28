export interface Monday {
  beginning_of_workday: string;
  end_of_workday: string;
}

export interface Tuesday {
  beginning_of_workday: string;
  end_of_workday: string;
}

export interface Wednesday {
  beginning_of_workday: string;
  end_of_workday: string;
}

export interface Thursday {
  beginning_of_workday: string;
  end_of_workday: string;
}

export interface Friday {
  beginning_of_workday: string;
  end_of_workday: string;
}

export interface Sunday {
  beginning_of_workday: string;
  end_of_workday: string;
}

export interface Saturday {
  beginning_of_workday: string;
  end_of_workday: string;
}

export interface ServiceDeskHours {
  monday: Monday;
  tuesday: Tuesday;
  wednesday: Wednesday;
  thursday: Thursday;
  friday: Friday;
  sunday: Sunday;
  saturday: Saturday;
}

export interface ListOfHoliday {
  holiday_date: string;
  holiday_name: string;
}

export interface SupportTime {
  id: any;
  created_at: Date;
  updated_at: Date;
  name: string;
  description: string;
  is_default: boolean;
  time_zone: string;
  service_desk_hours: ServiceDeskHours;
  list_of_holidays: ListOfHoliday[];
}
