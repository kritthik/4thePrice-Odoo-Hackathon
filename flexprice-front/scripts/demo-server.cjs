process.on('uncaughtException', (err) => {
	console.error('[CRITICAL] Uncaught exception in demo server:', err);
});
process.on('unhandledRejection', (reason) => {
	console.error('[CRITICAL] Unhandled promise rejection:', reason);
});
// 4ThePrice - Standalone Demo API Server
// Emulates the Flexprice v1 REST API for "Subscriptions for Daily Life" demo.
// Zero npm dependencies - uses native Node.js http and url modules.

const http = require('http');
const url = require('url');

const PORT = 8080;

// In-Memory Seed Data for "Subscriptions for Daily Life"
const DB = {
	user: {
		id: 'usr_4theprice_admin',
		email: 'demo@4theprice.com',
		name: '4ThePrice Demo Admin',
		type: 'user',
		roles: ['super_admin', 'admin'],
		tenant: {
			id: 'tenant_4theprice_daily',
			name: '4ThePrice Daily',
			status: 'published',
			billing_details: {
				address: {
					address_line1: '100 Market Street',
					address_line2: 'Suite 400',
					address_city: 'San Francisco',
					address_state: 'CA',
					address_postal_code: '94105',
					address_country: 'US',
				},
				email: 'billing@4theprice.com',
				phone: '+1 (555) 438-7742',
			},
			metadata: {
				onboarding_completed: 'true',
			},
			created_at: '2026-01-01T00:00:00Z',
			updated_at: '2026-10-31T00:00:00Z',
		},
	},

	environments: [
		{
			id: '00000000-0000-0000-0000-000000000000',
			name: 'Daily Life Sandbox',
			type: 'development',
			created_at: '2026-01-01T00:00:00Z',
			updated_at: '2026-10-31T00:00:00Z',
		},
		{
			id: '00000000-0000-0000-0000-000000000001',
			name: 'Production',
			type: 'production',
			created_at: '2026-01-01T00:00:00Z',
			updated_at: '2026-10-31T00:00:00Z',
		},
	],

	features: [
		{
			id: 'feat_coffee_bar',
			name: 'Artisan Coffee Bar Access',
			lookup_key: 'feat_coffee_bar',
			type: 'boolean',
			status: 'published',
			description: 'Unlimited barista-crafted coffee and espresso at partner cafes',
			created_at: '2026-01-10T08:00:00Z',
		},
		{
			id: 'feat_gym_247',
			name: '24/7 Gym & Studio Access',
			lookup_key: 'feat_gym_247',
			type: 'boolean',
			status: 'published',
			description: 'Full anytime access to cardio, weights, and studio training sessions',
			created_at: '2026-01-10T08:00:00Z',
		},
		{
			id: 'feat_transit_trips',
			name: 'City Metro & Transit Trips',
			lookup_key: 'feat_transit_trips',
			type: 'metered',
			status: 'published',
			description: 'Subway, bus, and light rail commuter trips across the city network',
			created_at: '2026-01-10T08:00:00Z',
		},
		{
			id: 'feat_grocery_priority',
			name: 'Priority Grocery Delivery',
			lookup_key: 'feat_grocery_priority',
			type: 'boolean',
			status: 'published',
			description: '1-hour rush delivery slots on daily fresh pantry items',
			created_at: '2026-01-10T08:00:00Z',
		},
	],

	meters: [
		{
			id: 'meter_coffee_cups',
			name: 'Coffee Cups Redeemed',
			event_name: 'coffee_cup_redeemed',
			aggregation: { type: 'count' },
			status: 'published',
			created_at: '2026-01-01T00:00:00Z',
			updated_at: '2026-10-31T00:00:00Z',
		},
		{
			id: 'meter_transit_rides',
			name: 'Transit Rides Taken',
			event_name: 'metro_ride_taken',
			aggregation: { type: 'count' },
			status: 'published',
			created_at: '2026-01-01T00:00:00Z',
			updated_at: '2026-10-31T00:00:00Z',
		},
		{
			id: 'meter_grocery_orders',
			name: 'Daily Grocery Orders',
			event_name: 'daily_order_placed',
			aggregation: { type: 'count' },
			status: 'published',
			created_at: '2026-01-01T00:00:00Z',
			updated_at: '2026-10-31T00:00:00Z',
		},
	],

	priceUnits: [
		{ id: 'unit_usd', name: 'US Dollar', symbol: '$', code: 'USD', status: 'published' },
		{ id: 'unit_credits', name: 'Daily Life Credits', symbol: 'CR', code: 'CREDITS', status: 'published' },
		{ id: 'unit_cups', name: 'Coffee Cups', symbol: '☕', code: 'CUPS', status: 'published' },
		{ id: 'unit_rides', name: 'Transit Rides', symbol: '🚇', code: 'RIDES', status: 'published' },
	],

	prices: [
		{
			id: 'pr_coffee_base',
			amount: '30.00',
			currency: 'USD',
			type: 'recurring',
			billing_period: 'monthly',
			billing_period_count: 1,
			billing_model: 'flat_fee',
			display_name: 'Coffee Club Monthly Fee',
			display_amount: '$30.00',
			status: 'published',
			created_at: '2026-01-15T00:00:00Z',
		},
		{
			id: 'pr_coffee_usage',
			amount: '1.50',
			currency: 'USD',
			type: 'usage',
			billing_period: 'monthly',
			billing_period_count: 1,
			billing_model: 'package',
			display_name: 'Extra Cup Overage',
			display_amount: '$1.50 / cup',
			status: 'published',
			created_at: '2026-01-15T00:00:00Z',
		},
		{
			id: 'pr_gym_base',
			amount: '45.00',
			currency: 'USD',
			type: 'recurring',
			billing_period: 'monthly',
			billing_period_count: 1,
			billing_model: 'flat_fee',
			display_name: 'Anytime Gym Membership',
			display_amount: '$45.00',
			status: 'published',
			created_at: '2026-01-15T00:00:00Z',
		},
		{
			id: 'pr_transit_base',
			amount: '50.00',
			currency: 'USD',
			type: 'recurring',
			billing_period: 'monthly',
			billing_period_count: 1,
			billing_model: 'flat_fee',
			display_name: 'Daily Commuter Pass',
			display_amount: '$50.00',
			status: 'published',
			created_at: '2026-01-15T00:00:00Z',
		},
		{
			id: 'pr_bundle_base',
			amount: '110.00',
			currency: 'USD',
			type: 'recurring',
			billing_period: 'monthly',
			billing_period_count: 1,
			billing_model: 'flat_fee',
			display_name: 'All-in-One Bundle',
			display_amount: '$110.00',
			status: 'published',
			created_at: '2026-01-15T00:00:00Z',
		},
	],

	coupons: [
		{
			id: 'coup_welcome20',
			name: 'Welcome Daily 20%',
			code: 'WELCOME20',
			type: 'percentage',
			amount: '20',
			currency: 'USD',
			max_redemptions: 500,
			duration: 'repeating',
			duration_in_months: 3,
			status: 'published',
			created_at: '2026-01-01T00:00:00Z',
		},
		{
			id: 'coup_daily5off',
			name: 'New Subscriber $5 Off',
			code: 'DAILY5OFF',
			type: 'fixed',
			amount: '5.00',
			currency: 'USD',
			max_redemptions: 1000,
			duration: 'once',
			status: 'published',
			created_at: '2026-01-01T00:00:00Z',
		},
	],

	addons: [
		{
			id: 'addon_locker_sauna',
			name: 'Locker & Sauna Pass',
			lookup_key: 'addon_locker_sauna',
			description: 'Dedicated locker and recovery sauna access',
			status: 'published',
			prices: [{ id: 'pr_addon_1', amount: '10.00', currency: 'USD', type: 'recurring', billing_period: 'monthly' }],
		},
		{
			id: 'addon_extra_family',
			name: 'Family Member Add-on',
			lookup_key: 'addon_extra_family',
			description: 'Add a secondary family member to your daily plan',
			status: 'published',
			prices: [{ id: 'pr_addon_2', amount: '15.00', currency: 'USD', type: 'recurring', billing_period: 'monthly' }],
		},
	],

	plans: [
		{
			id: 'plan_coffee_daily',
			name: 'Coffee Club Daily',
			lookup_key: 'plan_coffee_daily',
			description: 'Your morning routine perfected. 30 craft coffee cups per month with discounted overage.',
			status: 'published',
			invoice_cadence: 'in_advance',
			created_at: '2026-01-15T00:00:00Z',
			prices: [
				{
					id: 'pr_coffee_base',
					amount: '30.00',
					currency: 'USD',
					type: 'recurring',
					billing_period: 'monthly',
					billing_period_count: 1,
					billing_model: 'flat_fee',
					display_name: 'Coffee Club Monthly Fee',
					display_amount: '$30.00',
				},
				{
					id: 'pr_coffee_usage',
					amount: '1.50',
					currency: 'USD',
					type: 'usage',
					billing_period: 'monthly',
					billing_period_count: 1,
					billing_model: 'package',
					display_name: 'Extra Cup Overage',
					display_amount: '$1.50 / cup',
				},
			],
			entitlements: [
				{
					id: 'ent_coffee_30',
					feature_id: 'feat_coffee_bar',
					feature: { name: 'Artisan Coffee Bar Access', lookup_key: 'feat_coffee_bar' },
					is_enabled: true,
					usage_limit: 30,
					usage_reset_period: 'monthly',
				},
			],
		},
		{
			id: 'plan_gym_anytime',
			name: 'Anytime Fitness 24/7',
			lookup_key: 'plan_gym_anytime',
			description: 'Unlimited anytime gym access with sauna, locker access, and guest privileges.',
			status: 'published',
			invoice_cadence: 'in_advance',
			created_at: '2026-01-15T00:00:00Z',
			prices: [
				{
					id: 'pr_gym_base',
					amount: '45.00',
					currency: 'USD',
					type: 'recurring',
					billing_period: 'monthly',
					billing_period_count: 1,
					billing_model: 'flat_fee',
					display_name: 'Anytime Gym Membership',
					display_amount: '$45.00',
				},
			],
			entitlements: [
				{
					id: 'ent_gym_unlimited',
					feature_id: 'feat_gym_247',
					feature: { name: '24/7 Gym & Studio Access', lookup_key: 'feat_gym_247' },
					is_enabled: true,
					usage_limit: null,
					usage_reset_period: 'monthly',
				},
			],
		},
		{
			id: 'plan_transit_commuter',
			name: 'Daily Commuter Pass',
			lookup_key: 'plan_transit_commuter',
			description: '60 monthly transit trips across subway, bus, and light rail network.',
			status: 'published',
			invoice_cadence: 'in_advance',
			created_at: '2026-01-15T00:00:00Z',
			prices: [
				{
					id: 'pr_transit_base',
					amount: '50.00',
					currency: 'USD',
					type: 'recurring',
					billing_period: 'monthly',
					billing_period_count: 1,
					billing_model: 'flat_fee',
					display_name: 'Daily Commuter Pass',
					display_amount: '$50.00',
				},
			],
			entitlements: [
				{
					id: 'ent_transit_60',
					feature_id: 'feat_transit_trips',
					feature: { name: 'City Metro & Transit Trips', lookup_key: 'feat_transit_trips' },
					is_enabled: true,
					usage_limit: 60,
					usage_reset_period: 'monthly',
				},
			],
		},
		{
			id: 'plan_daily_life_bundle',
			name: 'Daily Life All-in-One',
			lookup_key: 'plan_daily_life_bundle',
			description: 'Ultimate daily bundle: Coffee Club Daily + Anytime Gym Membership + Priority Delivery.',
			status: 'published',
			invoice_cadence: 'in_advance',
			created_at: '2026-01-15T00:00:00Z',
			prices: [
				{
					id: 'pr_bundle_base',
					amount: '110.00',
					currency: 'USD',
					type: 'recurring',
					billing_period: 'monthly',
					billing_period_count: 1,
					billing_model: 'flat_fee',
					display_name: 'All-in-One Bundle',
					display_amount: '$110.00',
				},
			],
			entitlements: [
				{
					id: 'ent_bundle_coffee',
					feature_id: 'feat_coffee_bar',
					feature: { name: 'Artisan Coffee Bar Access', lookup_key: 'feat_coffee_bar' },
					is_enabled: true,
					usage_limit: 45,
					usage_reset_period: 'monthly',
				},
				{
					id: 'ent_bundle_gym',
					feature_id: 'feat_gym_247',
					feature: { name: '24/7 Gym & Studio Access', lookup_key: 'feat_gym_247' },
					is_enabled: true,
					usage_limit: null,
					usage_reset_period: 'monthly',
				},
				{
					id: 'ent_bundle_grocery',
					feature_id: 'feat_grocery_priority',
					feature: { name: 'Priority Grocery Delivery', lookup_key: 'feat_grocery_priority' },
					is_enabled: true,
					usage_limit: null,
					usage_reset_period: 'monthly',
				},
			],
		},
	],

	customers: [
		{
			id: 'cust_sarah_jenkins',
			external_id: 'cust_daily_01',
			name: 'Sarah Jenkins',
			email: 'sarah.jenkins@example.com',
			status: 'published',
			currency: 'USD',
			address_city: 'San Francisco',
			address_state: 'CA',
			address_country: 'US',
			created_at: '2026-02-01T10:00:00Z',
			updated_at: '2026-10-31T00:00:00Z',
		},
		{
			id: 'cust_david_chen',
			external_id: 'cust_daily_02',
			name: 'David Chen',
			email: 'david.chen@example.com',
			status: 'published',
			currency: 'USD',
			address_city: 'Oakland',
			address_state: 'CA',
			address_country: 'US',
			created_at: '2026-02-05T11:00:00Z',
			updated_at: '2026-10-31T00:00:00Z',
		},
		{
			id: 'cust_elena_rostova',
			external_id: 'cust_daily_03',
			name: 'Elena Rostova',
			email: 'elena.rostova@example.com',
			status: 'published',
			currency: 'USD',
			address_city: 'Seattle',
			address_state: 'WA',
			address_country: 'US',
			created_at: '2026-02-10T14:30:00Z',
			updated_at: '2026-10-31T00:00:00Z',
		},
		{
			id: 'cust_marcus_brody',
			external_id: 'cust_daily_04',
			name: 'Marcus Brody',
			email: 'marcus.brody@example.com',
			status: 'published',
			currency: 'USD',
			address_city: 'Austin',
			address_state: 'TX',
			address_country: 'US',
			created_at: '2026-02-15T16:00:00Z',
			updated_at: '2026-10-31T00:00:00Z',
		},
	],

	wallets: [
		{
			id: 'wal_sarah_coffee',
			customer_id: 'cust_sarah_jenkins',
			currency: 'USD',
			name: "Sarah's Coffee & Snack Balance",
			wallet_type: 'prepaid',
			wallet_status: 'active',
			balance: 50.0,
			credit_balance: 50.0,
			created_at: '2026-02-01T10:05:00Z',
			updated_at: '2026-10-31T00:00:00Z',
		},
		{
			id: 'wal_david_transit',
			customer_id: 'cust_david_chen',
			currency: 'USD',
			name: "David's Commuter Pass Credits",
			wallet_type: 'prepaid',
			wallet_status: 'active',
			balance: 35.0,
			credit_balance: 35.0,
			created_at: '2026-02-05T11:05:00Z',
			updated_at: '2026-10-31T00:00:00Z',
		},
		{
			id: 'wal_elena_bundle',
			customer_id: 'cust_elena_rostova',
			currency: 'USD',
			name: "Elena's Daily Life Wallet",
			wallet_type: 'prepaid',
			wallet_status: 'active',
			balance: 100.0,
			credit_balance: 100.0,
			created_at: '2026-02-10T14:35:00Z',
			updated_at: '2026-10-31T00:00:00Z',
		},
	],

	walletTransactions: [
		{
			id: 'tx_sarah_init',
			wallet_id: 'wal_sarah_coffee',
			type: 'credit',
			amount: 50.0,
			currency: 'USD',
			transaction_reason: 'subscription_credit_grant',
			description: 'Monthly coffee club credit allowance',
			created_at: '2026-10-01T10:00:00Z',
		},
		{
			id: 'tx_david_init',
			wallet_id: 'wal_david_transit',
			type: 'credit',
			amount: 35.0,
			currency: 'USD',
			transaction_reason: 'free_credit_grant',
			description: 'Commuter pass top-up bundle',
			created_at: '2026-10-05T11:00:00Z',
		},
		{
			id: 'tx_elena_init',
			wallet_id: 'wal_elena_bundle',
			type: 'credit',
			amount: 100.0,
			currency: 'USD',
			transaction_reason: 'purchased_credit_direct',
			description: 'Prepaid grocery and ride credits',
			created_at: '2026-10-10T14:30:00Z',
		},
	],

	subscriptions: [
		{
			id: 'sub_sarah_coffee',
			customer_id: 'cust_sarah_jenkins',
			plan_id: 'plan_coffee_daily',
			subscription_status: 'active',
			status: 'published',
			billing_cadence: 'recurring',
			currency: 'USD',
			start_date: '2026-10-01T00:00:00Z',
			current_period_start: '2026-10-01T00:00:00Z',
			current_period_end: '2026-11-01T00:00:00Z',
			billing_period: 'monthly',
			plan: { id: 'plan_coffee_daily', name: 'Coffee Club Daily' },
			customer: { id: 'cust_sarah_jenkins', name: 'Sarah Jenkins', email: 'sarah.jenkins@example.com' },
			line_items: [
				{
					id: 'li_sub_sarah_base',
					price_id: 'pr_coffee_base',
					display_name: 'Coffee Club Monthly Fee',
					amount: '30.00',
					currency: 'USD',
				},
			],
			created_at: '2026-10-01T00:00:00Z',
			updated_at: '2026-10-31T00:00:00Z',
		},
		{
			id: 'sub_david_transit',
			customer_id: 'cust_david_chen',
			plan_id: 'plan_transit_commuter',
			subscription_status: 'active',
			status: 'published',
			billing_cadence: 'recurring',
			currency: 'USD',
			start_date: '2026-10-05T00:00:00Z',
			current_period_start: '2026-10-05T00:00:00Z',
			current_period_end: '2026-11-05T00:00:00Z',
			billing_period: 'monthly',
			plan: { id: 'plan_transit_commuter', name: 'Daily Commuter Pass' },
			customer: { id: 'cust_david_chen', name: 'David Chen', email: 'david.chen@example.com' },
			line_items: [
				{
					id: 'li_sub_david_base',
					price_id: 'pr_transit_base',
					display_name: 'Daily Commuter Pass',
					amount: '50.00',
					currency: 'USD',
				},
			],
			created_at: '2026-10-05T00:00:00Z',
			updated_at: '2026-10-31T00:00:00Z',
		},
		{
			id: 'sub_elena_bundle',
			customer_id: 'cust_elena_rostova',
			plan_id: 'plan_daily_life_bundle',
			subscription_status: 'active',
			status: 'published',
			billing_cadence: 'recurring',
			currency: 'USD',
			start_date: '2026-10-10T00:00:00Z',
			current_period_start: '2026-10-10T00:00:00Z',
			current_period_end: '2026-11-10T00:00:00Z',
			billing_period: 'monthly',
			plan: { id: 'plan_daily_life_bundle', name: 'Daily Life All-in-One' },
			customer: { id: 'cust_elena_rostova', name: 'Elena Rostova', email: 'elena.rostova@example.com' },
			line_items: [
				{
					id: 'li_sub_elena_base',
					price_id: 'pr_bundle_base',
					display_name: 'All-in-One Bundle',
					amount: '110.00',
					currency: 'USD',
				},
			],
			created_at: '2026-10-10T00:00:00Z',
			updated_at: '2026-10-31T00:00:00Z',
		},
		{
			id: 'sub_marcus_gym',
			customer_id: 'cust_marcus_brody',
			plan_id: 'plan_gym_anytime',
			subscription_status: 'paused',
			status: 'published',
			billing_cadence: 'recurring',
			currency: 'USD',
			start_date: '2026-09-01T00:00:00Z',
			current_period_start: '2026-10-01T00:00:00Z',
			current_period_end: '2026-11-01T00:00:00Z',
			billing_period: 'monthly',
			plan: { id: 'plan_gym_anytime', name: 'Anytime Fitness 24/7' },
			customer: { id: 'cust_marcus_brody', name: 'Marcus Brody', email: 'marcus.brody@example.com' },
			line_items: [
				{
					id: 'li_sub_marcus_base',
					price_id: 'pr_gym_base',
					display_name: 'Anytime Gym Membership',
					amount: '45.00',
					currency: 'USD',
				},
			],
			created_at: '2026-09-01T00:00:00Z',
			updated_at: '2026-10-31T00:00:00Z',
		},
	],

	invoices: [
		{
			id: 'inv_001_sarah',
			invoice_number: 'INV-4TP-2026-001',
			customer_id: 'cust_sarah_jenkins',
			subscription_id: 'sub_sarah_coffee',
			invoice_status: 'FINALIZED',
			payment_status: 'SUCCEEDED',
			amount_due: '30.00',
			total_amount: '30.00',
			amount_paid: '30.00',
			currency: 'USD',
			period_start: '2026-10-01T00:00:00Z',
			period_end: '2026-11-01T00:00:00Z',
			customer: { id: 'cust_sarah_jenkins', name: 'Sarah Jenkins', email: 'sarah.jenkins@example.com' },
			line_items: [
				{
					id: 'li_001',
					display_name: 'Coffee Club Daily - Base Membership',
					amount: '30.00',
					quantity: '1',
					currency: 'USD',
				},
			],
			created_at: '2026-10-01T00:00:00Z',
			updated_at: '2026-10-31T00:00:00Z',
		},
		{
			id: 'inv_002_david',
			invoice_number: 'INV-4TP-2026-002',
			customer_id: 'cust_david_chen',
			subscription_id: 'sub_david_transit',
			invoice_status: 'FINALIZED',
			payment_status: 'SUCCEEDED',
			amount_due: '50.00',
			total_amount: '50.00',
			amount_paid: '50.00',
			currency: 'USD',
			period_start: '2026-10-05T00:00:00Z',
			period_end: '2026-11-05T00:00:00Z',
			customer: { id: 'cust_david_chen', name: 'David Chen', email: 'david.chen@example.com' },
			line_items: [
				{
					id: 'li_002',
					display_name: 'Daily Commuter Pass (Subway & Bus Network)',
					amount: '50.00',
					quantity: '1',
					currency: 'USD',
				},
			],
			created_at: '2026-10-05T00:00:00Z',
			updated_at: '2026-10-31T00:00:00Z',
		},
		{
			id: 'inv_003_elena',
			invoice_number: 'INV-4TP-2026-003',
			customer_id: 'cust_elena_rostova',
			subscription_id: 'sub_elena_bundle',
			invoice_status: 'FINALIZED',
			payment_status: 'SUCCEEDED',
			amount_due: '110.00',
			total_amount: '110.00',
			amount_paid: '110.00',
			currency: 'USD',
			period_start: '2026-10-10T00:00:00Z',
			period_end: '2026-11-10T00:00:00Z',
			customer: { id: 'cust_elena_rostova', name: 'Elena Rostova', email: 'elena.rostova@example.com' },
			line_items: [
				{
					id: 'li_003',
					display_name: 'Daily Life All-in-One Membership Bundle',
					amount: '110.00',
					quantity: '1',
					currency: 'USD',
				},
			],
			created_at: '2026-10-10T00:00:00Z',
			updated_at: '2026-10-31T00:00:00Z',
		},
		{
			id: 'inv_004_marcus',
			invoice_number: 'INV-4TP-2026-004',
			customer_id: 'cust_marcus_brody',
			subscription_id: 'sub_marcus_gym',
			invoice_status: 'DRAFT',
			payment_status: 'PENDING',
			amount_due: '45.00',
			total_amount: '45.00',
			amount_paid: '0.00',
			currency: 'USD',
			period_start: '2026-10-15T00:00:00Z',
			period_end: '2026-11-15T00:00:00Z',
			customer: { id: 'cust_marcus_brody', name: 'Marcus Brody', email: 'marcus.brody@example.com' },
			line_items: [
				{
					id: 'li_004',
					display_name: 'Anytime Fitness 24/7 (Cycle Review)',
					amount: '45.00',
					quantity: '1',
					currency: 'USD',
				},
			],
			created_at: '2026-10-15T00:00:00Z',
			updated_at: '2026-10-31T00:00:00Z',
		},
	],

	payments: [
		{
			id: 'pay_001_sarah',
			destination_type: 'invoice',
			destination_id: 'inv_001_sarah',
			amount: '30.00',
			currency: 'USD',
			payment_status: 'succeeded',
			payment_method: 'card',
			created_at: '2026-10-01T00:05:00Z',
		},
		{
			id: 'pay_002_david',
			destination_type: 'invoice',
			destination_id: 'inv_002_david',
			amount: '50.00',
			currency: 'USD',
			payment_status: 'succeeded',
			payment_method: 'apple_pay',
			created_at: '2026-10-05T00:05:00Z',
		},
		{
			id: 'pay_003_elena',
			destination_type: 'invoice',
			destination_id: 'inv_003_elena',
			amount: '110.00',
			currency: 'USD',
			payment_status: 'succeeded',
			payment_method: 'card',
			created_at: '2026-10-10T00:05:00Z',
		},
	],

	creditNotes: [
		{
			id: 'cn_001',
			credit_note_number: 'CN-4TP-001',
			customer_id: 'cust_sarah_jenkins',
			invoice_id: 'inv_001_sarah',
			amount: '5.00',
			total_amount: '5.00',
			currency: 'USD',
			reason: 'courtesy_credit',
			status: 'FINALIZED',
			credit_note_status: 'FINALIZED',
			credit_note_type: 'ADJUSTMENT',
			customer: { id: 'cust_sarah_jenkins', name: 'Sarah Jenkins', email: 'sarah.jenkins@example.com' },
			invoice: { id: 'inv_001_sarah', invoice_number: 'INV-4TP-2026-001' },
			created_at: '2026-10-03T10:00:00Z',
		},
		{
			id: 'cn_002',
			credit_note_number: 'CN-4TP-002',
			customer_id: 'cust_david_chen',
			invoice_id: 'inv_002_david',
			amount: '10.00',
			total_amount: '10.00',
			currency: 'USD',
			reason: 'transit_delay_rebate',
			status: 'FINALIZED',
			credit_note_status: 'FINALIZED',
			credit_note_type: 'REFUND',
			customer: { id: 'cust_david_chen', name: 'David Chen', email: 'david.chen@example.com' },
			invoice: { id: 'inv_002_david', invoice_number: 'INV-4TP-2026-002' },
			created_at: '2026-10-12T14:30:00Z',
		},
	],

	events: [
		{
			id: 'evt_001',
			event_name: 'coffee_cup_redeemed',
			external_customer_id: 'cust_daily_01',
			customer_id: 'cust_sarah_jenkins',
			timestamp: '2026-10-31T08:15:00Z',
			properties: { cafe: 'Blue Bottle Market St', beverage: 'Oat Flat White', size: 'large' },
		},
		{
			id: 'evt_002',
			event_name: 'metro_ride_taken',
			external_customer_id: 'cust_daily_02',
			customer_id: 'cust_david_chen',
			timestamp: '2026-10-31T08:45:00Z',
			properties: { station_entry: 'Montgomery St', station_exit: '19th St Oakland', line: 'Yellow Line' },
		},
		{
			id: 'evt_003',
			event_name: 'daily_order_placed',
			external_customer_id: 'cust_daily_03',
			customer_id: 'cust_elena_rostova',
			timestamp: '2026-10-31T09:30:00Z',
			properties: { items_count: 8, delivery_speed: '1-hour rush', category: 'fresh_produce' },
		},
	],
};

