import { config, APP_ENV } from '@/config/config';
import supabase from '../services/supbase/config';
import { RouteNames } from '../routes/Routes';

/**
 * Reads the locally stored session, which is what both a self-hosted login and a
 * completed SAML assertion write.
 *
 * Returns null for anything unusable — absent, unparseable, or carrying no token
 * — so a corrupted entry falls through to the identity provider rather than
 * stranding the user with no way to authenticate.
 */
function readStoredSession(): { token?: string; user?: unknown } | null {
	try {
		const stored = localStorage.getItem('token');
		if (!stored) return null;
		const parsed = JSON.parse(stored);
		if (!parsed || typeof parsed.token !== 'string' || parsed.token === '') return null;
		return parsed;
	} catch {
		return null;
	}
}

/**
 * supabase-js derives its localStorage key as `sb-${hostname}-auth-token` from
 * the project URL (see SupabaseClient's constructor) when no explicit
 * `storageKey` is configured, which this app doesn't set.
 */
function supabaseStorageKey(): string | null {
	try {
		if (!config.auth.url) return null;
		return `sb-${new URL(config.auth.url).hostname.split('.')[0]}-auth-token`;
	} catch {
		return null;
	}
}

class AuthService {
	/**
	 * A locally stored token wins wherever one exists, in any environment.
	 *
	 * SAML is configured per tenant, so a hosted deployment backed by Supabase may
	 * still serve tenants that sign in through an identity provider. Choosing the
	 * source from the environment alone meant that on such a deployment a
	 * completed SSO login was ignored: the assertion validated, the backend minted
	 * a token, the callback stored it, and every request afterwards asked Supabase
	 * for a session that was never created — so the dashboard loaded signed out
	 * with no indication of what had gone wrong.
	 *
	 * Preferring the stored token is safe for the Supabase path because only a
	 * completed login writes it: the SAML callback stores it after the backend has
	 * validated the assertion, and logout clears it.
	 */
	public static async getAcessToken(): Promise<string | null> {
		const stored = readStoredSession();
		if (stored?.token) return stored.token;

		// In demo mode or when auth is disabled/self-hosted, bypass Supabase
		if (!config.auth.enabled || config.app.env === APP_ENV.SelfHosted) {
			return null;
		}

		try {
			const res = await supabase.auth.getSession();
			return res?.data?.session?.access_token ?? null;
		} catch {
			return null;
		}
	}

	/**
	 * Synchronous best-effort read of the current session token, for use as a
	 * React Query cache key / `enabled` guard where an async call can't run
	 * inline.
	 */
	public static peekStoredToken(): string | null {
		const stored = readStoredSession();
		if (stored?.token) return stored.token;

		if (!config.auth.enabled || config.app.env === APP_ENV.SelfHosted) return null;

		try {
			const key = supabaseStorageKey();
			if (!key) return null;
			const raw = localStorage.getItem(key);
			if (!raw) return null;
			const parsed = JSON.parse(raw);
			return typeof parsed?.access_token === 'string' ? parsed.access_token : null;
		} catch {
			return null;
		}
	}

	public static async getUser() {
		const stored = readStoredSession();
		if (stored?.user) return stored.user;

		if (!config.auth.enabled || config.app.env === APP_ENV.SelfHosted) {
			return null;
		}

		try {
			const res = await supabase.auth.getUser();
			return res?.data?.user ?? null;
		} catch {
			return null;
		}
	}

	/**
	 * Keys that survive logout.
	 */
	private static readonly PRESERVED_KEYS = ['flexprice_theme'];

	public static async logout() {
		if (config.auth.enabled && config.app.env !== APP_ENV.SelfHosted) {
			try {
				await supabase.auth.signOut();
			} catch {
				// ignore
			}
		}

		const preserved = AuthService.PRESERVED_KEYS.map((key) => [key, localStorage.getItem(key)] as const);
		localStorage.clear();
		for (const [key, value] of preserved) {
			if (value !== null) localStorage.setItem(key, value);
		}

		window.location.href = RouteNames.login;
	}
}

export default AuthService;
