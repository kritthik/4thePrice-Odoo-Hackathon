import { METER_AGGREGATION_TYPE, METER_USAGE_RESET_PERIOD } from '@/models/Meter';

export const formatMeterUsageResetPeriodToDisplay = (usageResetPeriod: string) => {
	switch (usageResetPeriod) {
		case METER_USAGE_RESET_PERIOD.BILLING_PERIOD:
			return 'Periodic';
		case METER_USAGE_RESET_PERIOD.NEVER:
			return 'Cumulative';
		default:
			return usageResetPeriod;
	}
};

export const formatAggregationTypeToDisplay = (aggregationType: string) => {
	switch (aggregationType) {
		case METER_AGGREGATION_TYPE.SUM:
			return 'Sum';
		case METER_AGGREGATION_TYPE.COUNT:
			return 'Count';
		case METER_AGGREGATION_TYPE.COUNT_UNIQUE:
			return 'Count Unique';
		default:
			return aggregationType;
	}
};
