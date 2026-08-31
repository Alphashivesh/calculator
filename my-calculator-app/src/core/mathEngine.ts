import { evaluate, derivative, format, simplify} from 'mathjs';

export const advancedEvaluate = (expression: string): string => {
  try {
    // Handle derivatives
    if (expression.startsWith('deriv(')) {
      const inner = expression.slice(6, -1);
      const parts = inner.split(',');
      const func = parts[0].trim();
      const variable = parts[1] ? parts[1].trim() : 'x';
      const res = derivative(func, variable);
      return simplify(res).toString();
    }

    // Handle definite/numerical integration
    if (expression.startsWith('integrate(')) {
      const inner = expression.slice(10, -1);
      const parts = inner.split(',');
      const func = parts[0].trim();
      const variable = parts[1] ? parts[1].trim() : 'x';
      
      if (parts.length === 4) {
        const lower = parseFloat(parts[2].trim());
        const upper = parseFloat(parts[3].trim());
        const n = 1000;
        const h = (upper - lower) / n;
        let sum = 0.5 * (evaluate(func, { [variable]: lower }) + evaluate(func, { [variable]: upper }));
        for (let i = 1; i < n; i++) {
          sum += evaluate(func, { [variable]: lower + i * h });
        }
        return String(sum * h);
      }
      
      return `Integral of ${func} w.r.t ${variable}`;
    }

    let sanitizedExpression = expression
      .replace(/ln\(/g, 'log(')
      .replace(/combinations\(/g, 'combinations(') 
      .replace(/permutations\(/g, 'permutations(');

    const result = evaluate(sanitizedExpression);

    // If the result is a mathjs Unit (e.g., converting length/mass/weight)
    if (result && typeof result === 'object' && 'isUnit' in result) {
      return result.toString();
    }

    if (typeof result === 'object' && result !== null) {
      return format(result, { precision: 14 });
    }

    return String(result);
  } catch (error) {
    throw new Error('Invalid computation');
  }
};