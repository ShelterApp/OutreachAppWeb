import React, { useState } from "react";
import { useForm } from "react-hook-form";
import ErrorMessage from "component/ErrorMessage";
import stylesComponent from "component/Component.module.scss";
import TextInput from "component/TextInput";
import Button from "component/Button";
import styles from "styles/Home.module.scss";
import { alertService, organizationService } from "services";
import { useRouter } from "next/router";
import {formatPhoneNumber} from 'helpers/function';
import { countries} from 'helpers/function';
import Select from "component/Select";
import { Country, State, City }  from 'country-state-city';

type Inputs = {
  name: string;
  email: string;
  description: string;
  address: string;
  phone: string;
  password: string;
  postcode:string;
};

const defaultValues: any = {
  name: "",
  description: "",
  address: "",
  phone: "",
  email: "",
  password: "",
  postcode:'',

};

const FormCreateOrg = () => {
  const router = useRouter();
  const [country,setCountry]=useState(countries[0]);
  const [listState,setListState]=useState(State.getStatesOfCountry('US').map(item=>({
    label:item.name,
    value:item.isoCode
  })));
  const [state,setState]=useState({});
  const [cities,setCities]=useState([]);
  const [city,setCity]=useState({});
  const listCountry= Country.getAllCountries().map((item:any)=>
  ({label:item.name,value:item.isoCode }));
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<Inputs>({
    defaultValues: defaultValues
  });
  // eslint-disable-next-line
  const [loading, setLoading] = useState(false);

  const submit = async (data: any, e: any) => {
    setLoading(true);
    e.preventDefault();
    // data.phone=phoneNumber;
    data.state=state.value;
    data.city=city.value;
    data.country=country.value;
// console.log(data);

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
         <Select
            label="Country"
            placeholder="Select Country"
            options={listCountry}
            value={country}
            onChange={(e)=>{
              setCountry(e);
              setListState(State.getStatesOfCountry(e.value).map(item=>({
                label:item.name,
                value:item.isoCode
              })));
              setState('');
              setCity('');
                }
              }
          />
          <Select
            label="State"
            placeholder="Select State"
            options={listState}
            value={state}
            onChange={(e)=>{
              setState(e);
              setCity('');
              const data= City.getCitiesOfState(country.value,e.value).map(item=>({
                label:item.name,
                value:item.name
              }));
              setCities(data);
            }}
            />
             <Select
            label="City"
            placeholder="Select City"
            options={cities}
            value={city}
            onChange={(e)=>{
              setCity(e);
            }}
            />
        <TextInput
          label="Detail Address"
          placeholder="Address"
          register={register("address", { required: true })}
        />
        {errors.address && errors.address.type === "required" && (
          <ErrorMessage>Please input address.</ErrorMessage>
        )}
           <TextInput
            label="Zip"
            placeholder="Zip"
            type='string'
            register={register("postcode", { required: false })}
          />
        <TextInput
          label="Phone"
          placeholder="Phone Number"
          register={register("phone", { 
            required: true,
            onChange:(e)=>setValue('phone',formatPhoneNumber(e.target.value)),
            minLength:14,
           })}
        />
        {errors.phone && errors.phone.type === "required" &&(
          <ErrorMessage>Please input phone.</ErrorMessage>
        )}
        {errors.phone && errors.phone.type === "minLength" &&(
          <ErrorMessage>Please input valid phone.</ErrorMessage>
        )}
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
