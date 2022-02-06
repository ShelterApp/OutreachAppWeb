import type { NextPage } from "next";
import React from 'react';
import { useState } from "react";
import AddNewCamp from "component/AddCamp/AddNewCamp";
import CampDetails from "component/AddCamp/CampDetails";
import UnhousedInfo from "component/AddCamp/UnhousedInfo";
import Supplies from "component/AddCamp/Supplies";
import { alertService, campsService } from "services";
import { useRouter } from "next/router";
import { CampDetailsProps, PeopleProps } from "common/interface";
import { getLocationAPIMap } from "services/map.service";

const initCampDetails: CampDetailsProps = {
  description: "",
  name: "",
  numOfPeople: 1,
  numOfPet: 0,
  type: 1,
  address: '',
  status: 1
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
  const [step, setStep] = useState<number>(1);

  const onSubmit = async (i: number) => {
    const locationMap = await getLocationAPIMap(center);
    let address = "";
    if (locationMap.results && locationMap.results[0]) {
      address = locationMap.results[0]?.formatted_address;
    }
    setCampDetails({
      ...campDetails,
      address: address
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
  const [center, setCenter] = useState(_center);
  const [zoom, setZoom] = useState(10);
  const [dropSupplies, setDropSupplies] = useState<any[]>([]);
  const [requestSupplies, setRequestSupplies] = useState<any[]>([]);
  const router = useRouter();

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
      type: 1,
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
      {
        step === 1 && <AddNewCamp title={'Add New Camp'} zoom={zoom} setZoom={setZoom} center={center} setCenter={setCenter} onSubmit={onSubmit}/>
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
