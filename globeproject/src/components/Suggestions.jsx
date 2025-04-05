const generateSuggestions = (data) => {
  const avgCompletion = data.reduce((acc, item) => acc + item.completion, 0) / data.length;
  const avgDispatch = data.reduce((acc, item) => acc + item.dispatch, 0) / data.length;

  let suggestions = [];
  if (avgCompletion < 70) {
    suggestions.push('Completion rate is low. Focus on improving performance.');
  }
  if (avgDispatch < 50) {
    suggestions.push('Dispatch rate is lower than expected. Consider increasing resources.');
  }

  return suggestions;
};
