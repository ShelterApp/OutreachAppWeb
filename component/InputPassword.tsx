import * as React from 'react';
import IconButton from '@mui/material/IconButton';
import InputBase from '@mui/material/InputBase';
import InputAdornment from '@mui/material/InputAdornment';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import styles from './Component.module.scss'

export interface InputPasswordProps {
  placeholder?:string;
  register?: any;
}

const InputPassword = (props: InputPasswordProps) => {

  const [showPassword, setShowPassword] = React.useState(false)

  const handleMouseDownPassword = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
  };

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword)
  }

  return (
    <InputBase
      id="outlined-adornment-password"
      type={showPassword ? 'text' : 'password'}
      className={styles.input}
      placeholder={props.placeholder}
      {...props.register}
      autoComplete='off'
      endAdornment={
        <InputAdornment position="end">
          <IconButton
            aria-label="toggle password visibility"
            onClick={handleClickShowPassword}
            onMouseDown={handleMouseDownPassword}
            edge="end"
          >
            {showPassword ? <VisibilityOff /> : <Visibility />}
          </IconButton>
        </InputAdornment>
      }
    />
  )
}

export default InputPassword;
