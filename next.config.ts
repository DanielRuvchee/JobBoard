import { NextConfig } from 'next';

const config: NextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  images: {
    domains: ['uploadthing.com', 'utfs.io'],
    
  },
};

export default config; 