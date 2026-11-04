export function formatMobilePhone(value: string) {
  const digits = value.replace(/\D/g, "");
  const middleEnd = digits.length === 10 ? 6 : 7;

  return [
    digits.slice(0, 3),
    digits.slice(3, middleEnd),
    digits.slice(middleEnd),
  ].filter(Boolean).join("-");
}