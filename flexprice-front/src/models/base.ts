export interface BaseModel {
	id: string;
	created_at: string;
	updated_at: string;
	created_by: string;
	updated_by: string;
	tenant_id: string;
	status: ENTITY_STATUS;
	environment_id: string;
}

export enum ENTITY_STATUS {
	PUBLISHED = 'published',
	DELETED = 'deleted',
	ARCHIVED = 'archived',
}

export interface Metadata {
	[key: string]: string;
}
