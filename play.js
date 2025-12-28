export default async function handler(req, res) {
  const { q } = req.query;
  if (!q) return res.status(400).send("No query");

  try {
    const api = await fetch(
      "https://api-faa.my.id/faa/ytplay?query=" + encodeURIComponent(q)
    );
    const data = await api.json();

    const audioUrl = data.result.audio.url;

    const audioRes = await fetch(audioUrl);

    res.setHeader("Content-Type", "audio/mpeg");
    res.setHeader("Access-Control-Allow-Origin", "*");

    audioRes.body.pipe(res);
  } catch (e) {
    res.status(500).send("Error audio proxy");
  }
}
