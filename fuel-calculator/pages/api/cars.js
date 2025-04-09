export default async function handler(req, res) {
  const { year } = req.query;
  const API_KEY = process.env.PUBLIC_DATA_API_KEY;

  if (!API_KEY) {
    console.error('❗ API KEY가 없습니다. 환경변수 확인 필요!');
    return res.status(500).json({ error: 'API 키가 설정되지 않았습니다.' });
  }

  const url = `http://apis.data.go.kr/B553530/energy/allCarInfo?serviceKey=${API_KEY}&returnType=JSON&pageNo=1&numOfRows=1000`;

  try {
    const response = await fetch(url);
    const data = await response.json();

    console.log('📡 API 응답:', JSON.stringify(data, null, 2));

    const all = data?.response?.body?.items || data.items || [];

    const filtered = year
      ? all.filter(car => String(car["출시연도"] || car["연도"]) === String(year))
      : all;

    res.status(200).json(filtered);
  } catch (e) {
    console.error('❌ API 요청 중 에러 발생:', e.message);
    res.status(500).json({ error: '서버 오류 발생' });
  }
}
