import { AxiosClient } from '@/core/axios/verbs';
import { WebhookDashboardResponse } from '@/types/dto/webhook';

class WebhookApi {
	static async getWebhookDashboardUrl() {
		const baseUrl = '/webhooks';
		return AxiosClient.get<WebhookDashboardResponse>(`${baseUrl}/dashboard`);
	}
}

export default WebhookApi;
