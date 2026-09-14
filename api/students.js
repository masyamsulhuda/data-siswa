// api/students.js
// Proxy server-side ke Google Apps Script.
// URL Apps Script disimpan sebagai Environment Variable (GAS_URL) di dashboard
// Vercel, jadi TIDAK pernah dikirim ke browser pengguna.

export default async function handler(req, res) {
  const GAS_URL = process.env.GAS_URL;

  if (!GAS_URL) {
    res.status(500).json({
      success: false,
      message: 'GAS_URL belum diatur di Environment Variables Vercel.',
    });
    return;
  }

  try {
    if (req.method === 'GET') {
      const upstream = await fetch(GAS_URL, { method: 'GET' });
      const text = await upstream.text();
      res.status(upstream.status);
      res.setHeader('Content-Type', 'application/json');
      res.send(text);
      return;
    }

    if (req.method === 'POST') {
      // Apps Script mengharapkan body text/plain berisi JSON (lihat kode asli).
      const body =
        typeof req.body === 'string' ? req.body : JSON.stringify(req.body);

      const upstream = await fetch(GAS_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'text/plain;charset=utf-8' },
        body,
      });
      const text = await upstream.text();
      res.status(upstream.status);
      res.setHeader('Content-Type', 'application/json');
      res.send(text);
      return;
    }

    res.status(405).json({ success: false, message: 'Method tidak diizinkan.' });
  } catch (err) {
    res.status(502).json({
      success: false,
      message: 'Gagal menghubungi Apps Script: ' + err.message,
    });
  }
}
