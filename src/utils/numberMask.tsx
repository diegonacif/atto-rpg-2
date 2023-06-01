export const numberMask = (value: string | undefined) => {
  if (!value || typeof value !== 'string') return '';

  return value
    .replace(/\D+/, '')
}
