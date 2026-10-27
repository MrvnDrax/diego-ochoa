import { site } from '@data/site';
export const prerender = true;
export function GET() {
  const preview = site.url.endsWith('.example');
  const body = ['User-agent: *', preview ? 'Disallow: /' : 'Allow: /', '', ...(preview ? [] : [`Sitemap: ${site.url}/sitemap-index.xml`]), ''].join('\n');
  return new Response(body, { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
}
