import { ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import { ErrorBoundary as ReactErrorBoundary } from 'react-error-boundary';
import { useRouteError, Navigate } from 'react-router';
import { Button } from '@/components/atoms';
import { RouteNames } from '@/core/routes/Routes';

interface ErrorInfo {
	componentStack?: string | null;
}

// Generate a unique error ID
const generateErrorId = () => `err_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`;

// Log error to console for diagnosis
const logError = (error: Error, info?: ErrorInfo, metadata?: Record<string, any>) => {
	const errorId = generateErrorId();

	console.error('[ErrorBoundary]', {
		error,
		componentStack: info?.componentStack,
		errorId,
		...metadata,
	});

	return errorId;
};

// Error Fallback UI Component
interface ErrorFallbackProps {
	error?: Error | null;
	errorInfo?: ErrorInfo | null;
	errorId?: string;
	resetError: () => void;
}

export const ErrorFallback = ({ resetError }: ErrorFallbackProps) => {
	const { t } = useTranslation('common');

	const handleGoHome = () => {
		resetError();
		window.location.href = RouteNames.homeDashboard;
	};

	return (
		<div
			className='min-h-screen w-full flex items-center justify-center bg-background px-6 py-12'
			role='alert'>
			<div className='max-w-md w-full bg-surface border border-line rounded-xl p-8 text-center shadow-sm space-y-6'>
				<div className='space-y-2'>
					<h2 className='text-2xl font-semibold tracking-tight text-content-heading'>
						4ThePrice Daily
					</h2>
					<p className='text-sm text-content-muted'>
						{t('errorPage.description', 'Subscriptions for daily life management. Return to your subscription overview.')}
					</p>
				</div>

				<div className='flex flex-col gap-3 pt-2'>
					<Button onClick={handleGoHome} className='w-full' size='lg'>
						{t('errorPage.home', 'Return to Overview')}
					</Button>
				</div>
			</div>
		</div>
	);
};

// Main ErrorBoundary Component
interface ErrorBoundaryProps {
	children: ReactNode;
	fallback?: ReactNode;
	onError?: (error: Error, errorInfo: ErrorInfo) => void;
	name?: string;
}

export const ErrorBoundary = ({ children, fallback, onError, name = 'unnamed' }: ErrorBoundaryProps) => {
	const handleError = (error: Error, info: ErrorInfo) => {
		logError(error, info, { boundary: name });
		onError?.(error, info);
	};

	return (
		<ReactErrorBoundary
			FallbackComponent={({ resetErrorBoundary }) =>
				fallback || <ErrorFallback resetError={resetErrorBoundary} />
			}
			onError={(error: unknown, info: ErrorInfo) => handleError(error as Error, info)}>
			{children as ReactNode}
		</ReactErrorBoundary>
	);
};

// Router Error Element - Used with React Router's errorElement
export const RouterErrorElement = () => {
	const error = useRouteError() as Error;
	logError(error, undefined, { source: 'RouterErrorElement' });

	// If the current path is anything other than /home or /, smoothly navigate back to /home
	if (typeof window !== 'undefined' && window.location.pathname !== RouteNames.homeDashboard && window.location.pathname !== RouteNames.home) {
		return <Navigate to={RouteNames.homeDashboard} replace />;
	}

	return <ErrorFallback error={error} resetError={() => (window.location.href = RouteNames.homeDashboard)} />;
};

export default ErrorBoundary;
