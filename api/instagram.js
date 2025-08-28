export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ ok: false, error: 'Method Not Allowed' });
  }

  const accessToken = process.env.INSTAGRAM_ACCESS_TOKEN;
  const limit = Number(req.query.limit || 9);

  if (!accessToken) {
    return res.status(200).json({ ok: true, items: [], note: 'INSTAGRAM_ACCESS_TOKEN no configurado' });
  }

  try {
    const url = `https://graph.instagram.com/me/media?fields=id,caption,media_url,permalink,thumbnail_url,media_type,timestamp&access_token=${encodeURIComponent(accessToken)}&limit=${limit}`;
    const igRes = await fetch(url);
    if (!igRes.ok) {
      const text = await igRes.text();
      return res.status(200).json({ ok: true, items: [], note: `Instagram API error: ${text}` });
    }
    const data = await igRes.json();
    const items = (data.data || [])
      .filter((m) => m.media_type === 'IMAGE' || m.media_type === 'CAROUSEL_ALBUM' || m.media_type === 'VIDEO')
      .map((m) => ({
        id: m.id,
        caption: m.caption || '',
        mediaUrl: m.media_url || m.thumbnail_url,
        permalink: m.permalink,
        mediaType: m.media_type,
        timestamp: m.timestamp
      }));

    return res.status(200).json({ ok: true, items });
  } catch (error) {
    console.error('Instagram fetch error', error);
    return res.status(200).json({ ok: true, items: [], note: 'Error leyendo Instagram' });
  }
}


