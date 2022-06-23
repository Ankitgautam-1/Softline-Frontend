export interface Root {
	ok: boolean;
	servicePackage: ServicePackage;
}

export interface ServicePackage {
	service_item: ServiceItem;
}

export interface ServiceItem {
	id: number;
	created_at: string;
	updated_at: string;
	name: string;
	delivery_time: any;
	display_id: number;
	category_id: number;
	product_id: any;
	quantity: any;
	deleted: boolean;
	icon_name: string;
	group_visibility: number;
	agent_group_visibility: number;
	item_type: number;
	ci_type_id: any;
	visibility: number;
	cost_visibility: boolean;
	delivery_time_visibility: boolean;
	botified: boolean;
	allow_attachments: boolean;
	allow_quantity: boolean;
	is_bundle: boolean;
	create_child: boolean;
	configs: Configs;
	description: string;
	short_description: string;
	cost: any;
	custom_fields: CustomField[];
	child_items: any[];
	icon_url: string;
}

export interface Configs {
	attachment_mandatory: boolean;
	subject: string;
}

export interface CustomField {
	created_at: string;
	deleted: boolean;
	description: any;
	id: string;
	label: string;
	name: string;
	updated_at: string;
	field_options: FieldOptions;
	visible_in_portal: boolean;
	field_type: string;
	item_id: number;
	position: number;
	required: boolean;
	choices: string[][];
	nested_fields: any[];
}

export interface FieldOptions {
	visible_in_agent_portal: string;
	pdf: string;
	required_for_create: string;
	visible_in_public: string;
	required_for_closure: string;
	placeholder: string;
}
