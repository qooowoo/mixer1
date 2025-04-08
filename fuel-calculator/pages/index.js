import { useEffect, useState } from 'react';

export default function Home() {
  const [prices, setPrices] = useState({ gasoline: 0, diesel: 0, premium: 0, lpg: 0 });
  const [distance, setDistance] = useState('');
  const [efficiency, setEfficiency] = useState('');
  const [fuelType, setFuelType] = useState('gasoline');
  const [result, setResult] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    fetch('/api/fuel')
      .then(res => res.json())
      .then(data => {
        const oil = data.RESULT?.OIL || [];
        const updatedPrices = {};
        oil.forEach(oil => {
          switch (oil.PRODCD) {
            case 'B027': updatedPrices.gasoline = parseFloat(oil.PRICE); break;
            case 'D047': updatedPrices.diesel = parseFloat(oil.PRICE); break;
            case 'B034': updatedPrices.premium = parseFloat(oil.PRICE); break; // 고급 휘발유
            case 'K015': updatedPrices.lpg = parseFloat(oil.PRICE); break;     // LPG
          }
        });
        setPrices(updatedPrices);
      }).catch(() => {
        setError('유가 정보를 불러오지 못했습니다.');
      });
  }, []);

  const calculateFuel = () => {
    const d = parseFloat(distance);
    const e = parseFloat(efficiency);
    const price = prices[fuelType];

    if (!d || !e || !price) {
      setResult('');
      setError("🚫 거리, 연비, 유가 정보를 정확히 입력/선택해주세요.");
      return;
    }

    setError('');
    const fuelNeeded = d / e;
    const totalCost = Math.round(fuelNeeded * price).toLocaleString();
    const label = {
      gasoline: "휘발유 🚗",
      diesel: "경유 🚛",
      premium: "고급 휘발유 🏎️",
      lpg: "LPG 🚐"
    }[fuelType];

    setResult(`${label} 예상 유류비: ${totalCost} 원`);
  };

  return (
    <div id="fuel-calculator" style={{
      maxWidth: '500px',
      margin: '40px auto',
      background: 'white',
      padding: '30px',
      borderRadius: '10px',
      boxShadow: '0 0 15px rgba(0,0,0,0.1)',
      fontFamily: 'Arial, sans-serif',
      color: '#333'
    }}>
      <h1 style={{ textAlign: 'center' }}>🚗 유류비 계산기</h1>

      <div className="input-group" style={{ marginBottom: '20px' }}>
        <label>주행 거리 (km)</label>
        <input type="number" placeholder="예: 100" value={distance} onChange={e => setDistance(e.target.value)}
          style={{ width: '100%', padding: '8px', marginTop: '5px' }} />
      </div>

      <div className="input-group" style={{ marginBottom: '20px' }}>
        <label>차량 연비 (km/L)</label>
        <input type="number" placeholder="예: 12" value={efficiency} onChange={e => setEfficiency(e.target.value)}
          style={{ width: '100%', padding: '8px', marginTop: '5px' }} />
      </div>

      <div className="input-group" style={{ marginBottom: '20px' }}>
        <label>유종 선택</label>
        <select value={fuelType} onChange={e => setFuelType(e.target.value)}
          style={{ width: '100%', padding: '8px', marginTop: '5px' }}>
          <option value="gasoline">휘발유</option>
          <option value="diesel">경유</option>
          <option value="premium">고급 휘발유</option>
          <option value="lpg">LPG</option>
        </select>
      </div>

      <div className="fuel-price">
        <h3>📅 오늘 유가</h3>
        <ul style={{ paddingLeft: 0, listStyle: 'none' }}>
          <li>휘발유: <span>{prices.gasoline ? `${prices.gasoline} 원` : '-'}</span></li>
          <li>경유: <span>{prices.diesel ? `${prices.diesel} 원` : '-'}</span></li>
          <li>고급휘발유: <span>{prices.premium ? `${prices.premium} 원` : '-'}</span></li>
          <li>LPG: <span>{prices.lpg ? `${prices.lpg} 원` : '-'}</span></li>
        </ul>
      </div>

      <button onClick={calculateFuel} style={{
        width: '100%',
        padding: '10px',
        background: '#007bff',
        color: 'white',
        fontSize: '16px',
        border: 'none',
        cursor: 'pointer',
        marginTop: '20px'
      }}>유류비 계산</button>

      {error && <div style={{ color: 'red', marginTop: '10px' }}>{error}</div>}
      {result && <div style={{ marginTop: '20px', fontSize: '18px' }}><strong>{result}</strong></div>}
    </div>
  );
}
