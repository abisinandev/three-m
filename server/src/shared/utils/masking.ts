export const maskSensitiveData = (value: string | null | undefined, visibleCount: number = 4): string | null => {
  if (!value) return null;
  if (value.length <= visibleCount) return value;
  
  const maskedLength = value.length - visibleCount;
  return "*".repeat(maskedLength) + value.slice(-visibleCount);
};
