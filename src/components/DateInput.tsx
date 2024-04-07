import React from 'react';
import { useState } from 'react';
import DatePicker from './DatePicker';
import dayjs from 'dayjs';

import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";

dayjs.extend(utc)
dayjs.extend(timezone)

const defaultTimezone = 'Asia/Bangkok';
dayjs.tz.setDefault(defaultTimezone)

// List of all timezones https://github.com/omsrivastava/timezones-list/blob/master/dist/timezones.json
// Asia/Bangkok
type Props = {
  name: string;
  defaultValue: string;
  className: string;
}

// nameof in TypeScript https://www.meziantou.net/typescript-nameof-operator-equivalent.htm
function nameof<T>(key: keyof T, instance?: T): keyof T {
  return key;
}

// default value as UTC date
export default function DateInput({ defaultValue, name, className = '' }: Props) {

  const [utcDate, setUtcDate] = useState(() => {
    if (!defaultValue) {
      return '';
    }
    const utc = dayjs.utc(defaultValue)
    return utc.format();
  });

  // Lazy initialize https://legacy.reactjs.org/docs/hooks-reference.html#lazy-initialization
  const [localDate] = useState(() => {
    if (!defaultValue) {
      return '';
    }

    const utc = dayjs.utc(defaultValue)
    // Change to local timezone and return as string
    return utc.tz(defaultTimezone).format();
  });

  const onChange = (date: string) => {
    if (!date) {
      setUtcDate('');
      return;
    }
    // convert local date to UTC date
    // https://day.js.org/docs/en/plugin/utc
    const localDate = dayjs.tz(date as string, defaultTimezone); // ''
    setUtcDate(_ => {
      const newUtcDate = localDate.utc().format();
      return newUtcDate;
    });
  }

  return (
    <>
      <DatePicker
        localDate={localDate}
        onChange={onChange}
        className={className} />
      <input name={name} type='hidden' value={utcDate} />
    </>
  );
}
