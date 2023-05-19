const withPWA = require('next-pwa')({
	dest: 'public'
})
/** @type {import('next').NextConfig} */
const config = {
	reactStrictMode: true,
	swcMinify: true,
	pwa: {
		dest: "public",
		register: true,
		skipWaiting: true,
		dynamicStartUrlRedirect: true,
	},
	webpack: (config, { isServer }) => {
		// Fixes npm packages that depend on `fs` module
		if (!isServer) {
			config.resolve.fallback = {
				fs: false
			}
		}
		return config
	},
	output: 'standalone',
}
const nextConfig = process.env.NODE_ENV === 'development' ? config : withPWA(config)

module.exports = nextConfig
