import React, { useState } from 'react';
import { DatePicker as AntdDatePicker } from 'antd';
import moment, { Moment } from 'moment';

interface IProps {
  localDate: string;
  onChange?: (date: string) => void;
  className?: string;
}

// Antd 5 has issue with style component warning, we still need to use v4 and use moment in a custom component 
// Document https://4x.ant.design/components/date-picker/

export default function DateTimePicker({ localDate, onChange = () => { }, className }: IProps) {
  // https://legacy.reactjs.org/docs/hooks-reference.html#bailing-out-of-a-state-update
  const [defaultLocalDate] = useState<Moment>(() => {
    if (!localDate) {
      return null;
    }
    return moment(localDate)
  });

  const onChangedHandler = (_: moment.Moment, dateString: string) => onChange(dateString);
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
