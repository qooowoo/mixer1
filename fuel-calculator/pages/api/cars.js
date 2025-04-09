export default async function handler(req, res) {
  const { year } = req.query;
  const API_KEY = process.env.PUBLIC_DATA_API_KEY;
  const url = `http://apis.data.go.kr/B553530/energy/allCarInfo?serviceKey=${API_KEY}&returnType=JSON&pageNo=1&numOfRows=1000`;

  try {
    const response = await fetch(url);
    const data = await response.json();

    console.log('📡 공공데이터 응답:', JSON.stringify(data, null, 2)); // 핵심

    const all = data?.response?.body?.items || data.items || [];

    const filtered = year
      ? all.filter(car => String(car["출시연도"] || car["연도"]) === String(year))
      : all;

    res.status(200).json(filtered);
  } catch (e) {
    console.error('❌ API 호출 실패:', e);
    res.status(500).json({ error: "데이터를 불러오지 못했습니다." });
  }
}
