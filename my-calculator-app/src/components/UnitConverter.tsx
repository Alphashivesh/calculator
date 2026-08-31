import React, { useState } from 'react';
import { evaluate } from 'mathjs';

const conversionCategories: Record<string, { label: string; units: { label: string; value: string }[] }> = {
  length: {
    label: 'Length',
    units: [
      { label: 'Meters (m)', value: 'm' },
      { label: 'Centimeters (cm)', value: 'cm' },
      { label: 'Millimeters (mm)', value: 'mm' },
      { label: 'Kilometers (km)', value: 'km' },
      { label: 'Inches (in)', value: 'inch' },
      { label: 'Feet (ft)', value: 'ft' },
      { label: 'Yards (yd)', value: 'yd' },
      { label: 'Miles (mi)', value: 'mi' }
    ]
  },
  mass: {
    label: 'Mass / Weight',
    units: [
      { label: 'Kilograms (kg)', value: 'kg' },
      { label: 'Grams (g)', value: 'g' },
      { label: 'Milligrams (mg)', value: 'mg' },
      { label: 'Pounds (lb)', value: 'lb' },
      { label: 'Ounces (oz)', value: 'oz' },
      { label: 'Tonnes (t)', value: 'tonne' }
    ]
  },
  temperature: {
    label: 'Temperature',
    units: [
      { label: 'Celsius (°C)', value: 'degC' },
      { label: 'Fahrenheit (°F)', value: 'degF' },
      { label: 'Kelvin (K)', value: 'K' }
    ]
  },
  time: {
    label: 'Time',
    units: [
      { label: 'Seconds (s)', value: 'sec' },
      { label: 'Minutes (min)', value: 'min' },
      { label: 'Hours (hour)', value: 'hour' },
      { label: 'Days (day)', value: 'day' }
    ]
  },
  data: {
    label: 'Data (Binary)',
    units: [
      { label: 'Bits (b)', value: 'b' },
      { label: 'Bytes (B)', value: 'byte' },
      { label: 'Kilobytes (kB)', value: 'kB' },
      { label: 'Megabytes (MB)', value: 'MB' },
      { label: 'Gigabytes (GB)', value: 'GB' },
      { label: 'Terabytes (TB)', value: 'TB' }
    ]
  },
  currency: {
    label: 'Currency',
    units: [
      { label: 'US Dollar (USD)', value: 'USD' },
      { label: 'Euro (EUR)', value: 'EUR' },
      { label: 'British Pound (GBP)', value: 'GBP' },
      { label: 'Indian Rupee (INR)', value: 'INR' },
      { label: 'Japanese Yen (JPY)', value: 'JPY' }
    ]
  }
};

export const UnitConverter: React.FC = () => {
  const [category, setCategory] = useState<string>('length');
  const [value, setValue] = useState<string>('1');
  const [fromUnit, setFromUnit] = useState<string>('m');
  const [toUnit, setToUnit] = useState<string>('cm');
  const [convertedResult, setConvertedResult] = useState<string>('100 cm');

  const handleCategoryChange = (newCat: string) => {
    setCategory(newCat);
    const defaultUnits = conversionCategories[newCat].units;
    const newFrom = defaultUnits[0].value;
    const newTo = defaultUnits[1] ? defaultUnits[1].value : defaultUnits[0].value;
    setFromUnit(newFrom);
    setToUnit(newTo);
    performConversion(value, newFrom, newTo);
  };

  const performConversion = (val: string, from: string, to: string) => {
    setValue(val);
    if (!val || isNaN(Number(val))) {
      setConvertedResult('0');
      return;
    }

    try {
      // Evaluate conversion safely via mathjs
      const res = evaluate(`${val} ${from} to ${to}`);
      setConvertedResult(res.toString());
    } catch (e) {
      setConvertedResult('Invalid conversion');
    }
  };

  const currentUnits = conversionCategories[category].units;

  return (
    <div className="glass-panel" style={{ width: '340px' }}>
      <h3 style={{ color: '#fff', marginTop: 0, textAlign: 'center', borderBottom: '1px solid rgba(255,255,255,0.2)', paddingBottom: '10px' }}>
        Universal Converter
      </h3>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '6px', marginBottom: '15px' }}>
        {Object.entries(conversionCategories).map(([key, cat]) => (
          <button
            key={key}
            onClick={() => handleCategoryChange(key)}
            style={{
              background: category === key ? 'rgba(0, 210, 255, 0.3)' : 'rgba(255, 255, 255, 0.05)',
              border: '1px solid rgba(255, 255, 255, 0.15)',
              color: '#fff',
              borderRadius: '8px',
              padding: '6px 4px',
              fontSize: '11px',
              cursor: 'pointer',
              fontWeight: category === key ? 'bold' : 'normal'
            }}
          >
            {cat.label}
          </button>
        ))}
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
        <div>
          <label style={{ color: '#fff', fontSize: '11px', opacity: 0.8 }}>From</label>
          <div style={{ display: 'flex', gap: '10px', marginTop: '4px' }}>
            <input 
              type="text" 
              value={value} 
              onChange={(e) => performConversion(e.target.value, fromUnit, toUnit)}
              style={{ background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.2)', borderRadius: '8px', color: '#fff', padding: '10px', width: '50%', outline: 'none' }}
            />
            <select 
              value={fromUnit} 
              onChange={(e) => { setFromUnit(e.target.value); performConversion(value, e.target.value, toUnit); }}
              style={{ background: 'rgba(0,0,0,0.6)', border: '1px solid rgba(255,255,255,0.2)', borderRadius: '8px', color: '#fff', padding: '10px', width: '50%', outline: 'none' }}
            >
              {currentUnits.map((u) => (
                <option key={u.value} value={u.value} style={{ background: '#1e293b', color: '#fff' }}>
                  {u.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div style={{ textAlign: 'center', color: '#00d2ff', fontSize: '16px', margin: '-5px 0' }}>↓</div>

        <div>
          <label style={{ color: '#fff', fontSize: '11px', opacity: 0.8 }}>Result</label>
          <div style={{ display: 'flex', gap: '10px', marginTop: '4px' }}>
            <div style={{ background: 'rgba(0,0,0,0.4)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', color: '#00d2ff', padding: '10px', width: '50%', display: 'flex', alignItems: 'center', fontWeight: 'bold', overflowX: 'auto' }}>
              {convertedResult}
            </div>
            <select 
              value={toUnit} 
              onChange={(e) => { setToUnit(e.target.value); performConversion(value, fromUnit, e.target.value); }}
              style={{ background: 'rgba(0,0,0,0.6)', border: '1px solid rgba(255,255,255,0.2)', borderRadius: '8px', color: '#fff', padding: '10px', width: '50%', outline: 'none' }}
            >
              {currentUnits.map((u) => (
                <option key={u.value} value={u.value} style={{ background: '#1e293b', color: '#fff' }}>
                  {u.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>
    </div>
  );
};