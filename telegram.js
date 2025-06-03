export async function resolveTelegramUrl(url, options = {}) {
  // 1. Détection du type de contenu
  const type = detectContentType(url);
  
  // 2. Récupération du lien direct
  let directUrl;
  if (options.useEmbed) {
    const embedHtml = await fetch(`${url}?embed=1`).then(res => res.text());
    directUrl = extractFromEmbed(embedHtml);
  } else {
    directUrl = buildCdnUrl(url, type);
  }

  if (!directUrl) throw new Error("Lien direct introuvable");

  // 3. Génération du filename
  return {
    directUrl,
    filename: generateFilename(directUrl, type),
    size: await getFileSize(directUrl)
  };
}

// Helpers
function detectContentType(url) {
  if (url.includes('/video/')) return 'video';
  if (url.includes('/photo/')) return 'image';
  if (url.includes('/file/')) return 'document';
  return 'post'; // Pour les URLs simples
}
