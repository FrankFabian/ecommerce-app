export const formatCurrency = (amount: number) => {
  return (amount).toLocaleString('en-US', {
    style: 'currency',
    currency: 'USD',
  });
};

export const toYMD = (d?: Date) => (d ? d.toISOString().slice(0, 10) : null);