export function roundCurrency(value: number): number {
  return Math.round((value + Number.EPSILON) * 100) / 100;
}

export function roundTechnicalHours(
  value: number,
  strategy: 'ROUND_NEAREST_HOUR' | 'NONE',
): number {
  if (strategy === 'ROUND_NEAREST_HOUR') {
    return Math.round(value);
  }

  return roundCurrency(value);
}

export function roundCommercialValue(
  value: number,
  strategy: 'ROUND_UP_INTEGER' | 'ROUND_2_DECIMALS' | 'NONE',
): number {
  if (strategy === 'ROUND_UP_INTEGER') {
    return Math.ceil(value);
  }

  if (strategy === 'ROUND_2_DECIMALS') {
    return roundCurrency(value);
  }

  return value;
}

export function clampMinimum(value: number, minimum: number): number {
  return value < minimum ? minimum : value;
}
