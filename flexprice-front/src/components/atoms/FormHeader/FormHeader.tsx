import { cn } from '@/lib/utils';
import { getTypographyClass } from '@/lib/typography';
import { FC, ReactNode } from 'react';

interface Props {
	title?: ReactNode;
	subtitle?: string;
	variant: 'form-component-title' | 'sub-header' | 'form-title' | 'default' | 'subtitle' | 'card-title';
	className?: string;
	titleClassName?: string;
	subtitleClassName?: string;
}

const FormTitle: FC<Props> = ({ variant, subtitle, title, className, subtitleClassName, titleClassName }) => {
	if (variant === 'form-title') {
		return (
			<div className={className}>
				{title && <p className={cn(getTypographyClass('form-title'), titleClassName)}>{title}</p>}
				{subtitle && <p className={cn(getTypographyClass('helper-text'), subtitleClassName)}>{subtitle}</p>}
			</div>
		);
	}

	if (variant === 'default') {
		return (
			<div className={className}>
				<h1 className={cn(getTypographyClass('h1'), titleClassName)}>{title}</h1>
				{subtitle && <p className={cn(getTypographyClass('helper-text'), subtitleClassName)}>{subtitle}</p>}
			</div>
		);
	}

	if (variant === 'sub-header') {
		return (
			<div className={cn('mb-4', className)}>
				<p className={cn(getTypographyClass('section-title'), titleClassName)}>{title}</p>
				{subtitle && <p className={cn(getTypographyClass('helper-text'), subtitleClassName)}>{subtitle}</p>}
			</div>
		);
	}

	if (variant === 'form-component-title') {
		return (
			<div className={cn('mb-2', className)}>
				{title && <p className={cn(getTypographyClass('subsection-title'), titleClassName)}>{title}</p>}
				{subtitle && <p className={cn('text-muted-foreground text-sm', subtitleClassName)}>{subtitle}</p>}
			</div>
		);
	}

	if (variant === 'subtitle') {
		return (
			<div className={cn('mb-2', className)}>
				{subtitle && <p className={cn(getTypographyClass('helper-text'), subtitleClassName)}>{subtitle}</p>}
			</div>
		);
	}

	if (variant === 'card-title') {
		return <>{title && <p className={cn(getTypographyClass('card-title'), titleClassName)}>{title}</p>}</>;
	}

	return <div></div>;
};

export default FormTitle;
