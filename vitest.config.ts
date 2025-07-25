import { defineConfig } from 'vitest/config';

export default defineConfig({
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
		},
	},
});