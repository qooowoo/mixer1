import { useState, useEffect } from 'react';

export async function getServerSideProps() {
  const API_KEY = process.env.OPINET_API_KEY;
  const url = `http://www.opinet.co.kr/api/avgAllPrice.do?out=json&code=${API_KEY}`;

  let prices = { gasoline: 0, diesel: 0, premium: 0, lpg: 0 };

  try {
    const res = await fetch(url);
    const data = await res.json();
    const oil = data.RESULT?.OIL || [];

    oil.forEach(o => {
      switch (o.PRODCD) {
        case 'B027': prices.gasoline = parseFloat(o.PRICE); break;
        case 'D047': prices.diesel = parseFloat(o.PRICE); break;
        case 'B034': prices.premium = parseFloat(o.PRICE); break;
        case 'K015': prices.lpg = parseFloat(o.PRICE); break;
      }
    });
  } catch (e) {
    console.error("유가 API 호출 오류:", e);
  }

  return { props: { prices } };
}

export default function Home({ prices }) {
  const [year, setYear] = useState('');
  const [data, setData] = useState([]);
  const [manufacturer, setManufacturer] = useState('');
  const [modelKeyword, setModelKeyword] = useState('');
  const [fuel, setFuel] = useState('');
  const [drive, setDrive] = useState('');
  const [average, setAverage] = useState(null);
  const [distance, setDistance] = useState('');
  const [fuelType, setFuelType] = useState('gasoline');
  const [result, setResult] = useState('');

  useEffect(() => {
    if (!year) return;
    fetch(`/api/cars?year=${year}`)
      .then(res => res.json())
      .then(json => setData(json));
  }, [year]);

  const handleAverage = () => {
    const matches = data.filter(car =>
      (!manufacturer || car.업체명?.includes(manufacturer)) &&
      (!modelKeyword || car.모델명?.includes(modelKeyword)) &&
      (!fuel || car.연료?.includes(fuel)) &&
      (!drive || car.모델명?.includes(drive))
    );

    const avg = matches.length > 0
      ? (matches.reduce((sum, car) => sum + parseFloat(car.도심주행 || car.도심연비 || 0), 0) / matches.length).toFixed(2)
      : null;

    setAverage(avg);
  };

  const handleCost = () => {
    const d = parseFloat(distance);
    const e = parseFloat(average);
    const p = prices[fuelType];

    if (!d || !e || !p) {
      setResult("🚫 거리, 연비, 유가 모두 정확히 입력해주세요.");
      return;
    }

    const cost = Math.round((d / e) * p).toLocaleString();
    setResult(`예상 유류비: ${cost} 원`);
  };

  return (
    <div style={{ maxWidth: 700, margin: '2rem auto', fontFamily: 'Arial', padding: 20 }}>
      <h1>🚘 차량 연비 필터 + 유류비 계산기</h1>

      <label>출시연도</label>
      <input type="number" placeholder="예: 2023" value={year} onChange={e => setYear(e.target.value)} /><br />

      <label>제조사</label>
      <input value={manufacturer} onChange={e => setManufacturer(e.target.value)} /><br />

      <label>모델 키워드</label>
      <input value={modelKeyword} onChange={e => setModelKeyword(e.target.value)} /><br />

      <label>연료 종류</label>
      <select value={fuel} onChange={e => setFuel(e.target.value)}>
        <option value="">전체</option>
        <option value="휘발유">휘발유</option>
        <option value="경유">경유</option>
        <option value="하이브리드">하이브리드</option>
      </select><br />

      <label>구동방식 (예: 2WD)</label>
      <input value={drive} onChange={e => setDrive(e.target.value)} /><br />

      <button onClick={handleAverage} style={{ marginTop: 10 }}>도심연비 평균 계산</button>

      {average && (
        <>
          <p>🚗 평균 도심연비: <strong>{average} km/L</strong></p>
          <hr />
          <h3>💰 유류비 계산기</h3>
          <input type="number" placeholder="주행거리 (km)" value={distance} onChange={e => setDistance(e.target.value)} /><br />
          <label>유종 선택</label>
          <select value={fuelType} onChange={e => setFuelType(e.target.value)}>
            <option value="gasoline">휘발유</option>
            <option value="diesel">경유</option>
            <option value="premium">고급 휘발유</option>
            <option value="lpg">LPG</option>
          </select><br />
          <button onClick={handleCost} style={{ marginTop: 10 }}>유류비 계산</button>
          {result && <p><strong>{result}</strong></p>}
        </>
      )}
    </div>
  );
}
