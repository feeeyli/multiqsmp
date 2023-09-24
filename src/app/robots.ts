import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: ['/', '/api/og/*'],
    },
    sitemap: 'https://acme.com/sitemap.xml',
  };
}
