import * as React from 'react';
import TextField from '@mui/material/TextField';
import AdapterDateFns from '@mui/lab/AdapterDateFns';
import LocalizationProvider from '@mui/lab/LocalizationProvider';
import DatePicker from '@mui/lab/DatePicker';
import styles from './Component.module.scss'

interface InputProps {
  label: string;
  value: Date | null;
  // eslint-disable-next-line @typescript-eslint/ban-types
  setValue: Function;
}

const BasicDatePicker = ({ label, value, setValue }: InputProps) => {
  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <label className={styles.label}>{label}</label>
      <DatePicker
        label=""
        value={value}
        onChange={(newValue) => {
          setValue(newValue);
        }}
        renderInput={(params) => <TextField className='inputDate' {...params} />}
      />
    </LocalizationProvider>
  );
}

export default BasicDatePicker;
