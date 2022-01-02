import React, { useState, useEffect } from 'react';
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

interface CampDetailsPageProps {
  onSubmit: Function;
  previousBack: Function;
  defaultValues: CampDetailsProps;
}

const CampDetails = ({ onSubmit, previousBack, defaultValues }: CampDetailsPageProps) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CampDetailsProps>({
    defaultValues: defaultValues
  });
  // eslint-disable-next-line
  const [loading, setLoading] = useState(false);

  const submit = async (data: any, e: any) => {
    setLoading(true);
    e.preventDefault();
    let form = {
      ...data,
      type: type.value
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

  const optionsType = [
    {label: 'Camps', value: 1},
    {label: 'CampWithPets', value: 3},
    {label: 'RV', value: 5},
    {label: 'SafeParking', value: 7},
    {label: 'Other', value: 9}
  ]

  const [hasPet, setHasPet] = useState({label: 'No', value: false})
  const [type, setType] = useState(optionsType[0]);

  useEffect(() => {
    const _opt: any = optionsType.find((opt: any) => opt.value === defaultValues.type)
    setType(_opt)

    const _optHasPet: any = defaultValues.numOfPet > 0 ? {label: 'Yes', value: true} : {label: 'No', value: false};
    setHasPet(_optHasPet)
  }, [])

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
          <Select
            label="Type"
            placeholder="Select Type"
            options={optionsType}
            value={type}
            onChange={setType}
          />
          <label className={stylesComponent.label}>Description of the Camp</label>
          <textarea
            {...register("description", { required: false })}
            className={stylesComponent.input}
            placeholder="Description of the Camp"
          />
          <TextInput
            label="Address"
            placeholder="Address"
            register={register("address", { required: false })}
          />
          <TextInput
            label="Number of People"
            placeholder="Number of People"
            register={register("numOfPeople", { required: true })}
            type='number'
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
                  type='number'
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
