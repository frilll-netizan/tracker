export default async function handler(req, res) {
  const url = req.query.url;

  if (!url) {
    return res.status(400).json({ error: "URL kosong" });
  }

  try {
    const response = await fetch(
      "https://api-faa.my.id/faa/aio?url=" + encodeURIComponent(url),
      {
        headers: {
          "User-Agent": "Mozilla/5.0"
        }
      }
    );

    const data = await response.json();

    res.setHeader("Access-Control-Allow-Origin", "*");
    res.status(200).json(data);

  } catch (e) {
    res.status(500).json({ error: "Gagal mengambil data" });
  }
}
