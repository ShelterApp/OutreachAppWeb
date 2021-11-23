import type { NextPage } from "next";
import { useForm, SubmitHandler } from "react-hook-form";
import ErrorMessage from "component/ErrorMessage";
import styles from "styles/Home.module.scss";
import TextInput from "component/TextInput";
import Button from "component/Button";
import { userService, alertService } from "services";
import Container from '@mui/material/Container';
import Header from 'component/Header';

type Inputs = {
  confirmPassword: string;
  oldPassword: string;
  newPassword: string;
};

const UpdatePassword: NextPage = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    reset
  } = useForm<Inputs>();
  const onSubmit: SubmitHandler<Inputs> = async (data: any) => {
    const user = {
      ...data,
    };
    if(user.newPassword!=user.confirmPassword){
      alertService.error("The new password and confimation password do not match.");
    }
    const res = await userService.changePassword(user);
    if (res && res.status==204) {
      alertService.success("Your password was updated successful.");
      reset({oldPassword:'',newPassword:'',confirmPassword:''});
    } else {
      alertService.error(res.message);
    }
  };


  return (
    <main className={styles.mainTop}>
      <Header title='Update Password' back='/' />
      <Container maxWidth="sm">
        <div className={styles.grid}>
          <form onSubmit={handleSubmit(onSubmit)} style={{ width: "100%" }}>
            <div className={styles.grid}>
              <TextInput
                label="Current Password"
                placeholder="Current Password"
                register={register("oldPassword", { required: true, minLength: 6 })}
                type="password"
              />
              {errors.oldPassword && errors.oldPassword.type === "minLength" && (
                <ErrorMessage>
                  Password must be at least 6 characters long.
                </ErrorMessage>
              )}
              {errors.oldPassword && errors.oldPassword.type === "required" && (
                <ErrorMessage>Please input password.</ErrorMessage>
              )}
              <TextInput
                label="New Password"
                placeholder="New Password"
                register={register("newPassword", { required: true, minLength: 6 })}
                type="password"
              />
              {errors.newPassword && errors.newPassword.type === "minLength" && (
                <ErrorMessage>
                  Password must be at least 6 characters long.
                </ErrorMessage>
              )}
              {errors.newPassword && errors.newPassword.type === "required" && (
                <ErrorMessage>Please input new password.</ErrorMessage>
              )}
              <TextInput
                label="Confirm Password"
                placeholder="Confirm Password"
                type="password"
                register={register("confirmPassword", {
                  required: true,
                  minLength: 6,
                  validate: value => value === watch("newPassword")
                })}
              />
              {errors.confirmPassword && errors.confirmPassword.type === "minLength" && (
                <ErrorMessage>
                  Password must be at least 6 characters long.
                </ErrorMessage>
              )}
              {errors.confirmPassword && errors.confirmPassword.type === "required" && (
                <ErrorMessage>Please input confirm password.</ErrorMessage>
              )}
              {errors.confirmPassword && errors.confirmPassword.type === "validate" && (
                <ErrorMessage>Confirm password did not match. Please check and try again.</ErrorMessage>
              )}
            </div>
            <div className={styles.grid}>
              <Button
                text="Save"
                type="submit"
                onClick={() => handleSubmit(onSubmit)}
              ></Button>
            </div>
          </form>
        </div>
      </Container>
    </main>
  );
};

export default UpdatePassword;
