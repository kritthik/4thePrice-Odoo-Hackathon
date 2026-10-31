// src/store/useLocaleStore.ts
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Locale, Direction, deriveDirection } from '@/config/branding';
import i18n from 'i18next';

interface LocaleState {
	locale: Locale;
	direction: Direction;
	allowedLocales: Locale[];
	setLocale: (locale: Locale) => void;
}

export const useLocaleStore = create<LocaleState>()(
	persist(
		(set) => ({
			locale: Locale.En,
			direction: Direction.LTR,
			allowedLocales: [Locale.En],
			setLocale: (locale: Locale) => {
				const direction = deriveDirection(locale);
				document.documentElement.lang = locale;
				document.documentElement.dir = direction;
				i18n.changeLanguage(locale);
				set({ locale, direction });
			},
		}),
		{
			name: 'flexprice_locale',
			partialize: (state) => ({ locale: state.locale }),
			onRehydrateStorage: () => (state) => {
				if (!state) return;
				state.locale = Locale.En;
				state.direction = Direction.LTR;
			},
		},
	),
);
