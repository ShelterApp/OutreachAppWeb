import type { NextPage } from "next";
import { useForm, SubmitHandler } from "react-hook-form";
import ErrorMessage from "component/ErrorMessage";
import styles from "styles/Home.module.scss";
import TextInput from "component/TextInput";
import Select from "component/Select";
import Button from "component/Button";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { userService, alertService, regionsService } from "services";
import Container from '@mui/material/Container';
import Header from 'component/Header';
import stylesComponent from "component/Component.module.scss";

type Inputs = {
  confirmPassword: string;
  oldPassword: string;
  newPassword: string;
};

const UpdatePassword: NextPage = () => {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<Inputs>();
  const onSubmit: SubmitHandler<Inputs> = async (data: any) => {
    let user = {
      ...data,
    };
    const res = await userService.changePassword(user);
    if (res && res.code==204) {
      alertService.success("Your password was updated successful.");
      router.push("/login");
    } else {
      alertService.error("Have something wrong");
    }
  };


  return (
    <main className={styles.mainTop}>
      <Header title='Update Password' back='/' />
      <Container maxWidth="sm">
        <div className={styles.grid}>
          <form onSubmit={handleSubmit(onSubmit)} style={{ width: "100%" }}>
            <div className={styles.grid}>
              <input
                {...register("oldPassword", { required: true, minLength: 6 })}
                type="password"
                placeholder="Current Password"
                className={stylesComponent.input}
                autoComplete="false"
              />
              {errors.oldPassword && errors.oldPassword.type === "minLength" && (
                <ErrorMessage>
                  Password must be at least 6 characters long.
                </ErrorMessage>
              )}
              {errors.oldPassword && errors.oldPassword.type === "required" && (
                <ErrorMessage>Please input password.</ErrorMessage>
              )}
              <input
                {...register("newPassword", { required: true, minLength: 6 })}
                type="password"
                placeholder="New Password"
                className={stylesComponent.input}
                autoComplete="false"
              />
              <input
                {...register("confirmPassword", { required: true, minLength: 6 })}
                type="password"
                placeholder="Confirm Password"
                className={stylesComponent.input}
                autoComplete="false"
              />
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
