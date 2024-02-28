export function convertToPacificTime(date) {
    return new Date(date).toLocaleString("en-US", { timeZone: "America/Los_Angeles" });
}

export function dateToDaysAgo(date) {
  const today = new Date();
  const pastDate = new Date(date);
  const diffTime = today - pastDate;
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
  const diffMinutes = Math.floor(diffTime / (1000 * 60));

  if (diffDays === 0) {
      if (diffMinutes < 60) {
          return diffMinutes === 0 ? "just now" : `${diffMinutes} minutes ago`;
      }
      return "today";
  } else if (diffDays === 1) {
      return "yesterday";
  } else {
      return `${diffDays} days ago`;
  }
}