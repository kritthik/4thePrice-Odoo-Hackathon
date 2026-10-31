import { useCallback, useMemo } from 'react';
import useUser from '@/hooks/useUser';
import { useRbacRoles } from '@/hooks/useRbacRoles';
import { RbacRole, SUPER_ADMIN_ROLE_ID } from '@/api/RbacApi';
import { config } from '@/config/config';

export type RbacAction = 'read' | 'write';

// Mirrors internal/types/rbac.go's Entity constants exactly — keep in sync with the backend.
export type RbacEntity =
	| 'user'
	| 'environment'
	| 'event'
	| 'meter'
	| 'price'
	| 'customer'
	| 'plan'
	| 'addon'
	| 'group'
	| 'alert_settings'
	| 'subscription'
	| 'wallet'
	| 'tenant'
	| 'invoice'
	| 'feature'
	| 'entitlement'
	| 'creditgrant'
	| 'payment'
	| 'integration'
	| 'task'
	| 'tax'
	| 'secret'
	| 'connection'
	| 'costsheet'
	| 'creditnote'
	| 'coupon'
	| 'ai'
	| 'portal'
	| 'webhook'
	| 'cron'
	| 'setting'
	| 'oauth'
	| 'checkoutsession'
	| 'workflow'
	| 'fxrate';

interface CurrentUserPermissions {
	roles: string[];
	isSuperAdmin: boolean;
	can: (entity: RbacEntity, action: RbacAction) => boolean;
	isLoading: boolean;
	isError: boolean;
}

/**
 * Derives "can the current session do (entity, action)?" from the roles
 * useRbacRoles(). Both are server-fetched data (AGENTS.md forbids putting
 * server-fetched data in Zustand), so this stays a plain TanStack-Query-backed
 * hook rather than a store.
 *
 * can() mirrors internal/rbac/rbac.go RBACService.HasPermission: wildcard
 * entity ("*") is checked before the specific entity, each with wildcard or
 * exact action.
 */
export function useCurrentUserPermissions(): CurrentUserPermissions {
	const { user, loading: userLoading } = useUser();
	const roles = useMemo(() => user?.roles ?? [], [user?.roles]);
	const userType = (user?.type ?? 'user') as 'user' | 'service_account';

	const { data: roleDefs, isLoading: rolesLoading, isError } = useRbacRoles(userType, { enabled: !!user });

	const roleDefsById = useMemo(() => {
		const map: Record<string, RbacRole> = {};
		(roleDefs ?? []).forEach((role) => {
			map[role.id] = role;
		});
		return map;
	}, [roleDefs]);

	const can = useCallback(
		(entity: RbacEntity, action: RbacAction) => {
			if (!config.auth?.enabled || roles.includes(SUPER_ADMIN_ROLE_ID) || roles.includes('admin')) {
				return true;
			}
			return roles.some((roleId) => {
				const perms = roleDefsById[roleId]?.permissions;
				if (!perms) return false;
				if (perms['*']?.includes('*') || perms['*']?.includes(action)) return true;
				if (perms[entity]?.includes('*') || perms[entity]?.includes(action)) return true;
				return false;
			});
		},
		[roles, roleDefsById],
	);

	const rolesNotYetFetched = !!user && roleDefs === undefined && !isError;

	return {
		roles,
		isSuperAdmin: roles.includes(SUPER_ADMIN_ROLE_ID),
		can,
		isLoading: config.auth?.enabled ? userLoading || rolesLoading || rolesNotYetFetched : false,
		isError,
	};
}

export default useCurrentUserPermissions;
