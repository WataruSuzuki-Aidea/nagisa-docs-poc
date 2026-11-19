import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';
import { docsSchema } from '@astrojs/starlight/schema';
import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join, relative } from 'node:path';

const DOCS_DIR = 'src/content/docs';

// SITE_VARIANT=public のときは、frontmatter に visibility: private と書いたページを読み込まない。
// SITE_VARIANT=private（既定）のときは、すべてのページを読み込む。
const variant = process.env.SITE_VARIANT === 'public' ? 'public' : 'private';

function listDocs(dir: string): string[] {
	return readdirSync(dir).flatMap((name) => {
		const path = join(dir, name);
		if (statSync(path).isDirectory()) return listDocs(path);
		return /\.mdx?$/.test(name) ? [path] : [];
	});
}

function isPrivate(path: string): boolean {
	const frontmatter = readFileSync(path, 'utf8').match(/^---\n([\s\S]*?)\n---/);
	return /^visibility:\s*private\s*$/m.test(frontmatter?.[1] ?? '');
}

const excluded =
	variant === 'public'
		? listDocs(DOCS_DIR)
				.filter(isPrivate)
				.map((path) => `!${relative(DOCS_DIR, path)}`)
		: [];

export const collections = {
	docs: defineCollection({
		loader: glob({ pattern: ['**/*.{md,mdx}', ...excluded], base: DOCS_DIR }),
		schema: docsSchema({
			extend: z.object({
				// 公開範囲。書き忘れたページはビルドでエラーにする。
				visibility: z.enum(['public', 'private']),
				// タブの名前（概要・ガイドラインなど）。同じフォルダの tab 付きのページをタブで切り替える。
				tab: z.string().optional(),
				// 対応するデザイン QA チェックリストの No.（例：D-2）。
				qa: z.array(z.string()).optional(),
				// 関連する部品の名前（例：NgiAlertDialog）。
				components: z.array(z.string()).optional(),
				// 書き出す Claude Design の Design System。aisea はすべて、base は関連するページだけ。
				ai: z.array(z.enum(['aisea', 'base'])).optional(),
			}),
		}),
	}),
};
