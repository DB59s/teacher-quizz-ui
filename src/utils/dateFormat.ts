/**
 * Format date to Vietnamese timezone (UTC+7)
 * @param dateString - ISO date string from API
 * @param includeTime - Whether to include time in the output
 * @returns Formatted date string
 */
export function formatDateVN(dateString: string, includeTime: boolean = false): string {
  const date = new Date(dateString)

  const options: Intl.DateTimeFormatOptions = {
    timeZone: 'Asia/Ho_Chi_Minh',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    ...(includeTime && {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false
    })
  }

  return date.toLocaleString('vi-VN', options)
}
