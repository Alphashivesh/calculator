import React, { useState, useEffect, useCallback } from 'react';
import '../styles/glass.css';
import { parseNaturalLanguage } from '../core/nlpParser';
import { SpatialCanvas } from './SpatialCanvas';
import { advancedEvaluate } from '../core/mathEngine';
import { UnitConverter } from './UnitConverter';

export const Calculator: React.FC = () => {
  const [equation, setEquation] = useState<string>('');
  const [result, setResult] = useState<string>('0');
  const [history, setHistory] = useState<string[]>([]);
  
  // Unified view state: handles main calculator, canvas, or unit converter cleanly
  const [activeView, setActiveView] = useState<'calc' | 'canvas' | 'convert'>('calc');
  const [showScientific, setShowScientific] = useState<boolean>(false);

  const handleInput = useCallback((val: string) => {
    setEquation((prev) => prev + val);
  }, []);

  const calculate = useCallback(() => {
    if (!equation) return;
    try {
      const cleanedEquation = parseNaturalLanguage(equation);
      const finalResult = advancedEvaluate(cleanedEquation);
      
      setResult(finalResult);
      setHistory((prev) => [...prev, `${equation} = ${finalResult}`]);
      setEquation(''); 
    } catch (e) {
      setResult('Error');
    }
  }, [equation]);

  const clear = () => {
    setEquation('');
    setResult('0');
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const validKeys = '0123456789.+-*/()^%!';
      if (validKeys.includes(e.key)) handleInput(e.key);
      if (e.key === 'Enter') calculate();
      if (e.key === 'Backspace') setEquation((prev) => prev.slice(0, -1));
      if (e.key === 'Escape') clear();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleInput, calculate]);

  const basicKeys = ['7','8','9','/','4','5','6','*','1','2','3','-','0','.','=','+'];
  const scientificKeys = [
    'sin(', 'cos(', 'tan(', 'asin(', 'acos(',
    'atan(', 'log10(', 'ln(', 'sqrt(', 'cbrt(',
    'combinations(', 'permutations(', '!', '^', '%',
    'deriv(', 'integrate(', '(', ')'
  ];

  return (
    <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
      <div className="glass-panel">
        <div style={{ display: 'flex', justifyContent: 'space-between', color: '#fff' }}>
          <div style={{ display: 'flex', gap: '6px' }}>
            <button 
              onClick={() => setShowScientific(!showScientific)}
              style={{ background: showScientific ? 'rgba(255,255,255,0.2)' : 'none', border: '1px solid rgba(255,255,255,0.2)', color: '#fff', borderRadius: '8px', cursor: 'pointer', padding: '5px 8px', fontSize: '11px' }}
            >
              {showScientific ? 'Basic' : 'Sci'}
            </button>
            <button 
              onClick={() => setActiveView(activeView === 'canvas' ? 'calc' : 'canvas')}
              style={{ background: activeView === 'canvas' ? 'rgba(0, 210, 255, 0.3)' : 'none', border: '1px solid rgba(255,255,255,0.2)', color: '#fff', borderRadius: '8px', cursor: 'pointer', padding: '5px 8px', fontSize: '11px' }}
            >
              {activeView === 'canvas' ? 'Calc' : 'Canvas'}
            </button>
            <button 
              onClick={() => setActiveView(activeView === 'convert' ? 'calc' : 'convert')}
              style={{ background: activeView === 'convert' ? 'rgba(0, 210, 255, 0.3)' : 'none', border: '1px solid rgba(255,255,255,0.2)', color: '#fff', borderRadius: '8px', cursor: 'pointer', padding: '5px 8px', fontSize: '11px' }}
            >
              Convert
            </button>
          </div>
          <button onClick={clear} style={{ background: 'rgba(255,50,50,0.4)', border: 'none', color: '#fff', borderRadius: '8px', cursor: 'pointer', padding: '5px 10px', fontSize: '11px' }}>
            AC
          </button>
        </div>

        <div className="display-screen">
          <div style={{ fontSize: '18px', opacity: 0.6, minHeight: '24px', wordBreak: 'break-all' }}>
            {equation}
          </div>
          <div style={{ fontSize: equation.length > 15 ? '24px' : '42px', fontWeight: 'bold', transition: 'font-size 0.2s' }}>
            {result}
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: showScientific ? 'repeat(5, 1fr)' : 'repeat(4, 1fr)', gap: '10px', transition: 'all 0.3s' }}>
          {showScientific && scientificKeys.map((char) => (
            <button key={`sci-${char}`} onClick={() => handleInput(char)} className="calc-btn sci-btn" style={{ fontSize: char.length > 5 ? '10px' : '13px' }}>
              {char.replace('(', '')}
            </button>
          ))}
          {basicKeys.map((char) => (
            <button key={char} onClick={() => char === '=' ? calculate() : handleInput(char)} className={`calc-btn ${char === '=' ? 'eq-btn' : ''}`}>
              {char}
            </button>
          ))}
        </div>
      </div>

      {/* Right Side Views: Switch smoothly between Canvas, Unit Converter, and History */}
      {activeView === 'canvas' && <SpatialCanvas />}
      {activeView === 'convert' && <UnitConverter />}
      {activeView === 'calc' && (
        <div className="glass-panel" style={{ width: '250px', maxHeight: '500px', overflowY: 'auto' }}>
          <h3 style={{ color: '#fff', marginTop: 0, borderBottom: '1px solid rgba(255,255,255,0.2)', paddingBottom: '10px' }}>History</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {history.length === 0 ? (
              <span style={{ color: 'rgba(255,255,255,0.5)' }}>No calculations yet.</span>
            ) : (
              history.map((item, index) => (
                <div key={index} style={{ color: '#fff', fontSize: '14px', background: 'rgba(0,0,0,0.2)', padding: '10px', borderRadius: '8px' }}>
                  {item}
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
};