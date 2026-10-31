import { FC, useState } from 'react';
import { Page, Spacer, Loader, Card, Chip } from '@/components/atoms';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui';
import { useQuery } from '@tanstack/react-query';
import WalletApi from '@/api/WalletApi';
import CreditNoteApi from '@/api/CreditNoteApi';
import EntitlementApi from '@/api/EntitlementApi';
import AllWalletTransactionsTable from '@/components/molecules/Wallet/AllWalletTransactionsTable';
import { CreditNoteTable } from '@/components/molecules/CreditNoteTable';
import { Wallet, ShieldCheck, FileText } from 'lucide-react';
import FlexpriceTable, { ColumnData } from '@/components/molecules/Table';
import { EntitlementResponse } from '@/types/dto/Entitlement';

export const CreditsEntitlementsPage: FC = () => {
	const [activeTab, setActiveTab] = useState<string>('transactions');

	// 1. Fetch all wallet transactions
	const {
		data: transactionsData,
		isLoading: loadingTransactions,
	} = useQuery({
		queryKey: ['allWalletTransactions'],
		queryFn: async () => {
			return await WalletApi.getAllWalletTransactionsByFilter({
				limit: 50,
				offset: 0,
			});
		},
	});

	// 2. Fetch credit notes
	const {
		data: creditNotesData,
		isLoading: loadingCreditNotes,
	} = useQuery({
		queryKey: ['allCreditNotesForCreditsPage'],
		queryFn: async () => {
			return await CreditNoteApi.getCreditNotes({
				limit: 50,
				offset: 0,
				expand: 'invoice,customer',
			});
		},
	});

	// 3. Fetch entitlements
	const {
		data: entitlementsData,
		isLoading: loadingEntitlements,
	} = useQuery({
		queryKey: ['allEntitlementsForCreditsPage'],
		queryFn: async () => {
			return await EntitlementApi.search({
				limit: 50,
				offset: 0,
			});
		},
	});

	const transactions = transactionsData?.items ?? [];
	const creditNotes = creditNotesData?.items ?? [];
	const entitlements = entitlementsData?.items ?? [];

	const entitlementColumns: ColumnData<EntitlementResponse>[] = [
		{
			title: 'Feature',
			render: (row) => (
				<div className='flex items-center gap-2'>
					<ShieldCheck className='size-4 text-primary' />
					<div>
						<p className='font-medium text-sm'>{row.feature?.name || 'Unnamed Feature'}</p>
						<p className='text-xs text-muted-foreground'>{row.feature?.lookup_key || row.feature_id}</p>
					</div>
				</div>
			),
		},
		{
			title: 'Applied To',
			render: (row) => (
				<Chip
					label={row.plan?.name ? `Plan: ${row.plan.name}` : row.entity_type}
					className='capitalize text-xs font-normal'
				/>
			),
		},
		{
			title: 'Access',
			render: (row) => (
				<Chip
					variant={row.is_enabled ? 'success' : 'default'}
					label={row.is_enabled ? 'Allowed' : 'Restricted'}
					className='text-xs'
				/>
			),
		},
		{
			title: 'Allowance / Limit',
			render: (row) => (
				<span className='text-sm font-medium'>
					{row.usage_limit != null ? `${row.usage_limit} units` : 'Unlimited'}
				</span>
			),
		},
		{
			title: 'Reset Period',
			render: (row) => (
				<span className='text-sm text-muted-foreground capitalize'>
					{row.usage_reset_period || 'Billing Cycle'}
				</span>
			),
		},
	];

	return (
		<Page heading='Credits & Entitlements' className='space-y-6'>
			{/* Metric summary banner */}
			<div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
				<Card className='p-4 flex items-center justify-between border-line-subtle shadow-sm'>
					<div>
						<p className='text-xs font-medium text-muted-foreground uppercase tracking-wider'>Wallet Activity</p>
						<p className='text-2xl font-bold mt-1'>{transactions.length}</p>
						<p className='text-xs text-muted-foreground mt-0.5'>Recorded credits & debits</p>
					</div>
					<div className='p-3 bg-primary/10 text-primary rounded-xl'>
						<Wallet className='size-6' />
					</div>
				</Card>

				<Card className='p-4 flex items-center justify-between border-line-subtle shadow-sm'>
					<div>
						<p className='text-xs font-medium text-muted-foreground uppercase tracking-wider'>Active Entitlements</p>
						<p className='text-2xl font-bold mt-1'>{entitlements.length}</p>
						<p className='text-xs text-muted-foreground mt-0.5'>Feature limits & quotas</p>
					</div>
					<div className='p-3 bg-emerald-500/10 text-emerald-600 rounded-xl'>
						<ShieldCheck className='size-6' />
					</div>
				</Card>

				<Card className='p-4 flex items-center justify-between border-line-subtle shadow-sm'>
					<div>
						<p className='text-xs font-medium text-muted-foreground uppercase tracking-wider'>Credit Notes</p>
						<p className='text-2xl font-bold mt-1'>{creditNotes.length}</p>
						<p className='text-xs text-muted-foreground mt-0.5'>Adjustments & refunds</p>
					</div>
					<div className='p-3 bg-amber-500/10 text-amber-600 rounded-xl'>
						<FileText className='size-6' />
					</div>
				</Card>
			</div>

			<Tabs value={activeTab} onValueChange={setActiveTab} className='w-full'>
				<TabsList className='bg-muted/60 p-1 rounded-lg'>
					<TabsTrigger value='transactions' className='flex items-center gap-2'>
						<Wallet className='size-4' />
						<span>Wallet Transactions</span>
					</TabsTrigger>
					<TabsTrigger value='entitlements' className='flex items-center gap-2'>
						<ShieldCheck className='size-4' />
						<span>Feature Entitlements</span>
					</TabsTrigger>
					<TabsTrigger value='credit-notes' className='flex items-center gap-2'>
						<FileText className='size-4' />
						<span>Credit Notes</span>
					</TabsTrigger>
				</TabsList>

				<Spacer className='h-4' />

				{/* Transactions Tab */}
				<TabsContent value='transactions'>
					{loadingTransactions ? (
						<Loader />
					) : transactions.length === 0 ? (
						<div className='border rounded-xl p-8 text-center bg-card'>
							<Wallet className='size-10 mx-auto text-muted-foreground opacity-60 mb-2' />
							<h3 className='text-base font-semibold'>No Wallet Transactions Yet</h3>
							<p className='text-sm text-muted-foreground max-w-md mx-auto mt-1'>
								Customer wallet top-ups, debit charges, and promotional credit grants will appear here automatically.
							</p>
						</div>
					) : (
						<AllWalletTransactionsTable data={transactions} />
					)}
				</TabsContent>

				{/* Entitlements Tab */}
				<TabsContent value='entitlements'>
					{loadingEntitlements ? (
						<Loader />
					) : entitlements.length === 0 ? (
						<div className='border rounded-xl p-8 text-center bg-card'>
							<ShieldCheck className='size-10 mx-auto text-muted-foreground opacity-60 mb-2' />
							<h3 className='text-base font-semibold'>No Feature Entitlements Configured</h3>
							<p className='text-sm text-muted-foreground max-w-md mx-auto mt-1'>
								Assign feature limits and quotas to plans to control subscriber access.
							</p>
						</div>
					) : (
						<div className='border rounded-xl overflow-hidden'>
							<FlexpriceTable columns={entitlementColumns} data={entitlements} />
						</div>
					)}
				</TabsContent>

				{/* Credit Notes Tab */}
				<TabsContent value='credit-notes'>
					{loadingCreditNotes ? (
						<Loader />
					) : creditNotes.length === 0 ? (
						<div className='border rounded-xl p-8 text-center bg-card'>
							<FileText className='size-10 mx-auto text-muted-foreground opacity-60 mb-2' />
							<h3 className='text-base font-semibold'>No Credit Notes Issued</h3>
							<p className='text-sm text-muted-foreground max-w-md mx-auto mt-1'>
								Billing corrections and customer credit refunds will appear here.
							</p>
						</div>
					) : (
						<CreditNoteTable data={creditNotes} />
					)}
				</TabsContent>
			</Tabs>
		</Page>
	);
};

export default CreditsEntitlementsPage;
