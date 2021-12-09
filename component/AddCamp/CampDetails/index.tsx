import React from 'react';
import { useState, useEffect } from "react";
import styles from "styles/Home.module.scss";
import Button from "component/Button";
import { userService } from "services";
import Container from '@mui/material/Container';
import Header from 'component/Header';
import { GoogleMap, useJsApiLoader, Marker } from '@react-google-maps/api';
import { useForm } from "react-hook-form";
import ErrorMessage from "component/ErrorMessage";
import stylesComponent from "component/Component.module.scss";
import TextInput from "component/TextInput";
import Select from "component/Select";

type Inputs = {
  name: string;
  description: string;
  numOfPeople: number;
  numOfPet: number;
};

interface CampDetailsProps {
  onSubmit: Function;
  previousBack: Function;
  defaultValues: Inputs;
}

const CampDetails = ({ onSubmit, previousBack, defaultValues }: CampDetailsProps) => {
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

  const submit = async (data: any, e: any) => {
    setLoading(true);
    e.preventDefault();
    let form = {
      ...data
    }
    if(!hasPet.value) {
      form = {
        ...data,
        numOfPet: 0
      }
    }
    onSubmit(form)
    setLoading(false);
  };

  const options = [
    {label: 'Yes', value: true},
    {label: 'No', value: false}
  ]

  const [hasPet, setHasPet] = useState({label: 'No', value: false})


  return (
    <main className={styles.mainTop} style={{ position: 'relative', height: '100%', }}>
      <Header title='Camp Details' onClick={() => previousBack(1)}/>
      <Container maxWidth="sm">
        <div className={styles.grid}>
          <form name="form-camp" onSubmit={handleSubmit(submit)}>
          <TextInput
            label="Camp Name"
            placeholder="Camp Name"
            register={register("name", { required: true })}
          />
          {errors.name && errors.name.type === "required" && (
            <ErrorMessage>Please input name.</ErrorMessage>
          )}
          <label className={stylesComponent.label}>Description of the Camp</label>
          <textarea
            {...register("description", { required: false })}
            className={stylesComponent.input}
            placeholder="Description of the Camp"
          />
          <TextInput
            label="Number of People"
            placeholder="Number of People"
            register={register("numOfPeople", { required: true })}
            type='tel'
          />
          {errors.numOfPeople && errors.numOfPeople.type === "required" && (
            <ErrorMessage>Please input number of people.</ErrorMessage>
          )}
          <Select
            label="Any pet in this camp?"
            placeholder="Any pet in this camp?"
            options={options}
            value={hasPet}
            onChange={setHasPet}
          />
          {
            hasPet.value && (
              <>
                <TextInput
                  label="Number of Pets"
                  placeholder="Number of Pets"
                  register={register("numOfPet", { required: true })}
                  type='tel'
                />
                {errors.numOfPet && errors.numOfPet.type === "required" && (
                  <ErrorMessage>Please input number of pets.</ErrorMessage>
                )}
              </>
            )
          }
          <div className={styles.grid}>
            <Button text="Next" loading={loading} type="submit"/>
          </div>
        </form>
        </div>
      </Container>
    </main>
  )
}

export default CampDetails;
