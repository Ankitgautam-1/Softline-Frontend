export interface ServiceCategory {
	description: string;
	id: any;
	created_at: Date;
	updated_at: Date;
	name: string;
	position: number;
}

export interface ServicePackage {
	service_categories: ServiceCategory[];
}

export interface ServicePackagesResponse {
	ok: boolean;
	servicePackage: ServicePackage;
}
