import React, { FC } from 'react';
import Card, { CardHeader } from '../Card';

interface NoDataCardProps {
	title: string;
	subtitle: string;
	cta?: React.ReactNode;
}

const NoDataCard: FC<NoDataCardProps> = ({ title, subtitle, cta }) => {
	return (
		<Card variant='notched'>
			<CardHeader title={title} subtitle={subtitle} cta={cta} />
		</Card>
	);
};

export default NoDataCard;
