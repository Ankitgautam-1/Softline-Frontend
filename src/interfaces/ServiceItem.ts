export interface Configs {
	attachment_mandatory: boolean;
	subject: string;
}

export interface ServiceItem {
	id: any;
	created_at: Date;
	updated_at: Date;
	name: string;
	delivery_time?: any;
	display_id: number;
	category_id: any;
	product_id?: number;
	quantity?: any;
	deleted: boolean;
	icon_name: string;
	group_visibility: number;
	agent_group_visibility: number;
	item_type: number;
	ci_type_id?: number;
	visibility: number;
	cost_visibility: boolean;
	delivery_time_visibility: boolean;
	botified: boolean;
	allow_attachments: boolean;
	allow_quantity: boolean;
	is_bundle: boolean;
	create_child: boolean;
	configs: Configs;
}

export interface RootObject {
	service_items: ServiceItem[];
}
