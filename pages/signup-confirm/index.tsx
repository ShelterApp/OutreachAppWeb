import type { NextPage } from "next";
// import { useForm, SubmitHandler } from "react-hook-form";
// import ErrorMessage from "component/ErrorMessage";
// import SuccessMessage from "component/SuccessMessage";
import styles from "styles/Home.module.scss";
import { useState, useEffect,useRef } from "react";
import { useRouter } from "next/router";
import { userService, alertService } from "services";

const SignupConfirm: NextPage = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const firstTime= useRef({});
  const token = router.query.code;

  useEffect(() => {
    init();
  },[token]);
  const init =  () => {
    firstTime.current=true;
    if (firstTime.current && token?.length) {
      setTimeout(async () => {
        const result = await userService.confirmEmail({
          token
        });
        console.log(result);
        
        if (result.message == 'bad_confirmation_token') {
           alertService.error('Invalid token. Please try again!');
        } else if (result.code == 204) {
          alertService.success('Verify your email successful. Please login to access our website.')
          router.push("/login");
        }else{
          alertService.error(result.message);
        }
        setLoading(false);
      }, 1000);
    }else if(token){
      setLoading(false);
      alertService.error('Not found your request.');
    }
  };
  return (
    <div className={styles.container}>
      <main className={styles.main}>
        <div className={styles.titleName}>OutreachApp</div>
        <div className={styles.grid}>
          {loading ? (
            <>
              <div className={styles.loading}>
                <div />
                <div />
                <div />
                <div />
              </div>
              <div>Veryfing your email</div>
            </>
          ) : null}
        </div>
      </main>
    </div>
  );
};

export default SignupConfirm;
