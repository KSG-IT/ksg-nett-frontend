export function useCurrencyFormatter() {
  const formatter = new Intl.NumberFormat('nb-NO', {
    style: 'currency',
    currency: 'NOK',
    minimumFractionDigits: 0,
  })

  return {
    formatCurrency: formatter.format,
  }
}
