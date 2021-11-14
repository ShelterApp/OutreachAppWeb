import type { NextPage } from "next";
import { useForm, SubmitHandler } from "react-hook-form";
import ErrorMessage from "component/ErrorMessage";
import SuccessMessage from "component/SuccessMessage";
import styles from "styles/Home.module.scss";
import TextInput from "component/TextInput";
import Button from "component/Button";
import { useState } from "react";
import { useRouter } from "next/router";
import { userService } from "services";
import stylesComponent from "component/Component.module.scss";

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
      setMessage("Account not found");
    } else {
      setMessage("");
      const res = await userService.resetPassword(data);
      if (res && res.message) {
        setMessage(res.message)
      } else {
        setMessage('success')
      }
    }
  };
  const [message, setMessage] = useState("");

  return (
    <div className={styles.container}>
      <main className={styles.main}>
        <div className={styles.titleName}>OutreachApp</div>
        <div className={styles.grid}>
          <form onSubmit={handleSubmit(onSubmit)} style={{ width: "100%" }}>
            <div className={styles.grid}>
              <input
                {...register("password", {
                  required: true,
                  minLength: 6,
                })}
                type="password"
                placeholder="New Password"
                className={stylesComponent.input}
                autoComplete="false"
              />
              {errors.password && errors.password.type === "minLength" && (
                <ErrorMessage>
                  Password must be at least 6 characters long.
                </ErrorMessage>
              )}
              {errors.password && errors.password.type === "required" && (
                <ErrorMessage>Please input new password.</ErrorMessage>
              )}
              <input
                {...register("confirmPassword", {
                  required: true,
                  minLength: 6,
                  validate: value => value === watch("password")
                })}
                type="password"
                placeholder="Confirm Password"
                className={stylesComponent.input}
                autoComplete="false"
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
            {message &&
              (message === "success" ? (
                <SuccessMessage>
                  Your password updated successful
                </SuccessMessage>
              ) : (
                <ErrorMessage>{message}</ErrorMessage>
              ))}
            <div className={styles.grid}>
              <Button text="Save" type="submit"></Button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
};

export default ForgotPassword;
