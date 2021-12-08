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

const initCampDetails: CampDetailsProps = {
  description: "",
  name: "",
  numOfPeople: 1,
  numOfPet: 0
}

const initPeople: PeopleProps = {
  age: 18,
  disabled: 'No',
  name: '',
  gender: 'Male',
  race: '',
  unhouseSince: ''
}

const AddCamp: NextPage = () => {
  const [step, setStep] = useState<number>(1);

  const onSubmit = (i: number) => {
    setStep(i)
  }

  const [campDetails, setCampDetails] = useState<CampDetailsProps>(initCampDetails)

  const onSubmitCamp = (form: any) => {
    setStep(3)
    setCampDetails({...form})
    if(people.length > form.numOfPeople) {
      setPeople([...people.slice(0, form.numOfPeople)]);
    } else {
      const _i = form.numOfPeople - people.length;
      const newPeople = [...Array(_i).fill(0).map(() => ({...initPeople}))];
      setPeople([...people, ...newPeople]);
    }
  }

  const previousBack = (i: number) => {
    setStep(i)
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
      router.push('/').then(() => {
        alertService.success('Camp was created successful!')
      })
    }
  }

  return (
    <>
      {
        step === 1 && <AddNewCamp zoom={zoom} setZoom={setZoom} center={center} setCenter={setCenter} onSubmit={onSubmit}/>
      }
      {
        step === 2 && <CampDetails defaultValues={campDetails} previousBack={previousBack} onSubmit={onSubmitCamp}/>
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
