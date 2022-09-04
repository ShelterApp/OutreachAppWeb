import type { NextPage } from "next";
import React from 'react';
import { useState,useEffect } from "react";
import AddNewCamp from "component/AddCamp/AddNewCamp";
import CampDetails from "component/AddCamp/CampDetails";
import UnhousedInfo from "component/AddCamp/UnhousedInfo";
import Supplies from "component/AddCamp/Supplies";
import { userService, campsService,alertService } from "services";
// import { useRouter } from "next/router";
import { CampDetailsProps, PeopleProps } from "common/interface";
import { getLocationAPIMap } from "services/map.service";
import styles from "styles/Home.module.scss";
import { useRouter } from "next/router";

const initCampDetails: CampDetailsProps = {
  description: "",
  name: "",
  numOfPeople: 0,
  numOfPet: 0,
  type: 1,
  address: '',
  status: 1,
  city:'',
  state:'',
}

const initPeople: PeopleProps = {
  age: undefined,
  disabled: 'No',
  name: '',
  gender: '',
  race: '',
  unhouseSince: '',
  homeless: 'No'
}

const AddCamp: NextPage = () => {
  const router = useRouter();
  const [step, setStep] = useState<number>(1);

  const onSubmit = async (i: number) => {
    const locationMap = await getLocationAPIMap(center);
    let address = "",postcode='',state='',county='',city='';
    if (locationMap.results && locationMap.results[0]) {
      // address = locationMap.results[0]?.formatted_address;
      locationMap.results[0].address_components.forEach((element:any) => {
        if(element.types.includes('postal_code')) postcode=element.long_name;
        if(element.types.includes('administrative_area_level_1')) state=element.long_name;
        if(element.types.includes('administrative_area_level_2')) county=element.long_name;
        if(element.types.includes('locality')) city=element.long_name;
        if(element.types.includes('route')) address=element.long_name;

      });
    }
    setCampDetails({
      ...campDetails,
      address: address,
      postcode,state,county,city
    })
    
    setStep(i)
  }

  const [campDetails, setCampDetails] = useState<CampDetailsProps>(initCampDetails)

  const onSubmitCamp = (form: any) => {
    setCampDetails({...form})
    if (form.numOfPeople == 0) {
      setPeople([])
      setStep(4)
    } else {
      if(people.length > form.numOfPeople) {
        setPeople([...people.slice(0, form.numOfPeople)]);
      } else {
        const _i = form.numOfPeople - people.length;
        const newPeople = [...Array(_i).fill(0).map(() => ({...initPeople}))];
        setPeople([...people, ...newPeople]);
      }
      setStep(3)
    }
  }

  const previousBack = (i: number) => {
    if(i === 3 && people.length == 0) {
      setStep(2)
    } else {
      setStep(i)
    }
  }

  const [people, setPeople] = useState<PeopleProps[]>([])

  const onSubmitUnhousedInfo = (list: PeopleProps[]) => {
    setPeople([...list]);
    setStep(4)
  }

  const _center = {
    lat: 32.965557,
    lng: -96.71583
  };
  const [center, setCenter] = useState({});
  const [zoom, setZoom] = useState(12);
  const [dropSupplies, setDropSupplies] = useState<any[]>([]);
  const [requestSupplies, setRequestSupplies] = useState<any[]>([]);
  // const router = useRouter();

  useEffect(() => {
    
    navigator.geolocation.getCurrentPosition((position) => {
      if (position.coords){
        setCenter({
          lat :position.coords.latitude,
          lng: position.coords.longitude
        })
      }
    }, (error)=>{
      console.log(error);
      const user = userService.userValue;
      if(user.user.regionId) {
        setCenter({
          lat : user.user.regionId.lat,
          lng: user.user.regionId.lng,
        })
      }else{
        setCenter(_center)
      }
    },{timeout:5000});
  }, []);

  const createCamp = async () => {
    const data = {
      ...campDetails,
      people: people,
      numOfPeople: Math.floor(campDetails.numOfPeople),
      numOfPet: Math.floor(campDetails.numOfPet),
      location: {
        type: 'Point',
        'coordinates': [
          center.lng, center.lat
        ]
      },
      requestSupplies: requestSupplies,
      dropSupplies: dropSupplies,
      status: 1
    }
    
    const res = await campsService.create(data);
    if (res.statusCode && res.message) {
      alertService.error(res.message)
    } else {
      router.push('/manage-camps').then(() => {
        alertService.success('Camp was created successful!')
      })
    }
  }

  return (
    <>
          {!center.lat && (
            <div style={{position:'absolute',display:'flex',alignItems:'center',flexDirection:'column',width:'100%',top:'45%' }}>
              <div className={styles.loading}>
                <div />
                <div />
                <div />
                <div />
              </div>
              <div>Loading your location</div>
            </div>
          ) }
      {
        step === 1 &&center.lat && <AddNewCamp title={'Add New Camp'} zoom={zoom} setZoom={setZoom} center={center} setCenter={setCenter} onSubmit={onSubmit}/>
      }
      {
        step === 2 && <CampDetails isNew defaultValues={campDetails} previousBack={previousBack} onSubmit={onSubmitCamp}/>
      }
      {
        step === 3 && <UnhousedInfo people={people} previousBack={previousBack} onSubmit={onSubmitUnhousedInfo}/>
      }
      {
        step === 4 && <Supplies dropSupplies={dropSupplies} requestSupplies={requestSupplies} setDropSupplies={setDropSupplies} setRequestSupplies={setRequestSupplies} previousBack={previousBack} onSubmit={createCamp}/>
      }
    </>
  );
};

export default AddCamp;
