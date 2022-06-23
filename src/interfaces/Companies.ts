export interface CustomFields {}

export interface Department {
	description: string;
	custom_fields: CustomFields;
	id: any;
	name: string;
	created_at: Date;
	updated_at: Date;
	prime_user_id?: number;
	head_user_id?: number;
	domains: any[];
}

export interface Companies {
	departments: Department[];
}

export interface CompaniesResponse {
	ok: boolean;
	companies: Companies;
}
