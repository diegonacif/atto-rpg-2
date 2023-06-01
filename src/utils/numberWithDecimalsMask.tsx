export const numberWithDecimalsMask = (value: string | undefined) => {
  if (!value || typeof value !== 'string') return '';

  const onlyNumbersAndComma = value.replace(/[^0-9,.]/g, '');
  const parts = onlyNumbersAndComma.split(',');

  let formattedValue = parts[0];
  if (parts.length > 1) {
    const decimalPart = parts[1].slice(0, 2);
    formattedValue += `,${decimalPart}`;
  }

  return formattedValue;
};
