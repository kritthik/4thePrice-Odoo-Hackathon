import Customer from './Customer';
import { Invoice } from './Invoice';
import { Subscription } from './Subscription';
import { Metadata } from './base';

// Enums
export enum CREDIT_NOTE_STATUS {
	DRAFT = 'DRAFT',
	FINALIZED = 'FINALIZED',
	VOIDED = 'VOIDED',
}

export enum CREDIT_NOTE_REASON {
	DUPLICATE = 'DUPLICATE',
	FRAUDULENT = 'FRAUDULENT',
	ORDER_CHANGE = 'ORDER_CHANGE',
	UNSATISFACTORY = 'UNSATISFACTORY',
	SERVICE_ISSUE = 'SERVICE_ISSUE',
	BILLING_ERROR = 'BILLING_ERROR',
	SUBSCRIPTION_CANCELLATION = 'SUBSCRIPTION_CANCELLATION',
}

export enum CREDIT_NOTE_TYPE {
	ADJUSTMENT = 'ADJUSTMENT',
	REFUND = 'REFUND',
}

// Interfaces
export interface CreditNoteLineItem {
	id: string;
	invoice_line_item_id: string;
	display_name: string;
	amount: number;
	metadata?: Metadata;
	credit_note_id: string;
	currency: string;
	environment_id: string;
	created_at: string;
	updated_at: string;
	created_by: string;
	updated_by: string;
}

export interface CreditNote {
	id: string;
	environment_id: string;
	invoice_id: string;
	memo?: string;
	credit_note_number?: string;
	credit_note_status: CREDIT_NOTE_STATUS;
	credit_note_type: CREDIT_NOTE_TYPE;
	reason: CREDIT_NOTE_REASON;
	currency: string;
	total_amount: number;
	metadata?: Metadata;
	line_items: CreditNoteLineItem[];
	idempotency_key?: string;
	created_at: string;
	updated_at: string;
	created_by: string;
	updated_by: string;
	invoice?: Invoice;
	customer?: Customer;
	subscription?: Subscription;
	customer_id?: string;
	subscription_id?: string;
}
