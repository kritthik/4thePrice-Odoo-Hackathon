import { AxiosClient } from '@/core/axios/verbs';
import { ACTIVE_ENVIRONMENT_ID_KEY } from '@/hooks/useEnvironment';
import { Environment } from '@/models';
import {
	CloneEnvironmentPayload,
	CloneEnvironmentResponse,
	CreateEnvironmentPayload,
	ListEnvironmentResponse,
	UpdateEnvironmentPayload,
} from '@/types/dto';

export const DEFAULT_DEMO_ENV_ID = '00000000-0000-0000-0000-000000000000';

let resolveEnvReady: (() => void) | null = null;
let envReadyPromise: Promise<void> | null = null;
function getEnvReadyPromise(): Promise<void> {
	if (!envReadyPromise) {
		envReadyPromise = localStorage.getItem(ACTIVE_ENVIRONMENT_ID_KEY)
			? Promise.resolve()
			: new Promise((resolve) => {
					resolveEnvReady = resolve;
				});
	}
	return envReadyPromise;
}

class EnvironmentApi {
	private static baseUrl = '/environments';

	// API Methods
	public static async getAllEnvironments(): Promise<ListEnvironmentResponse> {
		try {
			const res = await AxiosClient.get<any>(this.baseUrl);
			if (Array.isArray(res)) {
				return { environments: res, total: res.length, limit: res.length, offset: 0 };
			}
			if (res && Array.isArray(res.environments)) {
				return res as ListEnvironmentResponse;
			}
			return { environments: [], total: 0 } as ListEnvironmentResponse;
		} catch (error) {
			return { environments: [], total: 0 } as ListEnvironmentResponse;
		}
	}

	public static async getEnvironmentById(id: string): Promise<Environment | null> {
		try {
			return await AxiosClient.get<Environment>(`${this.baseUrl}/${id}`);
		} catch (error) {
			return null;
		}
	}

	public static async createEnvironment(payload: CreateEnvironmentPayload): Promise<Environment | null> {
		return await AxiosClient.post<Environment>(this.baseUrl, payload);
	}

	public static async cloneEnvironment(sourceEnvironmentId: string, payload: CloneEnvironmentPayload): Promise<CloneEnvironmentResponse> {
		return await AxiosClient.post<CloneEnvironmentResponse>(`${this.baseUrl}/${sourceEnvironmentId}/clone`, payload);
	}

	public static async updateEnvironment(id: string, payload: UpdateEnvironmentPayload): Promise<Environment | null> {
		return await AxiosClient.put<Environment>(`${this.baseUrl}/${id}`, payload);
	}

	public static getActiveEnvironmentId(): string | null {
		const stored = localStorage.getItem(ACTIVE_ENVIRONMENT_ID_KEY);
		if (stored) return stored;

		// If auth is disabled (demo mode), auto-initialize default demo environment
		if (import.meta.env.VITE_AUTH_ENABLED !== 'true') {
			try {
				localStorage.setItem(ACTIVE_ENVIRONMENT_ID_KEY, DEFAULT_DEMO_ENV_ID);
			} catch {
				// ignore localStorage errors in strict modes
			}
			return DEFAULT_DEMO_ENV_ID;
		}
		return null;
	}

	public static setActiveEnvironmentId(environmentId: string): void {
		localStorage.setItem(ACTIVE_ENVIRONMENT_ID_KEY, environmentId);
		resolveEnvReady?.();
		resolveEnvReady = null;
	}

	/** Resolves once an active environment ID is known, or after `timeoutMs` — whichever
	 *  comes first, so a tenant with zero environments (or a slow/failed fetch) doesn't
	 *  block every request indefinitely. */
	public static waitForActiveEnvironment(timeoutMs = 5000): Promise<void> {
		if (EnvironmentApi.getActiveEnvironmentId()) {
			return Promise.resolve();
		}
		return Promise.race([getEnvReadyPromise(), new Promise<void>((resolve) => setTimeout(resolve, timeoutMs))]);
	}
}

export default EnvironmentApi;
