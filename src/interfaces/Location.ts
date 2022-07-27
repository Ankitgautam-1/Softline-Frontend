export interface Address {
  line1: string;
  line2: string;
  city: string;
  state: string;
  country: string;
  zipcode: string;
}

export interface Location {
  address: Address;
  contact_name?: any;
  created_at: Date;
  email?: any;
  id: number;
  name: string;
  parent_location_id: number;
  phone?: any;
  primary_contact_id?: any;
  updated_at: Date;
}
