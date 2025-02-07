import NextBundleAnalyzer from '@next/bundle-analyzer';

/** @type {import('next').NextConfig} */
const nextConfig = {
    webpack: (config) => {
        config.externals = [...config.externals, "bcrypt"];
        return config;
    },
};

const withBundleAnalyzer = NextBundleAnalyzer({
    enabled: process.env.ANALYZE === 'true',
});

export default withBundleAnalyzer(nextConfig);
