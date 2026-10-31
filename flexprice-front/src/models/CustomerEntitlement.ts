import Feature from './Feature';

export interface CustomerEntitlement {
	entitlement: {
		is_enabled: boolean;
		is_soft_limit: boolean;
		static_values: string[];
		usage_limit: number;
		usage_reset_period: string;
	};
	feature: Feature;
	sources: {
		entitlement_id: string;
		is_enabled: boolean;
		plan_id: string;
		plan_name: string;
		subscription_id: string;
		quantity: number;
		static_value: string;
		usage_limit: number;
	}[];
}
