import MainLayout from '@/layouts/MainLayout';
import { createBrowserRouter, Navigate } from 'react-router';
import AuthMiddleware from '../auth/AuthProvider';
import { Suspense } from 'react';
import { Loader } from '@/components/atoms';
import { requirePermission } from '@/core/routes/useRouteAccess';
import {
	// Customer pages
	CustomerListPage as CustomerPage,
	Subscriptions as SubscriptionsPage,
	CreateCustomerSubscriptionPage,
	CustomerProfilePage,
	InvoicePage,
	InvoiceDetailsPage,
	EditInvoicePage,
	CustomerInvoiceTab as Invoice,
	CustomerOverviewTab as Overview,
	CustomerAnalyticsTab as AnalyticsTab,
	CustomerWalletTab as WalletTab,
	CustomerSubscriptionDetailsPage,
	CustomerSubscriptionEditPage,
	AddCreditNotePage as AddCreditPage,
	CreditNote,
	CreditNotesPage,
	CreditNoteDetailsPage,
	CreditsEntitlementsPage,
	ImportExport,
	CustomerInvoiceDetailsPage,
	CustomerInformationTab as CustomerInformation,
	CustomerUsageEventsTab as CustomerUsageEvents,
	PaymentPage,
	CreateInvoice as CreateInvoicePage,
	TaxRatesPage as TaxPage,
	CustomerTaxAssociationTab as TaxAssociation,
	TaxrateDetailsPage,
	// Product catalog pages
	Plans as PricingPlans,
	PlanDetailsPage,
	PlanOverviewTab as PlanOverview,
	PlanEntitlementsTab as PlanEntitlements,
	PlanCreditGrantsTab as PlanCreditGrants,
	PlanInformationTab as PlanInformation,
	AddFeature as AddFeaturePage,
	Features as FeaturesPage,
	FeatureDetails,
	Addons as AddonsPage,
	AddonDetails as AddonDetailsPage,
	AddonCharges as AddonChargesPage,
	Pricing as PricingPage,
	AddCharges as AddChargesPage,
	Coupons as CouponsPage,
	CouponDetails,
	PriceUnits as PriceUnitsPage,
	// Usage pages
	Events as EventsPage,
	Query as QueryPage,
	// Developer pages
	DeveloperPage,
	// Webhooks pages
	WebhookDashboardLazy,
	// Settings pages
	SettingsDashboard,
	// Insights tools pages
	Integrations,
	IntegrationDetails,
	Revenue,
	Exports,
	QuickBooksOAuthCallback,
	DashboardPage,
	// Checkout
	CheckoutPage,
} from '@/pages';
import { ErrorPage } from '@/components/organisms';
import { RouterErrorElement } from '@/components/atoms/ErrorBoundary';

