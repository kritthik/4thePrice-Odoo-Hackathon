type ModelContextNavigator = Navigator & {
	modelContext?: {
		provideContext: (ctx: { tools: unknown[] }) => void;
	};
};

export function registerWebMCPTools() {
	if (typeof navigator === 'undefined') return;
	const nav = navigator as ModelContextNavigator;
	if (!nav.modelContext?.provideContext) return;

	nav.modelContext.provideContext({
		tools: [
			{
				name: 'get_4theprice_app_info',
				description:
					'Returns metadata about the Flexprice dashboard the user is currently viewing: product name, build version, and canonical documentation and API URLs.',
				inputSchema: { type: 'object', properties: {}, additionalProperties: false },
				execute: async () => ({
					name: '4ThePrice Daily Dashboard',
					version: __APP_VERSION__,
					docs: 'http://localhost:3000',
					api: 'http://localhost:8080',
				}),
			},
		],
	});
}
