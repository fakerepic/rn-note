/**
 * This function takes a timestamp as input and returns a string that represents how long ago that time was.
 * It calculates the difference between the current time and the input time, and then formats that difference into a human-readable string.
 *
 * @param {number} time - The timestamp to be converted.
 * @returns {string} A string representing how long ago the input time was.
 *
 * If the difference is less than a minute, it returns "< 1 minute ago".
 * If the difference is less than an hour, it returns the difference in minutes followed by "minutes ago".
 * If the difference is less than a day, it returns the difference in hours followed by "hours ago".
 * If the difference is less than a week, it returns the difference in days followed by "days ago".
 * If the difference is a week or more, it returns the date in the format "day/month/year".
 */
export function neatTime(time: number): string {
  const now = Date.now();
  const diff = now - time;
  if (diff < 60000) {
    return "< 1 minute ago";
  }
  if (diff < 3600000) {
    return `${Math.floor(diff / 60000)} minutes ago`;
  }
  if (diff < 86400000) {
    return `${Math.floor(diff / 3600000)} hours ago`;
  }
  if (diff < 604800000) {
    return `${Math.floor(diff / 86400000)} days ago`;
  }
  const date = new Date(time);
  return `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`;
}
