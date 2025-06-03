import { resolveTelegramUrl } from './telegram';

gopeed.events.onResolve(async (ctx) => {
  try {
    const { useEmbed } = gopeed.settings;
    const result = await resolveTelegramUrl(ctx.req.url, { useEmbed });
    
    ctx.res = {
      name: result.filename,
      files: [{
        name: result.filename,
        req: {
          url: result.directUrl,
          headers: {
            'Referer': 'https://t.me/',
            'User-Agent': 'Mozilla/5.0'
          }
        },
        size: result.size || 0
      }]
    };
  } catch (error) {
    gopeed.logger.error(`[Telegram] Error: ${error.message}`);
    throw error;
  }
});
