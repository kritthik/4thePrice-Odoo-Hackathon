import { BaseModel, Metadata } from './base';
import { WALLET_AUTO_TOPUP_TRIGGER, WALLET_STATUS, WALLET_TYPE } from './Wallet';

export interface WalletBalance extends BaseModel {
	readonly balance: number;
	readonly currency: string;
	readonly customer_id: string;
	readonly description: string;
	readonly metadata: Metadata;
	readonly real_time_balance: number;
	readonly wallet_status: WALLET_STATUS;
}

export interface RealtimeWalletBalance extends BaseModel {
	readonly customer_id: string;
	readonly currency: string;
	readonly balance: string;
	readonly credit_balance: string;
	readonly wallet_status: WALLET_STATUS;
	readonly name: string;
	readonly description: string;
	readonly metadata: Metadata;
	readonly auto_topup_trigger: WALLET_AUTO_TOPUP_TRIGGER;
	readonly auto_topup_min_balance: string;
	readonly auto_topup_amount: string;
	readonly wallet_type: WALLET_TYPE;
	readonly config: {
		readonly allowed_price_types: readonly string[];
	};
	readonly conversion_rate: string;
	readonly environment_id: string;
	readonly real_time_balance: string;
	readonly real_time_credit_balance: string;
	readonly unpaid_invoice_amount: string;
	readonly current_period_usage: string;
}
