export default async function handler(req, res) {
  const { year } = req.query;
  const API_KEY = process.env.PUBLIC_DATA_API_KEY;

  if (!API_KEY) {
    console.error('❗ API 키가 없습니다!');
    return res.status(500).json({ error: 'API 키 없음' });
  }

  const url = `http://apis.data.go.kr/B553530/energy/allCarInfo?serviceKey=${API_KEY}&returnType=JSON&pageNo=1&numOfRows=1000`;

  try {
    const response = await fetch(url);
    const data = await response.json(); // 이제 JSON으로 잘 파싱됨!

    console.log('✅ 응답 구조:', JSON.stringify(data, null, 2));

    const all = data?.response?.body?.items || [];

    const filtered = year
      ? all.filter(car => String(car["출시연도"] || car["연도"]) === String(year))
      : all;

    res.status(200).json(filtered);
  } catch (e) {
    console.error('❌ API 요청 중 에러 발생:', e.message);
    res.status(500).json({ error: 'API 에러' });
  }
}