export const RouteNames = {
	// customer portal
	customerPortal: '/customer-portal',

	home: '/',
	login: '/login',
	auth: '/auth',
	signupConfirmation: '/auth/signup/confirmation',
	// Where a Supabase password-reset email sends the browser. Defined in
	// pages/auth/authTabs so the tab resolver can read it without importing this
	// module; must be in the Supabase project's Redirect URLs allow-list.
	resetPassword: '/auth/reset-password',
	resendVerification: '/auth/resend-verification',
	verifyEmail: '/auth/verify-email',
	// Where the backend sends the browser after it validates a SAML assertion.
	// Must match auth.saml.dashboard_url in the backend configuration.
	samlCallback: '/auth/callback',
	// Where Supabase sends the browser when an app asks to act for a user.
	// Must match the Authorization Path set in Supabase (Authentication > OAuth Server).
	oauthConsent: '/oauth/consent',

	// Dashboard routes
	homeDashboard: '/home',

	// usage tracking routes
	usageTracking: '/usage-tracking',
	meter: '/usage-tracking/meter',
	addMeter: '/usage-tracking/meter/add-meter',
	editMeter: '/usage-tracking/meter/edit-meter',
	events: '/usage-tracking/events',
	queryPage: '/usage-tracking/query',

	// billing routes
	billing: '/billing',
	customers: '/billing/customers',
	subscriptions: '/billing/subscriptions',
	createSubscription: '/billing/subscriptions/create',
	subscriptionDetails: '/billing/subscriptions/:id',
	taxes: '/billing/taxes',
	invoices: '/billing/invoices',
	createInvoice: '/billing/customers/:customerId/invoices/create',
	creditNotes: '/billing/credit-notes',
	payments: '/billing/payments',
	analytics: '/billing/analytics',

	// product catalog routes
	productCatalog: '/product-catalog',
	plan: '/product-catalog/plan',
	pricing: '/product-catalog/pricing-widget',
	creditsEntitlements: '/credits-entitlements',
	insights: '/insights',
	addCharges: '/product-catalog/plan/:planId/add-charges',

	features: '/product-catalog/features',
	createFeature: '/product-catalog/features/create-feature',
	featureDetails: '/product-catalog/features',

	// coupon routes
	coupons: '/product-catalog/coupons',
	couponDetails: '/product-catalog/coupons',

	// add on routes
	addons: '/product-catalog/addons',
	addonDetails: '/product-catalog/addons',
	addonCharges: '/product-catalog/addons/:addonId/add-charges',

	// cost sheet routes
	costSheets: '/product-catalog/cost-sheets',
	costSheetDetails: '/product-catalog/cost-sheets',
	costSheetCharges: '/product-catalog/cost-sheets/:costSheetId/add-charges',

	// group routes
	groups: '/product-catalog/groups',

	// price unit routes
	priceUnits: '/product-catalog/price-units',

	// developers routes
	developers: '/developers',
	webhooks: '/developers/webhooks',
	apiKeys: '/developers/api-keys',
	serviceAccounts: '/developers/service-accounts',
	workflows: '/developers/workflows',
	workflowDetails: '/developers/workflows/:workflowId/:runId',

	// tools routes
	tools: '/tools',
	bulkImports: '/tools/bulk-imports',
	revenue: '/revenue',
	integrations: '/tools/integrations',
	integrationDetails: '/tools/integrations',
	oauthCallback: '/tools/integrations/oauth/callback', // Generic OAuth callback (backend redirect URI)
	quickBooksOAuthCallback: '/tools/integrations/quickbooks/oauth/callback', // Legacy route
	exports: '/tools/exports',
	s3Exports: '/tools/exports/s3',
	s3ExportManagement: '/tools/exports/s3/:connectionId/export',
	s3ExportDetails: '/tools/exports/s3/:connectionId/export/:exportId',
	s3TaskRuns: '/tools/exports/s3/:connectionId/export/:exportId/runs',
	usageSyncs: '/tools/usage-syncs',

	// footer
	onboarding: '/onboarding',
	pricingSetup: '/onboarding/pricing-setup',
	settings: '/settings',
	customerBilling: '/settings/billing',

	// checkout (public - multi-provider: Paddle and Moyasar)
	checkout: '/checkout',
};

const DefaultRoute = () => {
	return <Navigate to={RouteNames.homeDashboard} replace />;
};

