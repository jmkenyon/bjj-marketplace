export const RequiredLabel = ({ children }: { children: string }) => (
  <span>
    {children} <span className="text-red-500">*</span>
  </span>
);

export const parseSessionDate = (dateStr: string): Date | null => {
  const [y, m, d] = dateStr.split("-").map(Number);
  if (!y || !m || !d) return null;

  // Noon local time avoids UTC rollover issues
  const date = new Date(y, m - 1, d, 12, 0, 0, 0);
  return isNaN(date.getTime()) ? null : date;
};
