export const toggleFundFilter = (
  current: string[],
  filter: string
): string[] => {
  if (filter === 'All Funds') return ['All Funds'];

  const withoutAll = current.filter(f => f !== 'All Funds');

  if (withoutAll.includes(filter)) {
    const updated = withoutAll.filter(f => f !== filter);
    return updated.length ? updated : ['All Funds'];
  }

  return [...withoutAll, filter];
};
