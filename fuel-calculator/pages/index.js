import { useState, useEffect } from 'react';

export default function Home() {
  const [prices, setPrices] = useState({});
  const [distance, setDistance] = useState('');
  const [efficiency, setEfficiency] = useState('');
  const [fuelType, setFuelType] = useState('gasoline');
  const [result, setResult] = useState('');

  useEffect(() => {
    fetch('/api/fuel')
      .then(res => res.json())
      .then(data => {
        const oil = data.RESULT?.OIL || [];
        const priceMap = {};
        oil.forEach(o => {
          switch (o.PRODCD) {
          case 'B027': priceMap.gasoline = parseFloat(o.PRICE); break;
          case 'D047': priceMap.diesel = parseFloat(o.PRICE); break;
          case 'B034': priceMap.premium = parseFloat(o.PRICE); break; 
          case 'K015': priceMap.lpg = parseFloat(o.PRICE); break;  
          }
        });
        setPrices(priceMap);
      });
  }, []);

  const calculate = () => {
    const d = parseFloat(distance);
    const e = parseFloat(efficiency);
    if (!d || !e || !prices[fuelType]) {
      setResult("모든 값을 입력하고 유종 선택하세요.");
      return;
    }
    const amount = d / e * prices[fuelType];
    const label = {
      gasoline: "휘발유 🚗",
      diesel: "경유 🚛",
      premium: "고급 휘발유 🏎️",
      lpg: "LPG 🚐"
    }[fuelType];
    setResult(`${label} 예상 유류비: ${Math.round(amount).toLocaleString()} 원`);
  };

  return (
    <div style={{ maxWidth: 500, margin: '2rem auto', padding: '2rem', background: '#fff', borderRadius: '10px', boxShadow: '0 0 10px #ccc' }}>
      <h1>유류비 계산기</h1>
      <input type="number" placeholder="주행 거리 (km)" onChange={e => setDistance(e.target.value)} /><br />
      <input type="number" placeholder="차량 연비 (km/L)" onChange={e => setEfficiency(e.target.value)} /><br />
      <select onChange={e => setFuelType(e.target.value)} defaultValue="gasoline">
        <option value="gasoline">휘발유</option>
        <option value="diesel">경유</option>
        <option value="premium">고급 휘발유</option>
        <option value="lpg">LPG</option>
      </select><br /><br />
      <button onClick={calculate}>계산하기</button>
      <p><strong>{result}</strong></p>
    </div>
  );
}
