export const config = {
  runtime: "nodejs",
};

export default async function handler(req, res) {
  const url = req.query.url;

  if (!url) {
    return res.status(400).json({ error: "URL kosong" });
  }

  try {
    const response = await fetch(
      "https://api-faa.my.id/faa/aio?url=" + encodeURIComponent(url),
      {
        method: "GET",
        headers: {
          "User-Agent":
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/120 Safari/537.36",
          "Accept": "*/*",
        },
      }
    );

    const text = await response.text();

    // 🔑 PAKSA PARSE JSON AMAN
    let data;
    try {
      data = JSON.parse(text);
    } catch (e) {
      return res.status(500).json({
        error: "Response bukan JSON",
        raw: text.substring(0, 200),
      });
    }

    res.setHeader("Access-Control-Allow-Origin", "*");
    return res.status(200).json(data);

  } catch (err) {
    return res.status(500).json({
      error: "Fetch gagal",
      detail: err.message,
    });
  }
}
