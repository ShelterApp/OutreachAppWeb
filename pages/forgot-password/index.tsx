import type { NextPage } from "next";
import { useForm, SubmitHandler } from "react-hook-form";
import ErrorMessage from "component/ErrorMessage";
import styles from "styles/Home.module.scss";
import TextInput from "component/TextInput";
import Button from "component/Button";
import { userService, alertService } from "services";
import Container from '@mui/material/Container';

type Inputs = {
  email: string;
};

const ForgotPassword: NextPage = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Inputs>();
  const onSubmit: SubmitHandler<Inputs> = async (data: any) => {
    const res = await userService.forgotPassword(data);
    if (res && res.message) {
      if(res.message=='cannot_found_user') return alertService.error('User not Found. Please enter a valid email.')
      alertService.error(res.message)
    } else {
      alertService.success('Please check your email to reset password.');
    }
  };

  return (
    <Container maxWidth='sm'>
    <div className={styles.container}>
      <main className={styles.main}>
        <div className={styles.titleName}>OutreachApp</div>
        {/* <div className={styles.grid}> */}
          <form onSubmit={handleSubmit(onSubmit)} style={{width:'100%'}}>
            {/* <div className={styles.grid}> */}
            <TextInput
              label="Email"
              type="email"
              register = {register("email", {
                required: true,
                pattern:
                  /^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i,
              })}
              placeholder="Enter email or phone"
            />
            {/* </div> */}
            {errors.email && errors.email.type === "pattern" && (
              <ErrorMessage>Email must be valid.</ErrorMessage>
            )}
            {errors.email && errors.email.type === "required" && (
              <ErrorMessage>Please input email.</ErrorMessage>
            )}
             <div className={styles.grid}>
                <Button text="Reset" type='submit'></Button>
              </div>
          </form>
        {/* </div> */}
      </main>
    </div>
    </Container>

  );
};

export default ForgotPassword;
