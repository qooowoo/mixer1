export default async function handler(req, res) {
  const API_KEY = "F250408253"; // 🔐
  const url = `http://www.opinet.co.kr/api/avgAllPrice.do?out=json&code=${API_KEY}`;
  try {
    const response = await fetch(url);
    const data = await response.json();
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ error: "유가 정보를 불러오지 못했습니다." });
  }
}
