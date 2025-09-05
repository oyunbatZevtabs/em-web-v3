module.exports = {
  experimental: {
    outputStandalone: true,
  },
  async rewrites() {
    return {
      fallback: [
        {
          source: "/api/:path*",
          destination: `${process.env.NEXT_PUBLIC_API_URL}/:path*`,
        },
        {
          source: "/api/:path*",
          destination: `${process.env.NEXT_PUBLIC_POS_API_URL}/:path*`,
        },
      ],
    };
  },
};
