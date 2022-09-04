import type { NextPage } from "next";
import React, { useState, useEffect } from "react";
import styles from "styles/Home.module.scss";
import { userService } from "services";
import Header from 'component/Header';
import Container from '@mui/material/Container';
import Select from "component/Select";

const MyDashboard: NextPage = () => {
  const [value, setValue] = useState<object>('');
  const [yearValue, setYearValue] = useState<object>({ value: new Date().getFullYear(), label: new Date().getFullYear() });
  const init = async (item) => {
    const condition = { year:item?.value || yearValue.value,  };
    const res = await userService.getReport(condition);
    if (res.itemPending) setValue(res);
    if(item)setYearValue(item);
  }
  useEffect(() => {
    init();
  }, []);
  const renderDistributed = (item) => {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return item.map((item, index) => <div key={index} style={{ fontSize: 20, padding: '7px 0px' }}> # {item.supplyName} Distributed: {item.count}</div>)
  }
  const setYear =  (item: any) => {
    init(item);
  }

  return (
    <main className={styles.mainTop}>
      <Header title={`All Organizations Inventory`} back='/' />
      <Container maxWidth="sm">
        <div style={{ paddingTop: 30 }} />
        <Select
          placeholder="Choose Year"
          options={[2021, 2022, 2023, 2024].map(item => ({ value: item, label: item }))}
          value={yearValue}
          onChange={setYear}
        />
        <div style={{ fontSize: 20, padding: '7px 0px' }}> # Organizations: {value.totalOrgranization}</div>
        <div style={{ fontSize: 20, padding: '7px 0px' }}> # Camps Covered: {value.totalCampCovered}</div>
        <div style={{ fontSize: 20, padding: '7px 0px' }}> # Unhoused Persons: {value.totalUnhousePerson}</div>
        <div style={{ fontSize: 20, padding: '7px 0px' }}> Total Volunteers: {value.totalVolunteer}</div>
        <div style={{ fontSize: 20, padding: '7px 0px' }}> Total Items Distributed: {value.itemDistributed?.length}</div>
        <div style={{ fontSize: 20, padding: '7px 0px' }}> Total Pending Distribution: {value.itemPending?.length}</div>
        <div style={{ fontSize: 20, padding: '7px 0px' }}> # User Requests Served: {value.totalUserRequestServed}</div>
        <div style={{ fontSize: 20, padding: '7px 0px' }}> # Camp Requests Served: {value.totalCampRequestServed}</div>
        <div style={{ fontSize: 20, padding: '7px 0px' }}> # Events Conducted: {value.eventConducted}</div>
        {!!value.itemDistributed && renderDistributed(value.itemDistributed)}
      </Container>
    </main>
  );
};

export default MyDashboard;
