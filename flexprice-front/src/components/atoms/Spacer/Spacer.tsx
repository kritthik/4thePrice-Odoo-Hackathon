import { FC } from 'react';

interface Props {
	width?: string | number;
	height?: string | number;
	className?: string;
}
const Spacer: FC<Props> = ({ height, width, className }) => {
	return (
		<div
			style={{
				height: height ?? 0,
				width: width ?? 0,
			}}
			className={className}></div>
	);
};

export default Spacer;
