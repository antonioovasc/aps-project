export const formatPrice = (price) => {
  const numericPrice = Number(price);
  return isNaN(numericPrice) ? '0.00' : numericPrice.toFixed(2);
};

export const ensureNumber = (value) => {
  const numericValue = Number(value);
  return isNaN(numericValue) ? 0 : numericValue;
}; 