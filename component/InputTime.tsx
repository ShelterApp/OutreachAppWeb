import * as React from 'react';
import TextField from '@mui/material/TextField';
import AdapterDateFns from '@mui/lab/AdapterDateFns';
import LocalizationProvider from '@mui/lab/LocalizationProvider';
import TimePicker from '@mui/lab/TimePicker';
import styles from './Component.module.scss'

interface InputProps {
  label: string;
  value: Date | null;
  // eslint-disable-next-line @typescript-eslint/ban-types
  setValue: Function;
}

const BasicTimePicker = ({ label, value, setValue }: InputProps) => {
  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <label className={styles.label}>{label}</label>
      <TimePicker
        label=""
        value={value}
        onChange={(newValue) => {
          setValue(newValue);
        }}
        renderInput={(params: any) =>
          <TextField
            className='inputDate'
            {...params}
          />
        }
      />
    </LocalizationProvider>
  );
}

export default BasicTimePicker;
