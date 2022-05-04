import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import ErrorMessage from "component/ErrorMessage";
import stylesComponent from "component/Component.module.scss";
import TextInput from "component/TextInput";
import Button from "component/Button";
import styles from "styles/Home.module.scss";
import { alertService, organizationService } from "services";
import { useRouter } from "next/router";
import dayjs from "dayjs";

type Inputs = {
  name: string;
  email: string;
  description: string;
  address: string;
  phone: string;
  code:string;
};

const defaultValues: any = {
  name: "",
  description: "",
  address: "",
  phone: "",
  email: "",
  code:'',
};

const FormEditOrg = ({ org }: any) => {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<Inputs>({
    defaultValues: defaultValues
  });
  // eslint-disable-next-line
  const [loading, setLoading] = useState(false);
  const [phoneNumber, setPhone]= useState<any>('');

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

  const submit = async (data: any, e: any) => {
    setLoading(true);
    e.preventDefault();
    const res = await organizationService.update(org._id, data)
    if (res.statusCode && res.message) {
      alertService.error(res.message)
    } else {
      router.push('/organizations/').then(() => {
        alertService.success('Organization was updated successful!')
      })
    }
    setLoading(false);
  };

  useEffect(() => {
    if (org && org._id) {
      setPhone(org.phone)
      reset({
        name: org.name,
        description: org.description,
        address: org.address,
        // phone: org.phone,
        email: org.email,
        code:org.code,
      });
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [org]);

  return (
    <React.Fragment>
      <form name="form_org" onSubmit={handleSubmit(submit)}>
        <TextInput
          label="Name"
          placeholder="Name"
          register={register("name", { required: true })}
        />
        {errors.name && errors.name.type === "required" && (
          <ErrorMessage>Please input name.</ErrorMessage>
        )}
        <label className={stylesComponent.label}>Description</label>
        <textarea
          {...register("description", { required: true })}
          className={stylesComponent.input}
          placeholder="Updated Description"
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
        <TextInput
          label="Email"
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
          label="Verification Code"
          placeholder="Verification Code"
          register={register("code", { required: true })}
        />
        
        <label className={stylesComponent.label}>Created On</label>
        <input disabled className={stylesComponent.input} value={dayjs(org.createdAt).format("MMMM DD, YYYY")} placeholder="Created On"/>
        <label className={stylesComponent.label}>Last Updated</label>
        <input disabled className={stylesComponent.input} value={dayjs(org.updatedAt).format("MMMM DD, YYYY")} placeholder="Last Updated"/>
        <div className={styles.grid}>
          <Button text="Save" loading={loading} type="submit"/>
        </div>
      </form>
    </React.Fragment>
  );
};

export default FormEditOrg;
