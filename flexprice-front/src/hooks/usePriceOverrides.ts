import { useState, useCallback } from 'react';
import { Price } from '@/models/Price';
import { BILLING_MODEL, TIER_MODE, CreatePriceTier, TransformQuantity } from '@/models/Price';
import {
	SubscriptionLineItemOverrideRequest,
	getLineItemOverrides,
	hasPriceOverrides,
	getOverriddenPricesCount,
	ExtendedPriceOverride,
	updatePriceOverride,
	removePriceOverride,
} from '@/utils/common/price_override_helpers';

export const usePriceOverrides = (prices: Price[]) => {
	const [overriddenPrices, setOverriddenPrices] = useState<Record<string, ExtendedPriceOverride>>({});

	// Comprehensive override method
	const overridePrice = useCallback((priceId: string, override: Partial<ExtendedPriceOverride>) => {
		setOverriddenPrices((prev) => updatePriceOverride(priceId, prev, override));
	}, []);

	// Override specific fields
	const overrideBillingModel = useCallback((priceId: string, billingModel: BILLING_MODEL) => {
		setOverriddenPrices((prev) => updatePriceOverride(priceId, prev, { billing_model: billingModel }));
	}, []);

	const overrideTierMode = useCallback((priceId: string, tierMode: TIER_MODE) => {
		setOverriddenPrices((prev) => updatePriceOverride(priceId, prev, { tier_mode: tierMode }));
	}, []);

	const overrideTiers = useCallback((priceId: string, tiers: CreatePriceTier[]) => {
		setOverriddenPrices((prev) => updatePriceOverride(priceId, prev, { tiers }));
	}, []);

	const overrideTransformQuantity = useCallback((priceId: string, transformQuantity: TransformQuantity) => {
		setOverriddenPrices((prev) => updatePriceOverride(priceId, prev, { transform_quantity: transformQuantity }));
	}, []);

	const overrideQuantity = useCallback((priceId: string, quantity: number) => {
		setOverriddenPrices((prev) => updatePriceOverride(priceId, prev, { quantity }));
	}, []);

	const resetOverride = useCallback((priceId: string) => {
		setOverriddenPrices((prev) => removePriceOverride(priceId, prev));
	}, []);

	const resetAllOverrides = useCallback(() => {
		setOverriddenPrices({});
	}, []);

	const getLineItemOverridesForBackend = useCallback((): SubscriptionLineItemOverrideRequest[] => {
		return getLineItemOverrides(prices, overriddenPrices);
	}, [prices, overriddenPrices]);

	const hasAnyOverrides = useCallback((): boolean => {
		return hasPriceOverrides(overriddenPrices);
	}, [overriddenPrices]);

	const getOverridesCount = useCallback((): number => {
		return getOverriddenPricesCount(overriddenPrices);
	}, [overriddenPrices]);

	// Get specific override for a price
	const getPriceOverride = useCallback(
		(priceId: string): ExtendedPriceOverride | undefined => {
			return overriddenPrices[priceId];
		},
		[overriddenPrices],
	);

	return {
		overriddenPrices,
		overridePrice, // Comprehensive override method
		overrideBillingModel,
		overrideTierMode,
		overrideTiers,
		overrideTransformQuantity,
		overrideQuantity,
		resetOverride,
		resetAllOverrides,
		getLineItemOverridesForBackend,
		hasAnyOverrides,
		getOverridesCount,
		getPriceOverride,
	};
};