export const MainRouter: any = createBrowserRouter([
	// public routes - direct bypass to 4ThePrice platform (no login required)
	{
		path: RouteNames.login,
		element: <Navigate to={RouteNames.homeDashboard} replace />,
	},
	{
		path: RouteNames.auth,
		element: <Navigate to={RouteNames.homeDashboard} replace />,
	},
	{
		path: RouteNames.signupConfirmation,
		element: <Navigate to={RouteNames.homeDashboard} replace />,
	},
	{
		path: RouteNames.resetPassword,
		element: <Navigate to={RouteNames.homeDashboard} replace />,
	},
	{
		path: RouteNames.resendVerification,
		element: <Navigate to={RouteNames.homeDashboard} replace />,
	},
	{
		path: RouteNames.verifyEmail,
		element: <Navigate to={RouteNames.homeDashboard} replace />,
	},
	{
		path: RouteNames.samlCallback,
		element: <Navigate to={RouteNames.homeDashboard} replace />,
	},
	{
		path: RouteNames.oauthConsent,
		element: <Navigate to={RouteNames.homeDashboard} replace />,
	},

	{
		path: RouteNames.checkout,
		element: <CheckoutPage />,
	},
	// private routes
	{
		path: RouteNames.home,
		element: (
			<AuthMiddleware>
				<MainLayout />
			</AuthMiddleware>
		),
		errorElement: <RouterErrorElement />,
		children: [
			{
				path: RouteNames.home,
				element: <DefaultRoute />,
			},
			{
				path: RouteNames.homeDashboard,
				element: <DashboardPage />,
			},
			{
				path: RouteNames.productCatalog,
				children: [
					{
						path: RouteNames.features,
						element: <FeaturesPage />,
						handle: requirePermission('feature', 'read'),
					},
					{
						path: RouteNames.createFeature,
						element: <AddFeaturePage />,
						handle: requirePermission('feature', 'write'),
					},
					{
						path: `${RouteNames.featureDetails}/:id`,
						element: <FeatureDetails />,
						handle: requirePermission('feature', 'read'),
					},
					{
						path: RouteNames.plan,
						element: <PricingPlans />,
						handle: requirePermission('plan', 'read'),
					},
					{
						path: `${RouteNames.plan}/:planId`,
						element: <PlanDetailsPage />,
						handle: requirePermission('plan', 'read'),
						children: [
							{
								path: '',
								element: <PlanOverview />,
								index: true,
							},
							{
								path: 'entitlements',
								element: <PlanEntitlements />,
							},
							{
								path: 'credit-grants',
								element: <PlanCreditGrants />,
							},
							{
								path: 'information',
								element: <PlanInformation />,
							},
						],
					},
					{
						path: RouteNames.addCharges,
						element: <AddChargesPage />,
						// Gated on `price`, not `plan` — POST/PUT/DELETE /prices is independently
						// permissioned server-side (internal/api/router.go's price group).
						handle: requirePermission('price', 'write'),
					},
					{
						path: RouteNames.coupons,
						element: <CouponsPage />,
						handle: requirePermission('coupon', 'read'),
					},
					{
						path: `${RouteNames.couponDetails}/:id`,
						element: <CouponDetails />,
						handle: requirePermission('coupon', 'read'),
					},
					{
						path: RouteNames.addons,
						element: <AddonsPage />,
						handle: requirePermission('addon', 'read'),
					},
					{
						path: `${RouteNames.addonDetails}/:id`,
						element: <AddonDetailsPage />,
						handle: requirePermission('addon', 'read'),
					},
					{
						path: RouteNames.addonCharges,
						element: <AddonChargesPage />,
						// Gated on `price`, not `addon` — POST/PUT/DELETE /prices is independently
						// permissioned server-side, same as the plan add-charges route above.
						handle: requirePermission('price', 'write'),
					},
					{
						path: RouteNames.priceUnits,
						element: <PriceUnitsPage />,
						// No dedicated RBAC entity for price units — gated on `price`, same
						// reasoning as the UI-level checks in PriceUnits.tsx.
						handle: requirePermission('price', 'read'),
					},
				],
			},
			{
				path: RouteNames.billing,
				children: [
					{
						path: RouteNames.customers,
						element: <CustomerPage />,
						handle: requirePermission('customer', 'read'),
					},
					{
						path: RouteNames.subscriptions,
						element: <SubscriptionsPage />,
						handle: requirePermission('subscription', 'read'),
					},
					{
						path: RouteNames.createSubscription,
						element: <CreateCustomerSubscriptionPage />,
						handle: requirePermission('subscription', 'write'),
					},
					{
						path: `${RouteNames.subscriptions}/:id/edit`,
						element: <CustomerSubscriptionEditPage />,
						handle: requirePermission('subscription', 'write'),
					},
					{
						path: `${RouteNames.customers}/:id/add-subscription`,
						element: <CreateCustomerSubscriptionPage />,
						handle: requirePermission('subscription', 'write'),
					},
					{
						path: RouteNames.taxes,
						element: <TaxPage />,
						handle: requirePermission('tax', 'read'),
					},
					{
						path: `${RouteNames.taxes}/:taxrateId`,
						element: <TaxrateDetailsPage />,
						handle: requirePermission('tax', 'read'),
					},
					{
						path: RouteNames.invoices,
						element: <InvoicePage />,
						handle: requirePermission('invoice', 'read'),
					},
					{
						path: `${RouteNames.invoices}/:invoiceId`,
						element: <InvoiceDetailsPage />,
						handle: requirePermission('invoice', 'read'),
					},
					{
						path: `${RouteNames.invoices}/:invoiceId/edit`,
						element: <EditInvoicePage />,
						handle: requirePermission('invoice', 'write'),
					},
					{
						path: RouteNames.creditNotes,
						element: <CreditNotesPage />,
						// ['read', 'write'] — this list is the only navigable path to creating a
						// credit note, so a write-only role still needs to reach it.
						handle: requirePermission('creditnote', ['read', 'write']),
					},
					{
						path: `${RouteNames.creditNotes}/:credit_note_id`,
						element: <CreditNoteDetailsPage />,
						handle: requirePermission('creditnote', ['read', 'write']),
					},
					{
						path: RouteNames.payments,
						element: <PaymentPage />,
						handle: requirePermission('payment', ['read', 'write']),
					},
					// {
					// 	path: RouteNames.analytics,
					// 	element: <CostAnalyticsPage />,
					// },
					{
						path: `${RouteNames.customers}/:id`,
						element: <CustomerProfilePage />,
						handle: requirePermission('customer', 'read'),
						children: [
							{
								path: '',
								element: <Overview />,
								index: true,
							},
							{
								path: 'overview',
								element: <Overview />,
								index: true,
							},
							{
								path: 'information',
								element: <CustomerInformation />,
							},
							{
								path: 'usage-events',
								element: <CustomerUsageEvents />,
							},
							{
								path: 'wallet',
								element: <WalletTab />,
							},
							{
								path: 'credit-note',
								element: <CreditNote />,
							},
							{
								path: 'invoice',
								element: <Invoice />,
							},
							{
								path: 'tax-association',
								element: <TaxAssociation />,
							},
							{
								path: 'analytics',
								element: <AnalyticsTab />,
							},

							{
								path: 'invoice/:invoice_id',
								element: <CustomerInvoiceDetailsPage />,
								// Route-sibling of /billing/invoices, not a descendant — needs its own
								// handle rather than relying on that route's `invoice` requirement.
								// RouteGuard requires every handle in the matched chain, so this still
								// combines with the parent customer-profile route's `customer:read`.
								handle: requirePermission('invoice', 'read'),
							},
							{
								path: 'invoice/:invoice_id/credit-note',
								element: <AddCreditPage />,
								// Submits via CreditNoteApi.createCreditNote, so this needs creditnote:write,
								// not invoice:write — a user who can write invoices but not credit notes
								// (or vice versa) should be gated on the permission the mutation actually uses.
								handle: requirePermission('creditnote', 'write'),
							},
							{
								path: 'subscription/:subscription_id',
								element: <CustomerSubscriptionDetailsPage />,
								handle: requirePermission('subscription', 'read'),
							},
							{
								path: 'subscription/:subscription_id/edit',
								element: <CustomerSubscriptionEditPage />,
								handle: requirePermission('subscription', 'write'),
							},
							{
								path: 'usage-events',
								element: <CustomerUsageEvents />,
							},
						],
					},
					{
						path: `${RouteNames.customers}/:customerId/invoices/create`,
						element: <CreateInvoicePage />,
						handle: requirePermission('invoice', 'write'),
					},
				],
			},
			{
				path: RouteNames.usageTracking,
				children: [
					{
						path: RouteNames.events,
						element: <EventsPage />,
					},
					{
						path: RouteNames.queryPage,
						element: <QueryPage />,
					},
				],
			},
			{
				path: RouteNames.pricing,
				element: <PricingPage />,
			},
			{
				path: RouteNames.creditsEntitlements,
				element: <CreditsEntitlementsPage />,
			},
			{
				path: RouteNames.insights,
				element: <Revenue />,
			},
			{
				path: RouteNames.revenue,
				element: <Revenue />,
			},
			{
				path: RouteNames.developers,
				children: [
					{
						path: RouteNames.webhooks,
						element: (
							<Suspense
								fallback={
									<div className='flex h-96 w-full items-center justify-center'>
										<Loader />
									</div>
								}>
								<WebhookDashboardLazy />
							</Suspense>
						),
						handle: requirePermission('webhook', 'read'),
					},
					{
						path: RouteNames.apiKeys,
						element: <DeveloperPage />,
						handle: requirePermission('secret', 'read'),
					},
				],
			},
			{
				path: RouteNames.tools,
				children: [
					{
						path: RouteNames.integrations,
						element: <Integrations />,
						handle: requirePermission('connection', 'read'),
					},
					{
						path: `${RouteNames.integrationDetails}/:id`,
						element: <IntegrationDetails />,
						handle: requirePermission('connection', 'read'),
					},
					{
						// OAuth redirect landing page — must stay reachable mid-flow regardless of RBAC.
						path: RouteNames.oauthCallback,
						element: <QuickBooksOAuthCallback />,
					},
					{
						path: RouteNames.quickBooksOAuthCallback,
						element: <QuickBooksOAuthCallback />,
					},
					{
						path: RouteNames.bulkImports,
						element: <ImportExport />,
						handle: requirePermission('task', 'read'),
					},
					{
						path: RouteNames.exports,
						element: <Exports />,
						handle: requirePermission('task', 'read'),
					},
				],
			},
			{
				path: RouteNames.settings,
				element: <SettingsDashboard />,
			},
			{
				path: RouteNames.customerBilling,
				element: <Navigate to={`${RouteNames.settings}?tab=billing`} replace />,
			},
		],
	},
	{
		path: '*',
		element: <ErrorPage />,
		errorElement: <RouterErrorElement />,
	},
]);
