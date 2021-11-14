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
  email: string;
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
    const {currentPassword,confirmPassword,confirmPasswordAgain}=data;
    data.token=router.query.code;
    if(confirmPassword!==confirmPasswordAgain)setMessage('Please make sure your paswords match.');
    else if(!data.token){
      setMessage('Account not found');
    } else {
      console.log(data);
      setMessage('');
        //TODO
         // const res = await userService.forgotPassword(data);
    // if (res && res.message) {
    //   setMessage(res.message)
    // } else {
    //   setMessage('success')
    // }
    }
  
  };
  const [message, setMessage] = useState('');

  return (
    <div className={styles.container}>
      <main className={styles.main}>
        <div className={styles.titleName}>OutreachApp</div>
        <div className={styles.grid}>
          <form onSubmit={handleSubmit(onSubmit)} style={{width:'100%'}}>
            <div className={styles.grid}>
            <input
                {...register("currentPassword", { required: true, minLength: 6 })}
                type="password"
                placeholder="Current Password"
                className={stylesComponent.input}
                autoComplete="false"
              />
               <input
                {...register("confirmPassword", { required: true, minLength: 6 })}
                type="password"
                placeholder="New Password"
                className={stylesComponent.input}
                autoComplete="false"
              />
               <input
                {...register("confirmPasswordAgain", { required: true, minLength: 6 })}
                type="password"
                placeholder="Confirm Password"
                className={stylesComponent.input}
                autoComplete="false"
              />
            </div>
            {
              message && (
                message === 'success' ?
                <SuccessMessage>Your password updated successful</SuccessMessage> :
                <ErrorMessage>{message}</ErrorMessage>
              )
            }
             <div className={styles.grid}>
                <Button text="Save" type='submit'></Button>
              </div>
          </form>
        </div>
      </main>
    </div>
  );
};

export default ForgotPassword;
