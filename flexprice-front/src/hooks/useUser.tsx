import { useQuery } from '@tanstack/react-query';
import { UserApi } from '@/api/UserApi';
import AuthService from '@/core/auth/AuthService';
import { config } from '@/config/config';
import { User } from '@/models/User';

export const DEFAULT_4THEPRICE_USER: User = {
	id: 'usr_4theprice_admin',
	email: 'admin@4theprice.com',
	name: '4ThePrice Admin',
	type: 'user',
	roles: ['super_admin', 'admin'],
	tenant: {
		id: 'tenant_4theprice_daily',
		name: '4ThePrice Daily',
		status: 'published',
		billing_details: {
			address: {
				address_line1: '100 Market Street',
				address_line2: 'Suite 400',
				address_city: 'San Francisco',
				address_state: 'CA',
				address_postal_code: '94105',
				address_country: 'US',
			},
			email: 'billing@4theprice.com',
			help_email: 'support@4theprice.com',
			phone: '+1 (555) 438-7742',
		},
		created_at: '2026-01-01T00:00:00Z',
		updated_at: '2026-10-31T00:00:00Z',
	},
	metadata: {
		onboarding_completed: 'true',
	},
};

const useUser = () => {
	const tokenStr = AuthService.peekStoredToken();
	const authEnabled = config.auth?.enabled ?? false;

	const {
		data: user,
		isLoading: loading,
		error,
		refetch,
	} = useQuery<User>({
		queryKey: ['user', tokenStr || 'guest_admin'],
		queryFn: async () => {
			try {
				const res = await UserApi.me();
				return (res as User) || DEFAULT_4THEPRICE_USER;
			} catch {
				return DEFAULT_4THEPRICE_USER;
			}
		},
		enabled: !authEnabled || !!tokenStr,
		retry: 1,
		retryDelay: 1000,
		refetchInterval: 60 * 1000,
	});

	// If auth is disabled (hackathon demo mode), guarantee instant active user
	const effectiveUser = user || DEFAULT_4THEPRICE_USER;

	return {
		user: effectiveUser,
		loading: authEnabled ? loading : false,
		error,
		refetch,
	};
};

export default useUser;
