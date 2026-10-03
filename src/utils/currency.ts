/**
 * Goldifi Currency & Number Formatting
 * Native Indian Currency Formatting: ₹25,000, ₹1,25,000, ₹18,45,000
 */

export function formatINR(amount: number | undefined | null): string {
  if (amount === undefined || amount === null || isNaN(amount)) {
    return '₹0';
  }

  const isNegative = amount < 0;
  const absAmount = Math.abs(Math.round(amount));

  // Convert to Indian numbering system (Lakhs and Crores)
  const str = absAmount.toString();
  let result = '';

  if (str.length <= 3) {
    result = str;
  } else {
    // Last 3 digits
    const last3 = str.substring(str.length - 3);
    const rest = str.substring(0, str.length - 3);

    // Group rest in 2 digits from right to left
    const restFormatted = rest.replace(/\B(?=(\d{2})+(?!\d))/g, ',');
    result = `${restFormatted},${last3}`;
  }

  return `${isNegative ? '-' : ''}₹${result}`;
}

export function formatGrams(grams: number | undefined | null): string {
  if (grams === undefined || grams === null) return '0.00g';
  return `${grams.toFixed(2)}g`;
}
