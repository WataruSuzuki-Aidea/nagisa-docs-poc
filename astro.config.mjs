// @ts-check
import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';

const isPublic = process.env.SITE_VARIANT === 'public';

export default defineConfig({
	// GitHub Pages（https://watarusuzuki-aidea.github.io/nagisa-docs-poc/）で公開する。
	site: 'https://watarusuzuki-aidea.github.io',
	base: '/nagisa-docs-poc',
	outDir: isPublic ? './dist-public' : './dist-private',
	integrations: [
		starlight({
			title: isPublic ? 'NAGI(SA) デザインシステム' : 'NAGI(SA) デザインシステム（社内）',
			// ヘッダーには NAGI(SA) のロゴを表示する。サイト名は、ブラウザのタブの表示に使う。
			logo: { src: './src/assets/nagisa-logo.svg', alt: 'NAGI(SA)', replacesTitle: true },
			defaultLocale: 'root',
			locales: { root: { label: '日本語', lang: 'ja' } },
			sidebar: [
				{ label: 'NAGI(SA)デザインシステム', link: '/' },
				{
					label: '基本要素',
					items: [{ label: 'デザイントークン', items: [{ autogenerate: { directory: 'foundations/design-tokens' } }] }],
				},
				// パターンのページは、試作の間はすべて非公開。公開用のサイトでは、空のグループを出さない。
				...(isPublic ? [] : [{ label: 'パターン', items: [{ autogenerate: { directory: 'patterns' } }] }]),
				{
					label: 'コンポーネント',
					items: [{ label: 'Accordion [アコーディオン]', link: '/components/accordion/overview/' }],
				},
				// 公開用のサイトでは、ページがすべて非公開のグループを出さない。
				...(isPublic
					? []
					: [
							{
								label: 'ウィジェット',
								items: [{ label: 'Sidebar [サイドバー]', link: '/widgets/sidebar/overview/' }],
							},
						]),
			],
			// 各ページに「このページを編集」のリンクを表示し、GitHub の編集画面を開く。
			editLink: { baseUrl: 'https://github.com/WataruSuzuki-Aidea/nagisa-docs-poc/edit/main/' },
			customCss: ['./src/styles/custom.css'],
			components: { PageTitle: './src/components/PageTitle.astro' },
		}),
	],
});
