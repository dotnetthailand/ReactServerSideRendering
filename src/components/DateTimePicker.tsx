import * as React from 'react';
import DatePicker from "react-datepicker";
import { useState } from 'react';
import styled from 'styled-components';
import { setHours } from "date-fns/setHours";
import { setMinutes } from "date-fns/setMinutes";
import { setDate } from "date-fns/setDate";
import { addDays } from 'date-fns';


const DatePickerContainer = styled.div`
  margin-left: 50px;
`
export default function DateTimePicker() {

  const [startDate, setStartDate] = useState<Date>(new Date());
  return (
    <DatePickerContainer>
      <DatePicker
        name={'test'}
        className="red-border"
        selected={startDate}
        onChange={(date) => setStartDate(date)}
        showTimeSelect={true}
        timeFormat="HH:mm"
        timeIntervals={30}
        minTime={setHours(setMinutes(new Date(), 0), 12)}
        maxTime={setHours(setMinutes(new Date(), 0), 23)}
        timeCaption="time"
        dateFormat="MMMM d, yyyy H:mm"
        isClearable={true}
        showYearDropdown={true}
        todayButton={'today'}
      />
    </DatePickerContainer>
  );
}
