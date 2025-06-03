gopeed.events.onResolve(async function(ctx) {
  try {
    const useEmbed = gopeed.settings.useEmbed;
    const url = ctx.req.url;
    
    let directUrl;
    if (useEmbed) {
      const embedUrl = `${url}${url.includes('?') ? '&' : '?'}embed=1`;
      const response = await fetch(embedUrl);
      const html = await response.text();
      
      // Try to find video or image URL
      const videoMatch = html.match(/<meta property="og:video:url" content="(.*?)"/);
      const imageMatch = html.match(/<meta property="og:image" content="(.*?)"/);
      
      directUrl = videoMatch?.[1] || imageMatch?.[1];
    } else {
      // Fallback to direct CDN URL pattern
      if (url.includes('/video/')) {
        directUrl = url.replace('t.me/', 'cdn4.telegram-cdn.org/file/') + '.mp4';
      } else if (url.includes('/photo/')) {
        directUrl = url.replace('t.me/', 'cdn4.telegram-cdn.org/img/') + '.jpg';
      } else if (url.includes('/file/')) {
        directUrl = url.replace('t.me/', 'cdn4.telegram-cdn.org/document/');
      }
    }

    if (!directUrl) {
      throw new Error("Impossible de trouver le lien direct");
    }

    ctx.res = {
      name: directUrl.split('/').pop() || `telegram_${Date.now()}`,
      files: [{
        name: directUrl.split('/').pop() || `telegram_${Date.now()}`,
        req: {
          url: directUrl,
          headers: {
            'Referer': 'https://t.me/',
            'User-Agent': 'Mozilla/5.0'
          }
        }
      }]
    };
    
  } catch (error) {
    gopeed.logger.error(`[Telegram] Error: ${error.message}`);
    throw error;
  }
});
