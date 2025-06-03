gopeed.events.onResolve(async function(ctx) {
  const url = ctx.req.url;
  gopeed.logger.info(`Traitement du lien Telegram: ${url}`);

  try {
    // 1. Détection du type de contenu
    const content = await detectContent(url);
    
    // 2. Configuration qualité vidéo
    if (content.type === 'video') {
      content.directUrl = applyQuality(content.directUrl, gopeed.settings.quality);
    }

    // 3. Préparation réponse
    ctx.res = {
      name: content.filename,
      files: [{
        name: content.filename,
        req: {
          url: content.directUrl,
          headers: createHeaders()
        },
        size: content.size || 0
      }]
    };

  } catch (error) {
    gopeed.logger.error(`Échec du traitement: ${error.message}`);
    throw error;
  }
});

async function detectContent(url) {
  // Méthode universelle avec iframe embed
  const embedUrl = `${url}${url.includes('?') ? '&' : '?'}embed=1`;
  const html = await fetch(embedUrl).then(res => res.text());

  // 1. Vidéo (priorité)
  const videoUrl = extractVideo(html);
  if (videoUrl) return {
    type: 'video',
    directUrl: videoUrl,
    filename: generateFilename(html, 'video.mp4')
  };

  // 2. Image
  const imageUrl = extractImage(html);
  if (imageUrl) return {
    type: 'image',
    directUrl: imageUrl,
    filename: generateFilename(html, 'image.jpg')
  };

  // 3. Document
  const docUrl = extractDocument(html);
  if (docUrl) return {
    type: 'document',
    directUrl: docUrl,
    filename: docUrl.split('/').pop() || 'document'
  };

  throw new Error("Type de contenu non supporté");
}

// Fonctions d'extraction
function extractVideo(html) {
  const metaMatch = html.match(/<meta property="og:video:url" content="(.*?)"/);
  return metaMatch ? metaMatch[1] : null;
}

function extractImage(html) {
  const metaMatch = html.match(/<meta property="og:image" content="(.*?)"/);
  return metaMatch ? metaMatch[1] : null;
}

function extractDocument(html) {
  const downloadMatch = html.match(/<a href="(.*?)" download/);
  return downloadMatch ? downloadMatch[1] : null;
}

// Helpers
function generateFilename(html, fallback) {
  const titleMatch = html.match(/<meta property="og:title" content="(.*?)"/);
  if (!titleMatch) return fallback;
  
  return titleMatch[1]
    .replace(/[^\w\-.]/g, '_')
    .substring(0, 50) + '.' + fallback.split('.').pop();
}

function applyQuality(url, quality) {
  return quality === 'hd' ? url : url.replace('/video/', '/video_sd/');
}

function createHeaders() {
  return {
    'Referer': 'https://t.me/',
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
    'Accept': '*/*'
  };
}
