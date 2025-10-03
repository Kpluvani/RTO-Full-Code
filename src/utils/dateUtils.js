// src/utils/dateUtils.js
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';

dayjs.extend(utc);
dayjs.extend(timezone);

const IST_TIMEZONE = 'Asia/Kolkata';

/**
 * Converts UTC date string from backend to IST dayjs object
 */
export const convertUTCToIST = (utcDate) => {
  return dayjs.utc(utcDate).tz(IST_TIMEZONE);
};

/**
 * Converts a local IST dayjs object to UTC ISO string for backend
 */
export const convertISTToUTC = (istDate) => {
  return dayjs.tz(istDate, IST_TIMEZONE).utc().toISOString();  // ISO UTC string
};

/**
 * Formats IST date for display
 */
export const formatISTDate = (utcDate, format = 'YYYY-MM-DD HH:mm') => {
  return convertUTCToIST(utcDate).format(format);
};

/**
 * Converts string/Date to IST dayjs object
 */
export const toIST = (date) => {
  return dayjs(date).tz(IST_TIMEZONE);
};
