import type { NextPage } from "next";
import { useForm, SubmitHandler } from "react-hook-form";
import ErrorMessage from "component/ErrorMessage";
import SuccessMessage from "component/SuccessMessage";
import styles from "styles/Home.module.scss";
import Button from "component/Button";
import { useState } from "react";
import { useRouter } from "next/router";
import { userService, alertService } from "services";
import stylesComponent from "component/Component.module.scss";
import Container from '@mui/material/Container';
import TextInput from "component/TextInput";

type Inputs = {
  password: string;
  confirmPassword: string;
};

const ForgotPassword: NextPage = () => {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<Inputs>();
  const onSubmit: SubmitHandler<Inputs> = async (data: any) => {
    data.token = router.query.code;
    if (!data.token) {
      alertService.error('Account not found')
    } else {
      const res = await userService.resetPassword(data);
      if (res && res.message) {
        alertService.error(res.message)
      } else {
        alertService.success('Your password updated successful');
      }
    }
  };

  return (
    <Container maxWidth="sm">

    <div className={styles.container}>
      <main className={styles.main}>
        <div className={styles.titleName}>OutreachApp</div>
        <div className={styles.grid}>
          <form onSubmit={handleSubmit(onSubmit)} style={{ width: "100%" }}>
            <div className={styles.grid}>
              <TextInput
                label="New Password"
                placeholder="New Password"
                type="password"
                register={register("password", { required: true, minLength: 6 })}
              />
              {errors.password && errors.password.type === "minLength" && (
                <ErrorMessage>
                  Password must be at least 6 characters long.
                </ErrorMessage>
              )}
              {errors.password && errors.password.type === "required" && (
                <ErrorMessage>Please input new password.</ErrorMessage>
              )}
              <TextInput
                label="Confirm Password"
                placeholder="Confirm Password"
                type="password"
                register={register("confirmPassword", {
                  required: true,
                  minLength: 6,
                  validate: value => value === watch("password")
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
              <Button text="Save" type="submit"></Button>
            </div>
          </form>
        </div>
      </main>
    </div>
    </Container>
  );
};

export default ForgotPassword;
