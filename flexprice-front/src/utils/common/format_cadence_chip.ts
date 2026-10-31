import { CadenceStatus } from '@/types/common';

const formatCadenceChip = (data: string): string => {
	switch (data) {
		case CadenceStatus.ONCE:
			return 'Once';
		case CadenceStatus.REPEAT:
			return 'Repeat';
		case CadenceStatus.FOREVER:
			return 'Forever';
		default:
			return 'Once';
	}
};

export default formatCadenceChip;
