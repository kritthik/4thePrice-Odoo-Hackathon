// Convert credits to currency amount
// amount in the currency = number of credits * conversion_rate
// ex if conversion_rate is 1, then 1 USD = 1 credit
// ex if conversion_rate is 2, then 1 USD = 0.5 credits
// ex if conversion_rate is 0.5, then 1 USD = 2 credits
export const getCurrencyAmountFromCredits = (conversion_rate: number, amount: number) => {
	return amount * conversion_rate;
};

// Convert currency amount to credits
// number of credits = amount in the currency / conversion_rate
// ex if conversion_rate is 1, then 1 USD = 1 credit
// ex if conversion_rate is 2, then 1 USD = 0.5 credits
// ex if conversion_rate is 0.5, then 1 USD = 2 credits
export const getCreditsFromCurrencyAmount = (conversion_rate: number, amount: number) => {
	return amount / conversion_rate;
};
