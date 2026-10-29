import { defineConfig } from 'vitest/config';
import { resolve } from 'node:path';
import { woffDataPlugin } from './tests/woff-data-plugin';

export default defineConfig({
	plugins: [woffDataPlugin()],
	test: {
		environment: 'jsdom',
		globals: true,
		css: true,
		coverage: {
			provider: 'v8',
			reporter: ['text', 'json', 'html'],
			exclude: [
				'node_modules/',
				'src/test-utils/**',
				'**/*.d.ts',
				'**/*.config.ts',
				'**/types/**',
			],
		},
	},
	resolve: {
		alias: {
			'@': '/src',
			'satori/yoga.wasm': resolve(process.cwd(), 'src/test-utils/yoga-wasm.ts'),
		},
	},
});
