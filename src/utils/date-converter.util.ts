import * as moment from 'moment-timezone';

/**
 * Utility class for handling date conversions and formatting.
 * Focuses on operations in the Asia/Vientiane timezone.
 */
export class DateConverter {
  /**
   * Recursively converts all dates in a given data structure to the Asia/Vientiane timezone.
   * @param data - The data structure containing dates to convert.
   * @param toDateObject - If true, converts to Date objects; if false, converts to formatted strings.
   * @returns The data structure with converted dates.
   */
  static convertDates(data: any, toDateObject: boolean = false): any {
    if (data instanceof Date) {
      return toDateObject
        ? moment(data).tz('Asia/Vientiane').toDate()
        : moment(data).tz('Asia/Vientiane').format();
    }

    if (Array.isArray(data)) {
      return data.map((item) => this.convertDates(item, toDateObject));
    }

    if (typeof data === 'object' && data !== null) {
      const newObj: any = {};
      for (const key in data) {
        newObj[key] = this.convertDates(data[key], toDateObject);
      }
      return newObj;
    }

    return data;
  }

  /**
   * Converts a given date to a Date object in the Asia/Vientiane timezone.
   * @param date - The date to convert. Defaults to the current date if not provided.
   * @returns A Date object representing the input date in the Asia/Vientiane timezone.
   */
  static toVientianeDateObject(
    date: Date | string | number = new Date(),
  ): Date {
    return moment(date).tz('Asia/Vientiane').toDate();
  }

  /**
   * Formats a given date as a string in the Asia/Vientiane timezone.
   * @param date - The date to format. Defaults to the current date if not provided.
   * @returns A formatted string representation of the date in the Asia/Vientiane timezone.
   */
  static formatToVientianeString(
    date: Date | string | number = new Date(),
  ): string {
    return moment(date).tz('Asia/Vientiane').format();
  }

  /**
   * Converts a date string from MM/DD/YYYY format to YYYY-MM-DD format.
   * @param date - The date string to convert.
   * @returns The date string in YYYY-MM-DD format if input was MM/DD/YYYY, otherwise returns the input unchanged.
   * @private
   */
  private static convertToYYYYMMDD(date: string): string {
    if (/^(0[1-9]|1[0-2])\/(0[1-9]|[12][0-9]|3[01])\/\d{4}$/.test(date)) {
      const [month, day, year] = date.split('/');
      return `${year}-${month}-${day}`;
    }
    return date;
  }

  /**
   * Parses a date input flexibly, handling various formats including MM/DD/YYYY.
   * @param date - The date to parse. Can be a Date object, string, or number. Defaults to the current date if not provided.
   * @returns A Date object representing the input date in the Asia/Vientiane timezone.
   */
  static parseFlexibleDate(date: Date | string | number = new Date()): Date {
    if (typeof date === 'string') {
      date = this.convertToYYYYMMDD(date);
    }
    return this.toVientianeDateObject(date);
  }

  /**
   * Formats a date input to a YYYY-MM-DD string.
   * @param date - The date to format. Can be a Date object, string, or number. Defaults to the current date if not provided.
   * @returns A string representation of the date in YYYY-MM-DD format.
   */
  static formatToDateString(date: Date | string | number = new Date()): string {
    return moment(this.parseFlexibleDate(date)).format('YYYY-MM-DD');
  }
}
