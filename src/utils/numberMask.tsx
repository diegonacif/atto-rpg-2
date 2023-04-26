export const numberMask = (value: string | undefined) => {
  if (!value) return '';

  return value
    .replace(/\D+/, '')
    // .replace(/[^0-9]/, '')
}
