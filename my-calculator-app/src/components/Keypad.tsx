import React from 'react';

interface KeypadProps {
  onInput: (val: string) => void;
  onCalculate: () => void;
  isScientific: boolean;
}

export const Keypad: React.FC<KeypadProps> = ({ onInput, onCalculate, isScientific }) => {
  const triggerHaptic = (isAction: boolean = false) => {
    if (typeof navigator !== 'undefined' && navigator.vibrate) {
      navigator.vibrate(isAction ? 40 : 15);
    }
  };

  const handlePress = (val: string) => {
    if (val === '=') {
      triggerHaptic(true);
      onCalculate();
    } else {
      triggerHaptic(false);
      onInput(val);
    }
  };

  const basicKeys = ['7','8','9','/','4','5','6','*','1','2','3','-','0','.','=','+'];
  
  // Expanded scientific functionality
  const scientificKeys = [
    'sin(','cos(','tan(','asin(','acos(',
    'atan(','log10(','ln(','sqrt(','cbrt(',
    'combinations(','permutations(','!','^','%',
    'pi','e','deg','(',')'
  ];

  return (
    <div style={{ display: 'grid', gridTemplateColumns: isScientific ? 'repeat(5, 1fr)' : 'repeat(4, 1fr)', gap: '10px', transition: 'all 0.3s ease' }}>
      {isScientific && scientificKeys.map((char) => (
        <button 
          key={`sci-${char}`} 
          onClick={() => handlePress(char)} 
          className="calc-btn sci-btn"
          style={{ fontSize: char.length > 5 ? '11px' : '14px' }} // Scale text for longer words
        >
          {char.replace('(', '')}
        </button>
      ))}
      
      {basicKeys.map((char) => (
        <button 
          key={char} 
          onClick={() => handlePress(char)} 
          className={`calc-btn ${char === '=' ? 'eq-btn' : ''}`}
        >
          {char}
        </button>
      ))}
    </div>
  );
};