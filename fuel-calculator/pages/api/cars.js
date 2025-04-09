export default async function handler(req, res) {
  const { year } = req.query;
  const API_KEY = process.env.PUBLIC_DATA_API_KEY;

  if (!API_KEY) {
    console.error('❗ API 키가 없습니다!');
    return res.status(500).json({ error: 'API 키 없음' });
  }

  const baseUrl = 'https://api.odcloud.kr/api/15083023/v1/uddi:399f86ce-69dd-4de3-98d4-af4a9c3fa1d8';
  const url = `${baseUrl}?page=1&perPage=1000&serviceKey=${API_KEY}`;

  try {
    const response = await fetch(url, {
      headers: { Accept: 'application/json' }
    });
    const data = await response.json();

    const all = data?.data || [];

    const filtered = year
      ? all.filter(car => String(car["출시연도"] || car["연도"]) === String(year))
      : all;

    res.status(200).json(filtered);
  } catch (e) {
    console.error('❌ API 호출 실패:', e.message);
    res.status(500).json({ error: '서버 오류 발생' });
  }
}
