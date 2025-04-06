export const generateSuggestions = (data, thresholds = { completion: 70, dispatch: 50, delays: 20 }) => {
  if (!data || data.length === 0) return [];

  const total = data.length;
  const avgCompletion = data.reduce((acc, item) => acc + item.completion, 0) / total;
  const avgDispatch = data.reduce((acc, item) => acc + item.dispatch, 0) / total;
  const avgdelays = data.reduce((acc, item) => acc + item.delays, 0) / total;

  const suggestions = [];

  if (avgCompletion < thresholds.completion)
    suggestions.push('⚠️ Completion rate is low. Focus on improving performance.');

  if (avgDispatch < thresholds.dispatch)
    suggestions.push('⚠️ Dispatch rate is lower than expected. Consider increasing resources.');

  if (avgdelays > thresholds.delays)
    suggestions.push('⚠️ delayss are high. Investigate workflow or personnel efficiency.');

  return suggestions;
};
