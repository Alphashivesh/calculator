export const parseNaturalLanguage = (input: string): string => {
  let parsed = input.toLowerCase();

  // Dictionary of natural language conversions
  const translations: Record<string, string> = {
    'half of': '0.5 *',
    'quarter of': '0.25 *',
    'double': '2 *',
    'plus': '+',
    'minus': '-',
    'times': '*',
    'multiplied by': '*',
    'divided by': '/',
    'over': '/',
    'squared': '^2',
    'cubed': '^3',
  };

  // Replace phrases with operators
  for (const [word, operator] of Object.entries(translations)) {
    const regex = new RegExp(`\\b${word}\\b`, 'gi');
    parsed = parsed.replace(regex, operator);
  }

  // Handle percentage phrasing (e.g., "15% of 500" -> "0.15 * 500")
  parsed = parsed.replace(/(\d+(?:\.\d+)?)%\s*of/g, (match, p1) => {
    return `${parseFloat(p1) / 100} *`;
  });

  return parsed;
};