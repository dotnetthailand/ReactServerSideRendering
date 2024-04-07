import React, { useState } from 'react';
import { DatePicker as AntdDatePicker } from 'antd';

// import DayJS
// https://github.com/iamkun/dayjs/issues/788
// https://day.js.org/docs/en/installation/typescript

import dayjs, { Dayjs } from 'dayjs';

// TypeScript


// Timezone
// https://day.js.org/docs/en/timezone/set-default-timezone

interface IProps {
  localDate: string;
  onChange?: (date: string) => void;
  className?: string;
}

// Antd 5 has issue with style component warning, we still need to use v4 and use moment in a custom component 
// Document https://4x.ant.design/components/date-picker/

export default function DatePicker({ localDate, onChange = () => { }, className }: IProps) {
  // https://legacy.reactjs.org/docs/hooks-reference.html#bailing-out-of-a-state-update
  const [defaultLocalDate] = useState<Dayjs>(() => {
    if (!localDate) {
      return null;
    }
    return dayjs(localDate)
  });

  const onChangedHandler = (_: Dayjs, dateString: string | string[]) => onChange(dateString as string);

  return (
    <>
      <AntdDatePicker
        format='YYYY-MM-DD'
        className={className}
        defaultValue={defaultLocalDate}
        onChange={onChangedHandler}
        allowClear={true}
      />
    </>
  )
}
