import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader, useSidebar } from '@/components/ui';
import React, { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import SidebarNav, { NavItem } from './SidebarMenu';
import FlexpriceSidebarFooter from './SidebarFooter';
import { RouteNames } from '@/core/routes/Routes';
import { EnvironmentSelector } from '@/components/molecules';
import {
	Home,
	Layers2,
	Users,
	RefreshCw,
	Activity,
	Receipt,
	Gift,
	BarChart3,
	Settings,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useLocaleStore } from '@/store/useLocaleStore';
import { Direction } from '@/config/branding';

const AppSidebar: React.FC<React.ComponentProps<typeof Sidebar>> = ({ ...props }) => {
	const { t } = useTranslation('common');
	const { open: sidebarOpen } = useSidebar();
	const direction = useLocaleStore((s) => s.direction);
	const side = direction === Direction.RTL ? 'right' : 'left';

	const navMain: NavItem[] = useMemo(
		() => [
			// 1. Overview
			{
				title: t('sidebar.nav.overview', 'Overview'),
				url: RouteNames.homeDashboard,
				icon: Home,
			},
			// 2. Products and Plans
			{
				title: t('sidebar.nav.productsAndPlans', 'Products & Plans'),
				url: RouteNames.plan,
				icon: Layers2,
				items: [
					{
						title: t('sidebar.nav.plans', 'Plans'),
						url: RouteNames.plan,
					},
					{
						title: t('sidebar.nav.features', 'Features'),
						url: RouteNames.features,
					},
					{
						title: t('sidebar.nav.priceUnits', 'Price Units'),
						url: RouteNames.priceUnits,
					},
					{
						title: t('sidebar.nav.addons', 'Addons'),
						url: RouteNames.addons,
					},
					{
						title: t('sidebar.nav.coupons', 'Coupons'),
						url: RouteNames.coupons,
					},
					{
						title: t('sidebar.nav.pricingWidget', 'Pricing Widget'),
						url: RouteNames.pricing,
					},
				],
			},
			// 3. Customers
			{
				title: t('sidebar.nav.customers', 'Customers'),
				url: RouteNames.customers,
				icon: Users,
			},
			// 4. Subscriptions
			{
				title: t('sidebar.nav.subscriptions', 'Subscriptions'),
				url: RouteNames.subscriptions,
				icon: RefreshCw,
			},
			// 5. Usage & Metering
			{
				title: t('sidebar.nav.usageAndMetering', 'Usage & Metering'),
				url: RouteNames.events,
				icon: Activity,
				items: [
					{
						title: t('sidebar.nav.eventsDebugger', 'Live Events'),
						url: RouteNames.events,
					},
					{
						title: t('sidebar.nav.usageQuery', 'Usage Query'),
						url: RouteNames.queryPage,
					},
				],
			},
			// 6. Billing and Invoices
			{
				title: t('sidebar.nav.billingAndInvoices', 'Billing & Invoices'),
				url: RouteNames.invoices,
				icon: Receipt,
				items: [
					{
						title: t('sidebar.nav.invoices', 'Invoices'),
						url: RouteNames.invoices,
					},
					{
						title: t('sidebar.nav.payments', 'Payments'),
						url: RouteNames.payments,
					},
					{
						title: t('sidebar.nav.creditNotes', 'Credit Notes'),
						url: RouteNames.creditNotes,
					},
				],
			},
			// 7. Credits and Entitlements
			{
				title: t('sidebar.nav.creditsAndEntitlements', 'Credits & Entitlements'),
				url: RouteNames.creditsEntitlements,
				icon: Gift,
			},
			// 8. Insights
			{
				title: t('sidebar.nav.insights', 'Insights'),
				url: RouteNames.insights,
				icon: BarChart3,
			},
			// 9. Settings
			{
				title: t('sidebar.nav.settings', 'Settings'),
				url: RouteNames.settings,
				icon: Settings,
			},
		],
		[t],
	);

	return (
		<Sidebar
			collapsible='icon'
			side={side}
			{...props}
			className={cn('border-line-strong py-1 bg-surface-sidebar', sidebarOpen ? 'px-3' : 'px-2')}>
			<SidebarHeader>
				<EnvironmentSelector />
			</SidebarHeader>
			<SidebarContent className='gap-0 mt-1'>
				<SidebarNav items={navMain} />
			</SidebarContent>
			<SidebarFooter>
				<FlexpriceSidebarFooter />
			</SidebarFooter>
		</Sidebar>
	);
};

export default AppSidebar;
