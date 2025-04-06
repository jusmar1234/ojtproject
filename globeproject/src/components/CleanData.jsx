// CleanData.jsx

export const formatDate = (value) => {
  // Handle Excel serial number (e.g., 45000)
  if (typeof value === 'number') {
    const excelEpoch = new Date(1899, 11, 30);
    const date = new Date(excelEpoch.getTime() + value * 86400000);
    return date.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
  }

  const date = new Date(value);
  return date.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
};

export const cleanData = (data) => {
  const aggregated = {};

  data.forEach((row) => {
    const formattedDate = formatDate(row['date']);
    const name = row['name'];
    const key = `${formattedDate}-${name}`;

    if (!aggregated[key]) {
      aggregated[key] = {
        date: formattedDate,
        name,
        dispatch: 0,
        delays: 0,
        completion: 0,
      };
    }

    aggregated[key].dispatch += Number(row['dispatch']) || 0;
    aggregated[key].delays += Number(row['delays']) || 0;
    aggregated[key].completion += Number(row['completion']) || 0;
  });

  return Object.values(aggregated);
};
