export const generateSuggestions = (data, thresholds = { completion: 70, dispatch: 50, delays: 20 }) => {
  if (!data || data.length === 0) return [];

  const total = data.length;
  
  // Calculating averages
  const avgCompletion = data.reduce((acc, item) => acc + item.completion, 0) / total;
  const avgDispatch = data.reduce((acc, item) => acc + item.dispatch, 0) / total;
  const avgDelays = data.reduce((acc, item) => acc + item.delays, 0) / total;

  // Calculating counts and percentages for each threshold
  const lowCompletion = data.filter((item) => item.completion < thresholds.completion);
  const lowDispatch = data.filter((item) => item.dispatch < thresholds.dispatch);
  const highDelays = data.filter((item) => item.delays > thresholds.delays);

  const lowCompletionCount = lowCompletion.length;
  const lowCompletionPercent = ((lowCompletionCount / total) * 100).toFixed(2);

  const lowDispatchCount = lowDispatch.length;
  const lowDispatchPercent = ((lowDispatchCount / total) * 100).toFixed(2);

  const highDelaysCount = highDelays.length;
  const highDelaysPercent = ((highDelaysCount / total) * 100).toFixed(2);

  const suggestions = [];

  // Completion suggestion
  if (avgCompletion < thresholds.completion) {
    suggestions.push(`⚠️ Completion rate is low. (${lowCompletionCount} entries below ${thresholds.completion}%, ${lowCompletionPercent}% of the data)`);
  }

  // Dispatch suggestion
  if (avgDispatch < thresholds.dispatch) {
    suggestions.push(`⚠️ Dispatch rate is lower than expected. (${lowDispatchCount} entries below ${thresholds.dispatch}%, ${lowDispatchPercent}% of the data)`);
  }

  // Delays suggestion
  if (avgDelays > thresholds.delays) {
    suggestions.push(`⚠️ Delays are high. (${highDelaysCount} entries above ${thresholds.delays}%, ${highDelaysPercent}% of the data)`);
  }

  // Overall summary suggestion
  if (lowCompletionPercent > 30 || lowDispatchPercent > 30 || highDelaysPercent > 30) {
    suggestions.push('🚨 Overall performance is concerning. Investigate workflow, personnel, or process inefficiencies.');
  }

  return suggestions;
};
