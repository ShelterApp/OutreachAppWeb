import React from "react";
import { useState, useEffect } from "react";
import styles from "styles/Home.module.scss";
import stylesComponent from 'component/Component.module.scss';
import Button from "component/Button";
import Container from "@mui/material/Container";
import Header from "component/Header";
import { useForm, useFormContext, FormProvider, UseFormRegister } from "react-hook-form";
import ErrorMessage from "component/ErrorMessage";
import TextInput from "component/TextInput";
import { PeopleProps } from "common/interface";
import Collapse from '@mui/material/Collapse';
import RemoveCircleOutlineIcon from '@mui/icons-material/RemoveCircleOutline';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';

type Inputs = {
  name: string;
  age: number;
};

const genderOption = [
  "Male",
  "Female",
  "Non-binary",
  "Prefer to self-disclose",
  "Prefer not to answer",
].map((x: string) => ({ value: x, label: x }));
const raceOption = [
  "American Indian or Alaska Native",
  "Asian",
  "Black or African American",
  "Hispanic or Latino",
  "Native Hawaiian or Other Pacific Islander",
  "White",
  "Prefer to self-disclose",
  "Prefer not to answer"
].map((x: string) => ({ value: x, label: x }));
const unhouseSinceOption = ["Less than an year", "1 year", "2 year"].map(
  (x: string) => ({ value: x, label: x })
);
const disabledOption = ["Yes", "No"].map((x: string) => ({
  value: x,
  label: x,
}));

const optionsHomeless = [ "No",'Unknown', "Less than 1 month",'1 to 6 months','6 to 12 months','More than 12 months'].map((x: string) => ({
  value: x,
  label: x,
}));

interface UnhousedInfoProps {
  onSubmit: Function;
  previousBack: Function;
  people: any;
}

const UnhousedInfo = ({
  onSubmit,
  previousBack,
  people
}: UnhousedInfoProps) => {
  const methods = useForm();

  const [loading, setLoading] = useState(false);

  const submit = (data: any, e: any) => {
    setLoading(true);
    e.preventDefault();
    const list: PeopleProps[] = people.map((p: PeopleProps, index: number) => {
      return {
        ...p,
        age: parseInt(data[`age-${index}`]),
        disabled: data[`disabled-${index}`],
        race: data[`race-${index}`],
        gender: data[`gender-${index}`],
        name: data[`name-${index}`],
        unhouseSince: data[`homeless-${index}`] === 'Yes' ? data[`unhouseSince-${index}`] : '',
        homeless: data[`homeless-${index}`]
      }
    })

    onSubmit(list);
    setLoading(false);
  };

  useEffect(() => {
    const form: any = {};
    people.map((p: any, index: number) => {
      Object.keys(p).map((key: string) => {
        form[`${key}-${index}`] = p[key];
      })
    })

    methods.reset(form)

  }, [people])

  return (
    <main
      className={styles.mainTop}
      style={{ position: "relative", height: "100%" }}
    >
      <Header title="Unhoused Info" onClick={() => previousBack(2)} />
      <Container maxWidth="sm">
        <div className={styles.grid}>
          <FormProvider {...methods}>
            <form name="form-camp" onSubmit={methods.handleSubmit(submit)}>
              {
                people.map((p: PeopleProps, i: number) => (
                  <NestedComponent index={i} key={i} obj={p} />
                ))
              }

              <div className={styles.grid} style={{ paddingTop: "10px" }}>
                <Button text="Next" loading={loading} type="submit" />
              </div>
            </form>
          </FormProvider>
        </div>
      </Container>
    </main>
  );
};

export default UnhousedInfo;

const NestedComponent = ({ index, obj }: { index: number, obj: PeopleProps }) => {
  const {
    register,
    reset,
    watch,
    formState: { errors },
  } = useFormContext(); // retrieve all hook methods
  const [checked, setChecked] = useState(true);
  const collapse = () => {
    setChecked(!checked)
  }

  useEffect(() => {
    reset(obj);
  }, []);

  return (
    <div>
      <p onClick={() => collapse()} className={stylesComponent.unhousedGroup}>
        {
          checked ? <RemoveCircleOutlineIcon/> : <AddCircleOutlineIcon/>
        }
        Person {index + 1} info
      </p>
      <Collapse in={checked}>
        <TextInput
          label="Name"
          placeholder="Name"
          register={register(`name-${index}`, )}
        />
      
        <TextInput
          label="Age"
          placeholder="Estimated age"
          register={register(`age-${index}`, {
            min: 1,
            max: 100,
          })}
          type="number"
        />
        {errors[`age-${index}`] && errors[`age-${index}`].type === "min" && (
          <ErrorMessage>Please input age is invalid.</ErrorMessage>
        )}
        {errors[`age-${index}`] && errors[`age-${index}`].type === "max" && (
          <ErrorMessage>Please input age is invalid.</ErrorMessage>
        )}
        <SelectComponent
          label='Gender'
          {...register(`gender-${index}`)}
          options={genderOption}
        />
        <SelectComponent
          label='Race'
          {...register(`race-${index}`)}
          options={raceOption}
        />
        <SelectComponent
          label='Disabled?'
          {...register(`disabled-${index}`, )}
          options={disabledOption}
        />
        <SelectComponent
          label='Homeless'
          {...register(`homeless-${index}`, )}
          options={optionsHomeless}
        />
        
        {
          watch(`homeless-${index}`) === 'Yes' && (
            <>
              <SelectComponent
                label='Unhoused Since'
                {...register(`unhouseSince-${index}`)}
                options={unhouseSinceOption}
              />
             
            </>
          )
        }
      </Collapse>
    </div>
  );
};

// eslint-disable-next-line react/display-name
const SelectComponent = React.forwardRef<
  HTMLSelectElement,
  { label: string, options: any[] } & ReturnType<UseFormRegister<Inputs>>
>(({ onChange, onBlur, name, label, options }, ref) => (
  <>
    <label className={stylesComponent.label}>{label}</label>
    <select className={stylesComponent.styleSelect} name={name} ref={ref} onChange={onChange} onBlur={onBlur}>
      {
        options.map((opt, i) => (
          <option key={i} value={opt.value}>{opt.label}</option>
        ))
      }
    </select>
  </>
));
