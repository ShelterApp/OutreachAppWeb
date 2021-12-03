import React from 'react';
import { useState, useEffect } from "react";
import styles from "styles/Home.module.scss";
import Button from "component/Button";
import { alertService, userService } from "services";
import Container from '@mui/material/Container';
import Header from 'component/Header';
import { GoogleMap, useJsApiLoader, Marker } from '@react-google-maps/api';
import { useForm } from "react-hook-form";
import ErrorMessage from "component/ErrorMessage";
import stylesComponent from "component/Component.module.scss";
import TextInput from "component/TextInput";
import Select from "component/Select";
import Card from '@mui/material/Card';
import DeleteIcon from "@mui/icons-material/Delete";

type Inputs = {
  name: string;
  age: number;
};

interface UnhousedInfoProps {
  onSubmit: Function;
  previousBack: Function;
  people: any;
  setPeople: Function;
}

const defaultValues = {
  name: '',
  age: 18
}

const UnhousedInfo = ({ onSubmit, previousBack, people, setPeople }: UnhousedInfoProps) => {
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

  const submit = (data: any, e: any) => {
    setLoading(true);
    e.preventDefault();

    if(!gender.value) {
      alertService.error('Please input gender')
      return;
    }
    let form = {
      ...data,
      gender: gender.value,
      race: race ? race.value : '',
      disabled: disabled ? disabled.value : '',
      unhouseSince: unhouseSince ? unhouseSince.value : '',
    }

    setPeople([...people, form])
    resetData()

    setLoading(false);
  };

  const resetData = () => {
    reset(defaultValues);
    setGender(genderOption[0]);
    setRace(undefined)
    setDisabled(undefined)
    setUnhouseSince(undefined)
  }

  const genderOption = ['Male', 'Female', 'Non-binary', 'Prefer to self-disclose', 'Prefer not to answer'].map((x: string) => ({value: x, label: x}));
  const [gender, setGender] = useState<any>(genderOption[0])

  const raceOption = ["American Indian or Alaska Native", "Asian", "Black or African American", "Hispanic or Latino", "Native Hawaiian or Other Pacific Islander", "White"].map((x: string) => ({value: x, label: x}));
  const [race, setRace] = useState<any>()

  const disabledOption = ['Yes', 'No'].map((x: string) => ({value: x, label: x}));
  const [disabled, setDisabled] = useState<any>()

  const unhouseSinceOption = ['Less than an year', '1 year', '2 year'].map((x: string) => ({value: x, label: x}));
  const [unhouseSince, setUnhouseSince] = useState<any>()

  const removePeople = (index: number) => {
    people.splice(index, 1)
    setPeople([...people])
  }

  return (
    <main className={styles.mainTop} style={{ position: 'relative', height: '100%', }}>
      <Header title='Unhoused Info' onClick={() => previousBack(2)}/>
      <Container maxWidth="sm">
        <div className={styles.grid}>
          <form name="form-camp" onSubmit={handleSubmit(submit)}>
            <TextInput
              label="Name"
              placeholder="Name"
              register={register("name", { required: true })}
            />
            {errors.name && errors.name.type === "required" && (
              <ErrorMessage>Please input name.</ErrorMessage>
            )}
            <TextInput
              label="Age"
              placeholder="Age"
              register={register("age", { required: true, min: 1, max: 100 })}
              type='number'
            />
            {errors.age && errors.age.type === "required" && (
              <ErrorMessage>Please input age.</ErrorMessage>
            )}
            {errors.age && errors.age.type === "min" && (
              <ErrorMessage>Please input age is invalid.</ErrorMessage>
            )}
            {errors.age && errors.age.type === "max" && (
              <ErrorMessage>Please input age is invalid.</ErrorMessage>
            )}
            <Select
              label="Gender"
              placeholder="Gender"
              options={genderOption}
              value={gender}
              onChange={setGender}
            />
            <Select
              label="Race"
              placeholder="Race"
              options={raceOption}
              value={race}
              onChange={setRace}
            />
            <Select
              label="Disabled?"
              placeholder="Disabled?"
              options={disabledOption}
              value={disabled}
              onChange={setDisabled}
            />
            <Select
              label="Unhoused Since"
              placeholder="Unhoused Since"
              options={unhouseSinceOption}
              value={unhouseSince}
              onChange={setUnhouseSince}
            />
            <div className={styles.grid} style={{ paddingTop: '10px' }}>
              <Button text="Add people" loading={loading} type="submit"/>
            </div>
          </form>
        </div>
        {
          people.map((p: any, i: number) => {
            return (
              <Card key={i} variant="outlined" style={{ padding: '10px', marginBottom: 10, display: 'flex', justifyContent: 'space-between' }}>
                <div>
                  <p className="mt-0"><b>Name:</b> {p.name}</p>
                  <p className="mt-0"><b>Age:</b> {p.age}</p>
                  <p className="mt-0"><b>Gender:</b> {p.gender}</p>
                  <p className="mt-0"><b>Race:</b> {p.race}</p>
                  <p className="mt-0"><b>Disabled:</b> {p.disabled}</p>
                  <p className="mt-0"><b>Unhoused Since:</b> {p.unhouseSince}</p>
                </div>
                <DeleteIcon className="cursor-pointer" fontSize="small" onClick={() => removePeople(i)}/>
              </Card>
            )
          })
        }
        <div className={styles.grid}>
          <Button text="Submit" onClick={() => onSubmit(people)}/>
        </div>
      </Container>
    </main>
  )
}

export default UnhousedInfo;
