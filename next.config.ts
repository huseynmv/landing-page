import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "romantic-victory-de00aedaff.media.strapiapp.com",
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;

// import type { NextConfig } from "next";

// const nextConfig: NextConfig = {
//   images: {
//     remotePatterns: [
//       {
//         protocol: "https",
//         hostname: "romantic-victory-de00aedaff.media.strapiapp.com",
//         pathname: "/**",
//       },
//     ],
//   },
//   webpack(config) {
//     // Import .svg files from anywhere (e.g. src/assets) as React components
//     config.module.rules.push({
//       test: /\.svg$/i,
//       issuer: /\.[jt]sx?$/,
//       use: [{ loader: "@svgr/webpack", options: { icon: true } }],
//     });
//     return config;
//   },
// };

// export default nextConfig;
