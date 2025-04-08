export async function getServerSideProps() {
  const API_KEY = "YOUR_OPINET_API_KEY";
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
    // fallback price
  }

  return { props: { prices } };
}

import { useState } from 'react';

export default function Home({ prices }) {
  const [distance, setDistance] = useState('');
  const [efficiency, setEfficiency] = useState('');
  const [fuelType, setFuelType] = useState('gasoline');
  const [result, setResult] = useState('');
  const [error, setError] = useState('');

  const calculateFuel = () => {
    const d = parseFloat(distance);
    const e = parseFloat(efficiency);
    const price = prices[fuelType];

    if (!d || !e || !price) {
      setResult('');
      setError("🚫 거리, 연비를 정확히 입력해주세요.");
      return;
    }

    const fuelNeeded = d / e;
    const totalCost = Math.round(fuelNeeded * price).toLocaleString();
    const fuelLabel = {
      gasoline: "휘발유 🚗",
      diesel: "경유 🚛",
      premium: "고급 휘발유 🏎️",
      lpg: "LPG 🚐"
    }[fuelType];

    setError('');
    setResult(`${fuelLabel} 예상 유류비: ${totalCost} 원`);
  };

  return (
    <div style={{ maxWidth: 500, margin: '40px auto', padding: 30, background: 'white', borderRadius: 10, boxShadow: '0 0 15px rgba(0,0,0,0.1)', fontFamily: 'Arial' }}>
      <h1 style={{ textAlign: 'center' }}>🚗 유류비 계산기</h1>

      <label>주행 거리 (km)</label>
      <input type="number" value={distance} onChange={e => setDistance(e.target.value)} placeholder="예: 100" style={{ width: '100%', padding: 8, marginBottom: 20 }} />

      <label>차량 연비 (km/L)</label>
      <input type="number" value={efficiency} onChange={e => setEfficiency(e.target.value)} placeholder="예: 12" style={{ width: '100%', padding: 8, marginBottom: 20 }} />

      <label>유종 선택</label>
      <select value={fuelType} onChange={e => setFuelType(e.target.value)} style={{ width: '100%', padding: 8, marginBottom: 20 }}>
        <option value="gasoline">휘발유</option>
        <option value="diesel">경유</option>
        <option value="premium">고급 휘발유</option>
        <option value="lpg">LPG</option>
      </select>

      <div style={{ marginBottom: 20 }}>
        <h3>📅 오늘 유가</h3>
        <ul style={{ listStyle: 'none', padding: 0 }}>
          <li>휘발유: {prices.gasoline} 원</li>
          <li>경유: {prices.diesel} 원</li>
          <li>고급휘발유: {prices.premium} 원</li>
          <li>LPG: {prices.lpg} 원</li>
        </ul>
      </div>

      <button onClick={calculateFuel} style={{ width: '100%', padding: 10, background: '#007bff', color: 'white', fontSize: 16, border: 'none' }}>유류비 계산</button>

      {error && <div style={{ color: 'red', marginTop: 10 }}>{error}</div>}
      {result && <div style={{ marginTop: 20, fontSize: 18 }}><strong>{result}</strong></div>}
    </div>
  );
}
