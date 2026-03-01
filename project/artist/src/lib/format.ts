export function formatNumber(n: number) {
  return new Intl.NumberFormat().format(n)
}