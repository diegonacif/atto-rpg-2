export const numberMaskWithNegative = (value: string | undefined, cursorPosition: number) => {
  if (!value || typeof value !== 'string') return '';

  const isNegative = value.charAt(0) === '-';
  let sanitizedValue = value.replace(/[^0-9]+/g, '');

  if (cursorPosition === 0 && !isNegative) {
    sanitizedValue = `-${sanitizedValue}`;
  }

  return sanitizedValue;
};