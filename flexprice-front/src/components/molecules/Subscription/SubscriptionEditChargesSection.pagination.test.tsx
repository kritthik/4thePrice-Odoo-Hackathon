import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { MemoryRouter } from 'react-router';
import { I18nextProvider } from 'react-i18next';
import { createInstance } from 'i18next';
import type { i18n as I18nInstance } from 'i18next';
import { initReactI18next } from 'react-i18next';
import { describe, it, expect, vi, beforeAll, beforeEach } from 'vitest';
import commonEn from '@/i18n/locales/en/common.json';

const mockSearchSubscriptionLineItems = vi.hoisted(() => vi.fn());

vi.mock('@/api/SubscriptionApi', () => ({
	default: {
		searchSubscriptionLineItems: (...args: unknown[]) => mockSearchSubscriptionLineItems(...args),
	},
}));

vi.mock('@/components/molecules/SubscriptionLineItemTable/SubscriptionLineItemTable', () => ({
	default: () => null,
}));

vi.mock('@/components/molecules/QueryBuilder', () => ({
	QueryBuilder: ({ children }: { children?: React.ReactNode }) => <div>{children}</div>,
}));

import SubscriptionEditChargesSection from './SubscriptionEditChargesSection';

let testI18n: I18nInstance;

beforeAll(async () => {
	const instance = createInstance();
	await instance.use(initReactI18next).init({
		lng: 'en',
		fallbackLng: 'en',
		ns: ['common'],
		defaultNS: 'common',
		resources: { en: { common: commonEn } },
		interpolation: { escapeValue: false },
	});
	testI18n = instance;
});

// 25 total line items, 10 per page — enough to exercise page 1 -> page 2.
const pageOfItems = (offset: number, limit: number, total = 25) =>
	Array.from({ length: Math.max(0, Math.min(limit, total - offset)) }, (_, i) => ({
		id: `li_${offset + i}`,
		price: { id: `price_${offset + i}`, amount: '10', currency: 'usd' },
	}));

const renderSection = () => {
	// Mirrors the real app's QueryClient defaults: staleTime 0, gcTime 0, no placeholderData
	// override at the client level — the fix under test sets placeholderData on the query itself.
	const queryClient = new QueryClient({
		defaultOptions: { queries: { staleTime: 0, gcTime: 0, retry: false } },
	});
	return render(
		<QueryClientProvider client={queryClient}>
			<I18nextProvider i18n={testI18n}>
				<MemoryRouter initialEntries={['/subscriptions/sub_1/edit']}>
					<SubscriptionEditChargesSection
						subscriptionId='sub_1'
						customerId='cust_1'
						currentPeriodStart='2026-01-01T00:00:00Z'
						onEditLineItem={vi.fn()}
						onTerminateLineItem={vi.fn()}
					/>
				</MemoryRouter>
			</I18nextProvider>
		</QueryClientProvider>,
	);
};

describe('SubscriptionEditChargesSection pagination', () => {
	beforeEach(() => {
		mockSearchSubscriptionLineItems.mockReset();
		mockSearchSubscriptionLineItems.mockImplementation(async ({ limit, offset }: { limit: number; offset: number }) => {
			await new Promise((r) => setTimeout(r, 100));
			return { items: pageOfItems(offset, limit), pagination: { total: 25 } };
		});
	});

	it('does not snap back to page 1 while the next page is still loading', async () => {
		renderSection();

		// Wait for the initial (page 1) fetch to resolve and the pagination row to render.
		await waitFor(() => expect(screen.getByText(/Showing 1 to 10 of 25 charges/i)).toBeInTheDocument());
		expect(mockSearchSubscriptionLineItems).toHaveBeenCalledTimes(1);
		expect(mockSearchSubscriptionLineItems).toHaveBeenNthCalledWith(1, expect.objectContaining({ offset: 0, limit: 10 }));

		fireEvent.click(screen.getByLabelText(/next/i));

		// While the page-2 fetch is in flight, the range text must not regress to "1 to 10" —
		// that would mean the self-clamp effect reset the page back to 1 before the response landed.
		await waitFor(() => expect(mockSearchSubscriptionLineItems).toHaveBeenCalledTimes(2));
		expect(mockSearchSubscriptionLineItems).toHaveBeenNthCalledWith(2, expect.objectContaining({ offset: 10, limit: 10 }));

		await waitFor(() => expect(screen.getByText(/Showing 11 to 20 of 25 charges/i)).toBeInTheDocument());

		// The bug re-fetched page 1 a third time after bouncing back — assert that never happened.
		expect(mockSearchSubscriptionLineItems).toHaveBeenCalledTimes(2);
	});
});
