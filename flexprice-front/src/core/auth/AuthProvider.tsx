import React, { ReactNode, useEffect } from 'react';
import { Navigate } from 'react-router';
import { useUser } from '@/hooks/UserContext';
import { PageLoader } from '@/components/atoms';
import useUserhook, { DEFAULT_4THEPRICE_USER } from '@/hooks/useUser';
import { config } from '@/config/config';

interface AuthMiddlewareProps {
	children: ReactNode;
}

export interface UserLookupFailedState {
	userLookupFailed: true;
}

/** Authentication only — per-route permission gating lives in MainLayout (see useRouteAccess). */
const AuthMiddleware: React.FC<AuthMiddlewareProps> = ({ children }) => {
	const userContext = useUser();
	const { user, loading } = useUserhook();

	useEffect(() => {
		const currentUser = user || DEFAULT_4THEPRICE_USER;
		userContext.setUser(currentUser);
	}, [user, userContext]);

	if (loading) {
		return <PageLoader />;
	}

	// In hackathon / no-login mode, never redirect to /auth; proceed directly with active user
	if (!user && config.auth?.enabled) {
		const state: UserLookupFailedState = { userLookupFailed: true };
		return <Navigate to='/auth' state={state} />;
	}

	return <div>{children}</div>;
};

export default AuthMiddleware;
