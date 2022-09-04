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
import {formatPhoneNumber} from 'helpers/function';
import { Country, State, City }  from 'country-state-city';
import { countries} from 'helpers/function';
import Select from "component/Select";

type Inputs = {
  name: string;
  email: string;
  description: string;
  address: string;
  phone: string;
  code:string;
  postcode:string;
};

const defaultValues: any = {
  name: "",
  description: "",
  address: "",
  phone: "",
  email: "",
  code:'',
  postcode:'',
};

const FormEditOrg = ({ org }: any) => {
  const router = useRouter();
  const {
    register,
    setValue,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<Inputs>({
    defaultValues: defaultValues
  });
  const [loading, setLoading] = useState(false);

  const [country,setCountry]=useState(countries[0]);
  const [listState,setListState]=useState(State.getStatesOfCountry('US').map(item=>({
    label:item.name,
    value:item.isoCode
  })));
  const [state,setState]=useState({value:'',label:''});
  const [cities,setCities]=useState([]);
  const [city,setCity]=useState({value:'',label:''});
  const listCountry= Country.getAllCountries().map((item:any)=>
  ({label:item.name,value:item.isoCode }));

  const submit = async (data: any, e: any) => {
    setLoading(true);
    e.preventDefault();
    data.state=state.value;
    data.city=city.label;
    data.country=country.value;
    const res = await organizationService.update(org._id, data)

    if (res.statusCode && res.message) {
      alertService.error(res.message)
    } else {
      router.push('/organizations').then(() => {
        alertService.success('Organization was updated successful!')
      })
    }
    setLoading(false);
  };

  useEffect(() => {
    if (org && org._id) {
      reset({
        name: org.name,
        description: org.description,
        address: org.address,
        phone: org.phone,
        email: org.email,
        code:org.code,
        postcode:org.postcode,
      });
      // console.log(org.city,City.getCity (org.state));
      setCountry({
        label: Country?.getCountryByCode(org.country)?.name,
        value:org.country
      });
      setState({
        label: State?.getStateByCodeAndCountry(org.state,org.country)?.name,
        value:org.state});
        setCities(City?.getCitiesOfState(org.country,org.state).map(item=>({
          label:item.name,
          value:item.name
        })))
      setCity({
        label:org.city,
        value:org.city});
    }
  }, [org]);

  return (
    <React.Fragment>
      <form name="form_org" onSubmit={handleSubmit(submit)}>
        <TextInput
          label="Name"
          placeholder="Organization Name"
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
                value:item.stateCode
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
