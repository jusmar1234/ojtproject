// src/utils/cleanData.js

export const cleanData = (data) => {
  const aggregatedData = {};

  // Loop through each data entry
  data.forEach((row) => {
    const formattedDate = formatDate(row['date']);
    const key = `${formattedDate}-${row['name']}`;

    if (!aggregatedData[key]) {
      aggregatedData[key] = {
        date: formattedDate,
        name: row['name'],
        dispatch: 0,
        delay: 0,
        completion: 0,
      };
    }

    // Aggregate values for dispatch, delay, and completion
    aggregatedData[key].dispatch += row['dispatch'];
    aggregatedData[key].delay += row['delay'];
    aggregatedData[key].completion += row['completion'];
  });

  // Convert the aggregated data back into an array
  return Object.values(aggregatedData);
};

export const formatDate = (dateStr) => {
  const date = new Date(dateStr);
  const options = { day: '2-digit', month: 'numeric', year: 'numeric' };
  return date.toLocaleDateString('en-GB', options); // Format to DD M YYYY (e.g., 03 2 2025)
};
