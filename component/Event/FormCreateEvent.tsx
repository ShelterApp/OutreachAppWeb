/* eslint-disable @typescript-eslint/ban-types */
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import ErrorMessage from "component/ErrorMessage";
import TextInput from "component/TextInput";
import Button from "component/Button";
import styles from "styles/Home.module.scss";
import { alertService } from "services";
import stylesComponent from "component/Component.module.scss";
import InputDate from "component/InputDate";
import InputTime from "component/InputTime";
import Grid from '@mui/material/Grid';
import dayjs from 'dayjs';
import {formatPhoneNumber} from 'helpers/function';

type Inputs = {
  title: string;
  description: string;
  contactPhone: string;
  contactEmail: string;
  address: string;
  maxAttended: number;
};

const defaultValues: any = {
  title: '',
  description: '',
  contactPhone: '',
  contactEmail: '',
  address: '',
  maxAttended: 0
};

interface FormProps {
  onSubmit: Function;
  data?: any;
}

const FormCreateEvent = ({onSubmit, data}: FormProps) => {
  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors },
  } = useForm<Inputs>({
    defaultValues: defaultValues
  });
  // eslint-disable-next-line
  const [loading, setLoading] = useState(false);
  const [startTime, setStartTime] = React.useState<Date | null>(null);
  const [endTime, setEndTime] = React.useState<Date | null>(null);

  const [day, setDay] = React.useState<Date | null>(null);

  const submit = async (data: any, e: any) => {
    setLoading(true);
    e.preventDefault();

    if(!day || !startTime || !endTime) {
      alertService.error('Please select date time of event')
      setLoading(false);
      return;
    }
    const startDate = `${dayjs(day).format("YYYY-MM-DD")} ${dayjs(startTime).format("HH:mm")}`;
    const endDate = `${dayjs(day).format("YYYY-MM-DD")} ${dayjs(endTime).format("HH:mm")}`;

    const params = {
      ...data,
      startDate: startDate,
      endDate: endDate,
      maxAttended: Math.floor(data.maxAttended)
    }

    onSubmit(params)
    setLoading(false);
  };

  useEffect(() => {
    if (data && data._id) {
      setDay(new Date(data.startDate))
      setStartTime(new Date(data.startDate))
      setEndTime(new Date(data.endDate))
      const init = {
        title: data.title,
        description: data.description,
        contactPhone: data.contactPhone,
        contactEmail: data.contactEmail,
        address: data.address,
        maxAttended: data.maxAttended
      }
      reset(init)
    }
  }, [data])

  return (
    <React.Fragment>
      <form name="form-vol" onSubmit={handleSubmit(submit)}>
        <TextInput
          label="Name"
          type="string"
          register = {register("title", {
            required: true
          })}
          placeholder="Event name"
        />
        {errors.title && errors.title.type === "required" && (
          <ErrorMessage>Please input name.</ErrorMessage>
        )}
        <label className={stylesComponent.label}>Description</label>
        <textarea
          {...register("description", { required: true })}
          className={stylesComponent.input}
          placeholder="Description"
        />
        {errors.description && errors.description.type === "required" && (
          <ErrorMessage>Please input description.</ErrorMessage>
        )}
        <InputDate
          label={'Select Day'}
          value={day}
          setValue={(e:any)=>{
            if(e< new Date() && e.getDate()!== new Date().getDate()) return alertService.error('Please choose another day.')
            setDay(e)
          }}
        />
        <Grid container spacing={2}>
          <Grid item xs={6}>
            <InputTime
              label="Start Time"
              value={startTime}
              setValue={setStartTime}
            />
          </Grid>

          <Grid item xs={6}>
            <InputTime
              label="End Time"
              value={endTime}
              setValue={setEndTime}
            />
          </Grid>
        </Grid>
        <TextInput
          label="Meet up address"
          type="string"
          register = {register("address", {
            required: true
          })}
          placeholder="Meet up address"
        />
        {errors.address && errors.address.type === "required" && (
          <ErrorMessage>Please input address.</ErrorMessage>
        )}
         <TextInput
          label="Contact Number"
          placeholder="Contact Number"
          register={register("contactPhone", { 
            required: true,
            onChange:(e)=>setValue('contactPhone',formatPhoneNumber(e.target.value)),
            minLength:14,
           })}
        />

        {errors.contactPhone && errors.contactPhone.type === "required" && (
          <ErrorMessage>Please input contact number.</ErrorMessage>
        )}
        <TextInput
          label="Email Address"
          type="email"
          register={register("contactEmail", {
            required: true,
            pattern:
              /^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i,
          })}
          placeholder="Email address"
        />
        {errors.contactEmail && errors.contactEmail.type === "pattern" && (
          <ErrorMessage>Email must be valid.</ErrorMessage>
        )}
        {errors.contactEmail && errors.contactEmail.type === "required" && (
          <ErrorMessage>Please input email.</ErrorMessage>
        )}
        <TextInput
          label="Max Attendees"
          placeholder="Max Attendees"
          register={register("maxAttended", { required: true, min: 0 })}
          type='number'
        />
        {errors.maxAttended && errors.maxAttended.type === "required" && (
          <ErrorMessage>Please input max attended.</ErrorMessage>
        )}
        <div className={styles.grid}>
          <Button text="Save" loading={loading} type="submit"/>
        </div>
      </form>
    </React.Fragment>
  );
};

export default FormCreateEvent;
