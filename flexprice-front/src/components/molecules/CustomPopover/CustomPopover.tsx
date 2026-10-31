import React, { useState, ReactNode } from 'react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';

interface CustomPopoverProps {
	/** The element that will trigger the popover when clicked */
	trigger: ReactNode;
	/** The content to display inside the popover */
	children: ReactNode;
	/** Optional className for the popover content */
	contentClassName?: string;
	/** Optional className for the trigger wrapper */
	triggerClassName?: string;
	/** Side of the trigger to render the content (top, right, bottom, left) */
	side?: 'top' | 'right' | 'bottom' | 'left';
	/** Controls whether popover is open or closed */
	open?: boolean;
	/** Called when the open state of the popover changes */
	onOpenChange?: (open: boolean) => void;
	/** Alignment of popover relative to trigger */
	align?: 'start' | 'center' | 'end';
	/** Distance in pixels from the trigger */
	sideOffset?: number;
	/** Additional props to pass to the popover content */
	contentProps?: React.ComponentPropsWithoutRef<typeof PopoverContent>;
}

/**
 * A reusable popover component that can be used with any trigger and content
 *
 * @example
 * ```tsx
 * <CustomPopover
 *   trigger={<Button>Click me</Button>}
 *   side="bottom"
 * >
 *   <div className="p-4">
 *     <h3>Popover Content</h3>
 *     <p>This can be any React node!</p>
 *   </div>
 * </CustomPopover>
 * ```
 */
const CustomPopover: React.FC<CustomPopoverProps> = ({
	trigger,
	children,
	contentClassName,
	triggerClassName,
	side = 'bottom',
	align = 'center',
	sideOffset = 4,
	open,
	onOpenChange,
	contentProps = {},
}) => {
	const [isOpen, setIsOpen] = useState(false);

	// Use controlled state if provided, otherwise use internal state
	const isControlled = open !== undefined;
	const isPopoverOpen = isControlled ? open : isOpen;

	const handleOpenChange = (newOpen: boolean) => {
		if (!isControlled) {
			setIsOpen(newOpen);
		}
		onOpenChange?.(newOpen);
	};

	return (
		<Popover open={isPopoverOpen} onOpenChange={handleOpenChange}>
			<PopoverTrigger asChild className={triggerClassName}>
				<div className='inline-block'>{trigger}</div>
			</PopoverTrigger>
			<PopoverContent side={side} align={align} sideOffset={sideOffset} className={cn('', contentClassName)} {...contentProps}>
				{children}
			</PopoverContent>
		</Popover>
	);
};

export default CustomPopover;
