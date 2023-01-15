export function useCurrencyFormatter() {
  const formatter = new Intl.NumberFormat('nb-NO', {
    style: 'currency',
    currency: 'NOK',
  })

  return {
    formatCurrency: formatter.format,
  }
}
