const fetch = require('node-fetch');

const CRAWLER_USER_AGENTS = [
  'facebookexternalhit', 'Twitterbot', 'WhatsApp', 'LinkedInBot', 'TelegramBot', 'Slackbot', 'Pinterest', 'Googlebot', 'bingbot'
];

export default async function handler(req, res) {
  const userAgent = req.headers['user-agent'] || '';
  const isCrawler = CRAWLER_USER_AGENTS.some(bot => userAgent.includes(bot));
  const protocol = req.headers['x-forwarded-proto'] || 'http';
  const host = req.headers.host;
  const baseUrl = `${protocol}://${host}`;

  // 1. Get the base HTML
  const baseHtml = await fetch(`${baseUrl}/index.html`).then(r => r.text());

  if (isCrawler) {
    try {
      // 2. Extract Product ID from the URL (e.g., /products/6ab03095a643d05339473ff6)
      const urlParts = req.url.split('/');
      const productId = urlParts[urlParts.length - 1];

      // 🚨 IMPORTANT: REPLACE THIS URL WITH YOUR ACTUAL BACKEND/FIREBASE API ENDPOINT 🚨
      // You need an API route that returns JSON like: { name: "...", description: "...", imageUrl: "..." }
      const productData = await fetch(`https://brianceotnt.dev.li/api/products/${productId}`)
        .then(r => r.json())
        .catch(() => ({ name: 'Product', description: 'Check out this product!', imageUrl: '/logo.png' }));

      // 3. Inject dynamic meta tags
      const html = baseHtml
        .replace(/__OG_TITLE__/g, productData.name || 'BRIAN — CEO TNT')
        .replace(/__OG_DESCRIPTION__/g, productData.description || 'A transparent business opportunity.')
        .replace(/__OG_IMAGE__/g, productData.imageUrl || `${baseUrl}/logo.png`)
        .replace(/__OG_URL__/g, `${baseUrl}${req.url}`);

      res.setHeader('Content-Type', 'text/html');
      return res.status(200).send(html);
    } catch (error) {
      console.error('OG Crawler Error:', error);
      // Fallback to default
      const html = baseHtml
        .replace(/__OG_TITLE__/g, 'BRIAN — CEO TNT')
        .replace(/__OG_DESCRIPTION__/g, 'A transparent business opportunity.')
        .replace(/__OG_IMAGE__/g, `${baseUrl}/logo.png`)
        .replace(/__OG_URL__/g, `${baseUrl}${req.url}`);
      return res.status(200).send(html);
    }
  }

  // 4. For normal users, serve the React app
  res.setHeader('Content-Type', 'text/html');
  return res.status(200).send(baseHtml);
}
