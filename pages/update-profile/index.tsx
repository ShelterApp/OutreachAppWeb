import type { NextPage } from "next";
import { useForm, SubmitHandler } from "react-hook-form";
import ErrorMessage from "component/ErrorMessage";
import styles from "styles/Home.module.scss";
import TextInput from "component/TextInput";
import Select from "component/Select";
import Button from "component/Button";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { userService } from "services";
import SuccessMessage from "component/SuccessMessage";

const options = [
  { value: "618563c781a92408a00bd1aa", label: "Seattle" },
  { value: "618562de8f4e4f313fdc8111", label: "San Jose" },
];

type Inputs = {
  name: string;
  phone: string;
  email: string;
};

const UpdateProfile: NextPage = () => {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
    reset
  } = useForm<Inputs>();
  const onSubmit: SubmitHandler<Inputs> = async (data: any) => {
    let user = {
      ...data,
      regionId: region ? region.value : ''
    }
    const res = await userService.update(user);
    setMessage('')
    if (res && res._id) {
      setMessage('success')
    } else {
      setMessage('Have something wrong!')
    }
  };
  const [region, setRegion] = useState<any>(options[0]);
  const [message, setMessage] = useState('');
  const [currentUser, setCurrentUser] = useState();
  useEffect(() => {
    if(!!userService.userValue) {
      const user = userService.userValue.user;
      setCurrentUser(user)
      reset({
        name: user.name,
        phone: user.phone,
        email: user.email
      })
      setRegion(options.find(opt => opt.value === user.regionId ))
    }
  }, [])

  return (
    <div className={styles.container}>
      <main className={styles.main}>
        <div className={styles.titleName}>OutreachApp</div>
        <div className={styles.grid}>
          <form onSubmit={handleSubmit(onSubmit)} style={{width:'100%'}}>
            <div className={styles.grid}>
            <TextInput
              placeholder="Update My Name"
              register = {register("name", { required: true })}
            />
            {errors.name && errors.name.type === "required" && (
              <ErrorMessage>Please input name.</ErrorMessage>
            )}
            <Select placeholder="Update City" options={options} value={region} onChange={setRegion}/>
            </div>
            <TextInput
              placeholder="Update Phone"
              register = {register("phone", { required: true })}
            />
            {errors.phone && errors.phone.type === "required" && (
              <ErrorMessage>Please input phone.</ErrorMessage>
            )}
            <TextInput
              type="email"
              register = {register("email", {
                required: true,
                pattern:
                  /^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i,
              })}
              placeholder="Update Email"
            />
            {errors.email && errors.email.type === "pattern" && (
              <ErrorMessage>Email must be valid.</ErrorMessage>
            )}
            {errors.email && errors.email.type === "required" && (
              <ErrorMessage>Please input email.</ErrorMessage>
            )}
            {
              message && (
                message === 'success' ?
                <SuccessMessage>Your profile was updated successful.</SuccessMessage> :
                <ErrorMessage>{message}</ErrorMessage>
              )
            }
             <div className={styles.grid}>
                <Button text="Save" type='submit' onClick={()=>handleSubmit(onSubmit)
                }></Button>
              </div>
            {/* <Button
              type="submit"
              variant="outlined"
              size="large"
              className={stylesComponent.card}
              style={{
                textTransform: "none",
                borderRadius: 50,
                backgroundColor: "#5952ff",
                color: "white",
              }}
            >
              Sign Up
            </Button> */}
          </form>
        </div>
      </main>
    </div>
  );
};

export default UpdateProfile;
