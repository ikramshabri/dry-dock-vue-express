// '2022-10-12' -> '12/10/2022' (atau '12/10/22' jika short)
export function formatDate(value, short = false) {
  if (!value) return '-';
  const [year, month, day] = String(value).slice(0, 10).split('-');
  return `${day}/${month}/${short ? year.slice(2) : year}`;
}
