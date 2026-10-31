import { BaseModel } from './base';

export interface Integration extends BaseModel {
	readonly display_id: string;
	readonly expires_at: string;
	readonly last_used_at: string;
	readonly name: string;
	readonly permissions: string[];
	readonly provider: string;
	readonly type: string;
}