function sendJson(res, data, statusCode = 200) {
	res.writeHead(statusCode, {
		'Content-Type': 'application/json',
		'Access-Control-Allow-Origin': '*',
		'Access-Control-Allow-Methods': '*',
		'Access-Control-Allow-Headers': '*',
	});
	res.end(JSON.stringify(data));
}

function parseBody(req) {
	return new Promise((resolve) => {
		let body = '';
		req.on('data', (chunk) => {
			body += chunk.toString();
		});
		req.on('end', () => {
			try {
				resolve(JSON.parse(body || '{}'));
			} catch {
				resolve({});
			}
		});
	});
}

const server = http.createServer(async (req, res) => {
	let pathname = '/';
	const method = req.method;
	try {
		const parsedUrl = new URL(req.url, 'http://127.0.0.1:8080');
		pathname = parsedUrl.pathname.replace(/^\/v1/, '');
		console.log(`[API] ${method} ${pathname}`);
	} catch (e) {
		console.error('URL parse error:', e);
	}

	// Handle Preflight OPTIONS
	if (method === 'OPTIONS') {
		res.writeHead(204, {
			'Access-Control-Allow-Origin': '*',
			'Access-Control-Allow-Methods': '*',
			'Access-Control-Allow-Headers': '*',
		});
		return res.end();
	}

	// 1. Current Authenticated User & Tenant Profile
	if (method === 'GET' && (pathname === '/users/me' || pathname === '/users')) {
		return sendJson(res, DB.user);
	}

	// 2. Environments List (must return { environments: [...], total: ... })
	if (method === 'GET' && pathname === '/environments') {
		return sendJson(res, {
			environments: DB.environments,
			total: DB.environments.length,
			limit: 50,
			offset: 0,
		});
	}

	// 2b. RBAC Roles
	if (method === 'GET' && pathname.startsWith('/rbac')) {
		return sendJson(res, [
			{ id: 'super_admin', name: 'Super Admin', permissions: { '*': ['*'] } },
			{ id: 'admin', name: 'Admin', permissions: { '*': ['*'] } },
		]);
	}

	// 3. Plans
	if ((method === 'POST' && pathname === '/plans/search') || (method === 'GET' && pathname === '/plans')) {
		return sendJson(res, {
			items: DB.plans,
			pagination: { total: DB.plans.length, limit: 50, offset: 0 },
		});
	}

	if (method === 'GET' && pathname.startsWith('/plans/')) {
		const planId = pathname.replace('/plans/', '');
		const plan = DB.plans.find((p) => p.id === planId) || DB.plans[0];
		return sendJson(res, plan);
	}

	if (method === 'POST' && pathname === '/plans') {
		const body = await parseBody(req);
		const newPlan = {
			id: 'plan_' + Date.now(),
			name: body.name || 'New Daily Plan',
			lookup_key: body.lookup_key || 'plan_' + Date.now(),
			description: body.description || '',
			status: 'published',
			invoice_cadence: 'in_advance',
			created_at: new Date().toISOString(),
			prices: [],
			entitlements: [],
		};
		DB.plans.unshift(newPlan);
		return sendJson(res, newPlan, 201);
	}

	// 4. Features
	if ((method === 'POST' && pathname === '/features/search') || (method === 'GET' && pathname === '/features')) {
		return sendJson(res, {
			items: DB.features,
			pagination: { total: DB.features.length, limit: 50, offset: 0 },
		});
	}

	if (method === 'GET' && pathname.startsWith('/features/')) {
		const featId = pathname.replace('/features/', '');
		const feat = DB.features.find((f) => f.id === featId) || DB.features[0];
		return sendJson(res, feat);
	}

	// 5. Price Units
	if ((method === 'GET' && pathname === '/price-units') || (method === 'POST' && pathname === '/price-units/search')) {
		return sendJson(res, {
			items: DB.priceUnits,
			pagination: { total: DB.priceUnits.length, limit: 50, offset: 0 },
		});
	}

	// 6. Prices
	if ((method === 'GET' && pathname === '/prices') || (method === 'POST' && pathname === '/prices/search')) {
		return sendJson(res, {
			items: DB.prices,
			pagination: { total: DB.prices.length, limit: 50, offset: 0 },
		});
	}

	if (method === 'GET' && pathname.startsWith('/prices/')) {
		const prId = pathname.replace('/prices/', '');
		const pr = DB.prices.find((p) => p.id === prId) || DB.prices[0];
		return sendJson(res, pr);
	}

	// 7. Meters
	if ((method === 'GET' && pathname === '/meters') || (method === 'POST' && pathname === '/meters/search')) {
		return sendJson(res, {
			items: DB.meters,
			pagination: { total: DB.meters.length, limit: 50, offset: 0 },
		});
	}

	if (method === 'GET' && pathname.startsWith('/meters/')) {
		const meterId = pathname.replace('/meters/', '');
		const m = DB.meters.find((item) => item.id === meterId) || DB.meters[0];
		return sendJson(res, m);
	}

	// 8. Coupons
	if ((method === 'GET' && pathname === '/coupons') || (method === 'POST' && pathname === '/coupons/search')) {
		return sendJson(res, {
			items: DB.coupons,
			pagination: { total: DB.coupons.length, limit: 50, offset: 0 },
		});
	}

	// 9. Addons
	if ((method === 'GET' && pathname === '/addons') || (method === 'POST' && pathname === '/addons/search')) {
		return sendJson(res, {
			items: DB.addons,
			pagination: { total: DB.addons.length, limit: 50, offset: 0 },
		});
	}

	// 10. Customers
	if (method === 'GET' && pathname.includes('/customers/') && pathname.endsWith('/subscriptions')) {
		const parts = pathname.split('/');
		const custId = parts[2];
		const subs = DB.subscriptions.filter((s) => s.customer_id === custId);
		return sendJson(res, {
			items: subs,
			pagination: { total: subs.length, limit: 50, offset: 0 },
		});
	}

	if (method === 'GET' && pathname.includes('/customers/') && pathname.endsWith('/invoices')) {
		const parts = pathname.split('/');
		const custId = parts[2];
		const invs = DB.invoices.filter((i) => i.customer_id === custId);
		return sendJson(res, {
			items: invs,
			pagination: { total: invs.length, limit: 50, offset: 0 },
		});
	}

	if (method === 'GET' && pathname.includes('/customers/') && pathname.endsWith('/wallets')) {
		const parts = pathname.split('/');
		const custId = parts[2];
		const w = DB.wallets.filter((wal) => wal.customer_id === custId);
		return sendJson(res, w);
	}

	if ((method === 'POST' && pathname === '/customers/search') || (method === 'GET' && pathname === '/customers')) {
		return sendJson(res, {
			items: DB.customers,
			pagination: { total: DB.customers.length, limit: 50, offset: 0 },
		});
	}

	if (method === 'GET' && pathname.startsWith('/customers/')) {
		const custId = pathname.replace('/customers/', '').split('/')[0];
		const cust = DB.customers.find((c) => c.id === custId) || DB.customers[0];
		return sendJson(res, cust);
	}

	if (method === 'POST' && pathname === '/customers') {
		const body = await parseBody(req);
		const newCustomer = {
			id: 'cust_' + Date.now(),
			external_id: body.external_id || 'cust_' + Date.now(),
			name: body.name || 'New Subscriber',
			email: body.email || 'subscriber@example.com',
			status: 'published',
			currency: body.currency || 'USD',
			created_at: new Date().toISOString(),
			updated_at: new Date().toISOString(),
		};
		DB.customers.unshift(newCustomer);
		return sendJson(res, newCustomer, 201);
	}

	// 11. Subscription actions (Cancel, Pause, Resume)
	if (method === 'POST' && pathname.includes('/subscriptions/') && pathname.endsWith('/cancel')) {
		const parts = pathname.split('/');
		const subId = parts[2];
		const sub = DB.subscriptions.find((s) => s.id === subId);
		if (sub) {
			sub.subscription_status = 'cancelled';
			sub.updated_at = new Date().toISOString();
		}
		return sendJson(res, sub || { id: subId, subscription_status: 'cancelled' });
	}

	if (method === 'POST' && pathname.includes('/subscriptions/') && pathname.endsWith('/pause')) {
		const parts = pathname.split('/');
		const subId = parts[2];
		const sub = DB.subscriptions.find((s) => s.id === subId);
		if (sub) {
			sub.subscription_status = 'paused';
			sub.updated_at = new Date().toISOString();
		}
		return sendJson(res, sub || { id: subId, subscription_status: 'paused' });
	}

	if (method === 'POST' && pathname.includes('/subscriptions/') && pathname.endsWith('/resume')) {
		const parts = pathname.split('/');
		const subId = parts[2];
		const sub = DB.subscriptions.find((s) => s.id === subId);
		if (sub) {
			sub.subscription_status = 'active';
			sub.updated_at = new Date().toISOString();
		}
		return sendJson(res, sub || { id: subId, subscription_status: 'active' });
	}

	if (method === 'GET' && pathname.includes('/subscriptions/') && pathname.endsWith('/entitlements')) {
		const parts = pathname.split('/');
		const subId = parts[2];
		const sub = DB.subscriptions.find((s) => s.id === subId) || DB.subscriptions[0];
		const plan = DB.plans.find((p) => p.id === sub.plan_id) || DB.plans[0];
		return sendJson(res, {
			items: plan.entitlements || [],
			pagination: { total: (plan.entitlements || []).length, limit: 50, offset: 0 },
		});
	}

	// 12. Subscriptions List and Create
	if ((method === 'POST' && pathname === '/subscriptions/search') || (method === 'GET' && pathname === '/subscriptions')) {
		return sendJson(res, {
			items: DB.subscriptions,
			pagination: { total: DB.subscriptions.length, limit: 50, offset: 0 },
		});
	}

	if (method === 'GET' && pathname.startsWith('/subscriptions/')) {
		const subId = pathname.replace('/subscriptions/', '').split('/')[0];
		const sub = DB.subscriptions.find((s) => s.id === subId) || DB.subscriptions[0];
		return sendJson(res, sub);
	}

	if (method === 'POST' && pathname === '/subscriptions') {
		const body = await parseBody(req);
		const plan = DB.plans.find((p) => p.id === body.plan_id) || DB.plans[0];
		const cust = DB.customers.find((c) => c.id === body.customer_id) || DB.customers[0];
		const newSub = {
			id: 'sub_' + Date.now(),
			customer_id: body.customer_id,
			plan_id: body.plan_id,
			subscription_status: 'active',
			status: 'published',
			billing_cadence: 'recurring',
			currency: body.currency || 'USD',
			start_date: new Date().toISOString(),
			current_period_start: new Date().toISOString(),
			current_period_end: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
			billing_period: 'monthly',
			plan,
			customer: cust,
			line_items: [
				{
					id: 'li_' + Date.now(),
					display_name: plan.name + ' - Base Membership',
					amount: plan.prices?.[0]?.amount || '25.00',
					currency: 'USD',
				},
			],
			created_at: new Date().toISOString(),
			updated_at: new Date().toISOString(),
		};
		DB.subscriptions.unshift(newSub);
		return sendJson(res, newSub, 201);
	}

	// 13. Wallets
	if (
		(method === 'GET' && (pathname === '/wallets' || pathname === '/customers/wallets')) ||
		(method === 'POST' && pathname === '/wallets/search')
	) {
		return sendJson(res, {
			items: DB.wallets,
			pagination: { total: DB.wallets.length, limit: 50, offset: 0 },
		});
	}

	if (method === 'GET' && pathname.match(/\/wallets\/[^/]+\/balance/)) {
		return sendJson(res, {
			wallet_id: 'wal_active',
			real_time_balance: 75.0,
			credit_balance: 75.0,
			currency: 'USD',
			balance: 75.0,
		});
	}

	if (method === 'GET' && pathname.match(/\/wallets\/[^/]+\/transactions/)) {
		return sendJson(res, {
			items: DB.walletTransactions,
			pagination: { total: DB.walletTransactions.length, limit: 50, offset: 0 },
		});
	}

	if (method === 'POST' && pathname.match(/\/wallets\/[^/]+\/top-up/)) {
		const body = await parseBody(req);
		const amount = parseFloat(body.amount) || 25.0;
		const newTx = {
			id: 'tx_' + Date.now(),
			wallet_id: 'wal_sarah_coffee',
			type: 'credit',
			amount,
			currency: 'USD',
			transaction_reason: 'manual_balance_topup',
			description: body.description || 'Quick wallet top-up',
			created_at: new Date().toISOString(),
		};
		DB.walletTransactions.unshift(newTx);
		return sendJson(res, { success: true, transaction: newTx });
	}

	if (method === 'POST' && pathname.match(/\/wallets\/[^/]+\/debit/)) {
		const body = await parseBody(req);
		const amount = parseFloat(body.amount) || 5.0;
		const newTx = {
			id: 'tx_' + Date.now(),
			wallet_id: 'wal_sarah_coffee',
			type: 'debit',
			amount,
			currency: 'USD',
			transaction_reason: 'manual_balance_debit',
			description: body.description || 'Service redemption debit',
			created_at: new Date().toISOString(),
		};
		DB.walletTransactions.unshift(newTx);
		return sendJson(res, { success: true, transaction: newTx });
	}

	// 14. Entitlements
	if ((method === 'POST' && pathname === '/entitlements/search') || (method === 'GET' && pathname === '/entitlements')) {
		const allEntitlements = DB.plans.flatMap((p) =>
			p.entitlements.map((e) => ({
				...e,
				entity_type: 'plan',
				entity_id: p.id,
				plan: { id: p.id, name: p.name },
			})),
		);
		return sendJson(res, {
			items: allEntitlements,
			pagination: { total: allEntitlements.length, limit: 50, offset: 0 },
		});
	}

	// 15. Invoices
	if ((method === 'POST' && pathname === '/invoices/search') || (method === 'GET' && pathname === '/invoices')) {
		return sendJson(res, {
			items: DB.invoices,
			pagination: { total: DB.invoices.length, limit: 50, offset: 0 },
		});
	}

	if (method === 'GET' && pathname.startsWith('/invoices/')) {
		const invId = pathname.replace('/invoices/', '');
		const inv = DB.invoices.find((i) => i.id === invId) || DB.invoices[0];
		return sendJson(res, inv);
	}

	// 16. Payments
	if ((method === 'GET' && pathname === '/payments') || (method === 'POST' && pathname === '/payments/search')) {
		return sendJson(res, {
			items: DB.payments,
			pagination: { total: DB.payments.length, limit: 50, offset: 0 },
		});
	}

	// 17. Credit Notes
	if (
		(method === 'GET' && (pathname === '/creditnotes' || pathname === '/credit-notes')) ||
		(method === 'POST' && (pathname === '/creditnotes/search' || pathname === '/credit-notes/search'))
	) {
		return sendJson(res, {
			items: DB.creditNotes,
			pagination: { total: DB.creditNotes.length, limit: 50, offset: 0 },
		});
	}

	if (method === 'GET' && (pathname.startsWith('/creditnotes/') || pathname.startsWith('/credit-notes/'))) {
		const cnId = pathname.replace(/^\/(creditnotes|credit-notes)\//, '');
		const cn = DB.creditNotes.find((c) => c.id === cnId) || DB.creditNotes[0];
		return sendJson(res, cn);
	}

	if (method === 'POST' && (pathname === '/creditnotes/preview' || pathname === '/credit-notes/preview')) {
		return sendJson(res, {
			amount: '5.00',
			tax_amount: '0.00',
			total_amount: '5.00',
			currency: 'USD',
		});
	}

	// 18. Events & Monitoring
	if (method === 'GET' && pathname === '/events/monitoring') {
		const now = Date.now();
		const hour = 3600 * 1000;
		return sendJson(res, {
			data: [
				{ timestamp: new Date(now - 5 * hour).toISOString(), count: 42 },
				{ timestamp: new Date(now - 4 * hour).toISOString(), count: 68 },
				{ timestamp: new Date(now - 3 * hour).toISOString(), count: 112 },
				{ timestamp: new Date(now - 2 * hour).toISOString(), count: 95 },
				{ timestamp: new Date(now - 1 * hour).toISOString(), count: 140 },
				{ timestamp: new Date(now).toISOString(), count: 184 },
			],
			total_events: 641,
		});
	}

	if ((method === 'POST' && pathname === '/events/search') || (method === 'GET' && pathname === '/events')) {
		return sendJson(res, {
			items: DB.events,
			pagination: { total: DB.events.length, limit: 50, offset: 0 },
		});
	}

	if (method === 'POST' && pathname === '/events') {
		const body = await parseBody(req);
		const newEvt = {
			id: 'evt_' + Date.now(),
			event_name: body.event_name || 'daily_activity',
			external_customer_id: body.external_customer_id || 'cust_daily_01',
			customer_id: body.customer_id || 'cust_sarah_jenkins',
			timestamp: new Date().toISOString(),
			properties: body.properties || {},
		};
		DB.events.unshift(newEvt);
		return sendJson(res, newEvt, 201);
	}

	// 19. Dashboard Revenues & Trends
	if (method === 'POST' && pathname === '/dashboard/revenues') {
		return sendJson(res, {
			recent_subscriptions: {
				total_count: DB.subscriptions.length,
				plans: [
					{ plan_id: 'plan_coffee_daily', plan_name: 'Coffee Club Daily', count: 1 },
					{ plan_id: 'plan_transit_commuter', plan_name: 'Daily Commuter Pass', count: 1 },
					{ plan_id: 'plan_daily_life_bundle', plan_name: 'Daily Life All-in-One', count: 1 },
					{ plan_id: 'plan_gym_anytime', plan_name: 'Anytime Fitness 24/7', count: 1 },
				],
			},
			invoice_payment_status: {
				paid: DB.invoices.filter((i) => i.payment_status === 'PAID').length,
				failed: 0,
				pending: DB.invoices.filter((i) => i.payment_status === 'PENDING').length,
				processing: 0,
				refunded: 0,
				total: DB.invoices.length,
			},
			revenue_trend: [
				{ timestamp: '2026-10-01T00:00:00Z', amount: '190.00' },
				{ timestamp: '2026-10-15T00:00:00Z', amount: '235.00' },
			],
		});
	}

	// 20. Revenue Analytics overview
	if (method === 'GET' && (pathname === '/revenue' || pathname.startsWith('/revenue/'))) {
		return sendJson(res, {
			mrr: '235.00',
			arr: '2820.00',
			active_subscribers: 4,
			churn_rate: '0.00',
			currency: 'USD',
			trends: [
				{ date: '2026-08', mrr: 120.0 },
				{ date: '2026-09', mrr: 180.0 },
				{ date: '2026-10', mrr: 235.0 },
			],
		});
	}

	// Default fallback for any unspecified routes
	return sendJson(res, { items: [], pagination: { total: 0, limit: 50, offset: 0 } });
});

server.listen(PORT, () => {
	console.log(`⚡ 4ThePrice Demo API Server is running on http://127.0.0.1:${PORT} and http://localhost:${PORT}`);
	console.log(`Subscriptions for Daily Life demo data initialized successfully.`);
});
