
// index.js - Gopeed Extension by @KingSurf7
gopeed.events.onResolve(async (ctx) => {
  const tgUrl = ctx.req.url;

  if (!tgUrl.includes("t.me/")) return;

  try {
    const response = await fetch("https://mid-stormi-kingsurf7-3acfd5bd.koyeb.app/resolve-telegram", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ url: tgUrl })
    });

    const data = await response.json();

    if (data.file_url) {
      ctx.res = {
        name: decodeURIComponent(data.name || data.file_url.split("/").pop()),
        files: [{ req: { url: data.file_url } }],
        turbo: true
      };
      return;
    }
  } catch (err) {
    console.error("Erreur de résolution Telegram :", err);
  }

  ctx.res = {
    smart_download: true,
    original_url: ctx.req.url,
    fallback: "Voir les instructions dans gopeed.settings.telegram_help"
  };
});
