import React, { useState } from "react";
import { useForm } from "react-hook-form";
import ErrorMessage from "component/ErrorMessage";
import stylesComponent from "component/Component.module.scss";
import TextInput from "component/TextInput";
import Button from "component/Button";
import styles from "styles/Home.module.scss";
import { alertService, organizationService } from "services";
import { useRouter } from "next/router";

type Inputs = {
  name: string;
  email: string;
  description: string;
  address: string;
  phone: string;
  password: string;
};

const defaultValues: any = {
  name: "",
  description: "",
  address: "",
  phone: "",
  email: "",
  password: "",
};

const FormCreateOrg = () => {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Inputs>({
    defaultValues: defaultValues
  });
  // eslint-disable-next-line
  const [loading, setLoading] = useState(false);
  const [phoneNumber, setPhone]= useState<any>('');

  const submit = async (data: any, e: any) => {
    setLoading(true);
    e.preventDefault();
    data.phone=phoneNumber;
    const org = await organizationService.create(data)
    if (org.statusCode && org.message) {
      alertService.error(org.message)
    } else {
      router.push('/organizations/').then(() => {
        alertService.success('Organization was created successful!')
      })
    }
    setLoading(false);
  };

  const formatPhoneNumber=(value:string)=> {
    if (!value) return value;
  
    const phoneNumber = value.replace(/[^\d]/g, '');
    const phoneNumberLength = phoneNumber.length;
    if (phoneNumberLength < 4) return phoneNumber;
    if (phoneNumberLength < 7) {
      return `(${phoneNumber.slice(0, 3)}) ${phoneNumber.slice(3)}`;
    }
    return `(${phoneNumber.slice(0, 3)}) ${phoneNumber.slice(
      3,  6
    )}-${phoneNumber.slice(6, 10)}`;
  }

  return (
    <React.Fragment>
      <form name="form_org" autoComplete="off" onSubmit={handleSubmit(submit)}>
        <TextInput
          label="Name"
          placeholder=" Organization Name"
          register={register("name", { required: true })}
        />
        {errors.name && errors.name.type === "required" && (
          <ErrorMessage>Please input name.</ErrorMessage>
        )}
        <label className={stylesComponent.label}>Description</label>
        <textarea
          {...register("description", { required: true })}
          className={stylesComponent.input}
          placeholder="Description of the Organization"
        />
        {errors.description && errors.description.type === "required" && (
          <ErrorMessage>Please input description.</ErrorMessage>
        )}
        <TextInput
          label="Address"
          placeholder="Address"
          register={register("address", { required: true })}
        />
        {errors.address && errors.address.type === "required" && (
          <ErrorMessage>Please input address.</ErrorMessage>
        )}
        <TextInput
          label="Phone"
          placeholder="Phone"
          value={phoneNumber}
          onChange={(e:string)=> setPhone(formatPhoneNumber(e.target.value))}
        />
         {!phoneNumber.length && (
          <ErrorMessage>Please input phone.</ErrorMessage>
        )}
        <TextInput
          label="Email"
          // aut
          placeholder="Email Address"
          register={register("email", {
            required: true,
            pattern:
              /^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i,
          })}
          type="email"
        />
        {errors.email && errors.email.type === "pattern" && (
          <ErrorMessage>Email must be valid.</ErrorMessage>
        )}
        {errors.email && errors.email.type === "required" && (
          <ErrorMessage>Please input email.</ErrorMessage>
        )}
        <TextInput
          label="Password"
          placeholder="Password"
          register={register("password", { required: true, minLength: 6 })}
          type="password"
        />
        {errors.password && errors.password.type === "minLength" && (
          <ErrorMessage>
            Password must be at least 6 characters long.
          </ErrorMessage>
        )}
        {errors.password && errors.password.type === "required" && (
          <ErrorMessage>Please input password.</ErrorMessage>
        )}
        <div className={styles.grid}>
          <Button text="Save" loading={loading} type="submit"/>
        </div>
      </form>
    </React.Fragment>
  );
};

export default FormCreateOrg;
