export interface Environment {
	id: string;
	name: string;
	type: ENVIRONMENT_TYPE;
	created_at: string;
	updated_at: string;
}

export enum ENVIRONMENT_TYPE {
	DEVELOPMENT = 'development',
	PRODUCTION = 'production',
}

export default Environment;
