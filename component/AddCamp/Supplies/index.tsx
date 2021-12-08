import React from 'react';
import { useState, useEffect } from "react";
import styles from "styles/Home.module.scss";
import Button from "component/Button";
import Container from '@mui/material/Container';
import Header from 'component/Header';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import { alertService, suppliesService, supplyItemsService } from 'services';
import Grid from '@mui/material/Grid';
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          {children}
        </Box>
      )}
    </div>
  );
}

function a11yProps(index: number) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  };
}

interface BasicTabsProps {
  supplies: any[];
  supplyItems: any[];
  add: Function;
  remove: Function;
  current_tab: Function;
  dropSupplies: any[];
  requestSupplies: any[];
  updateQty: Function;
}

const BasicTabs = ({ supplyItems, supplies, add, remove, current_tab, dropSupplies, requestSupplies, updateQty }: BasicTabsProps) => {
  const [value, setValue] = useState(0);
  const tabs = ['dropSupplies', 'requestSupplies'];
  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    current_tab(tabs[newValue])
    setValue(newValue);
  };

  const findSupply = (id: string) => {
    if(tabs[value] === 'requestSupplies') {
      return requestSupplies.find((obj: any) => obj.supplyId === id)
    } else {
      return dropSupplies.find((obj: any) => obj.supplyId === id)
    }
  }

  return (
    <Box sx={{ width: '100%' }}>
      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs value={value} onChange={handleChange} aria-label="basic tabs example">
          <Tab label="Drop Supplies" {...a11yProps(0)} />
          <Tab label="Request Supplies" {...a11yProps(1)} />
        </Tabs>
      </Box>
      <TabPanel value={value} index={0}>
        <Grid container spacing={2}>
          <Grid item xs={6}>
            Supply Item
          </Grid>
          <Grid item xs={6}>
            Quantity
          </Grid>
        </Grid>
        <br/>
        {
          supplyItems.length > 0 && supplyItems.map((sup: any, index: number) => (
            <SupplyItem tab='dropSupplies' updateQty={updateQty} supply={findSupply(sup._id)} key={index} obj={sup} add={add} remove={remove}/>
          ))
        }
      </TabPanel>
      <TabPanel value={value} index={1}>
        <Grid container spacing={2}>
          <Grid item xs={6}>
            Supply Item
          </Grid>
          <Grid item xs={6}>
            Quantity
          </Grid>
        </Grid>
        <br/>
        {
          supplies.length > 0 && supplies.map((sup: any, index: number) => (
            <SupplyItem tab='requestSupplies' updateQty={updateQty} supply={findSupply(sup._id)} key={sup._id} obj={sup} add={add} remove={remove}/>
          ))
        }
      </TabPanel>
    </Box>
  );
}

const SupplyItem = ({tab, obj, add, remove, supply, updateQty}: any) => {
  console.log(obj)
  const [quantity, setQuantity] = useState<any>(supply ? supply.qty : 0)
  const handlePlus = () => {
    if (quantity >= 0) {
      if(tab === 'dropSupplies') {
        if(quantity + 1 > obj.qty) {
          alertService.error(`${obj.name} don't have enough quantity`)
          return;
        }
      }
      setQuantity(quantity + 1)
    } else {
      setQuantity(0)
    }
  }
  const handleRemove = () => {
    if(quantity > 1) {
      setQuantity(quantity - 1)
    } else {
      setQuantity(0)
    }
  }

  useEffect(() => {
    supply && updateQty(quantity, obj._id)
    if (quantity > 0 && !checked) {
      onCheck(true)
    } else if (quantity == 0 && checked) {
      onCheck(false)
    }
  }, [quantity])

  const [checked, setChecked] = useState<boolean>(supply ? true : false)
  const onCheck = (b: boolean) => {
    setChecked(b)
    if(b) {
      add(obj._id, quantity, obj.name)
    } else {
      remove(obj._id)
    }
  }

  return (
    <Grid container spacing={2} style={{ borderBottom: '1px solid gray'}}>
      <Grid item xs={6}>
        <FormControlLabel control={<Checkbox checked={checked} onChange={(e) => onCheck(e.target.checked)} />} label={obj.name} />
      </Grid>
      <Grid item xs={6} style={{display: 'flex', alignItems: 'center' }}>
        <AddIcon className="cursor-pointer" fontSize="small" onClick={() => handlePlus()}/>
        <div style={{ marginLeft: 10, marginRight: 10 }}>
          { quantity }
        </div>
        <RemoveIcon className="cursor-pointer" fontSize="small" onClick={() => handleRemove()}/>
      </Grid>
    </Grid>
  )
}

interface SuppliesProps {
  onSubmit: Function;
  previousBack: Function;
  dropSupplies: any[];
  setDropSupplies: Function;
  requestSupplies: any[];
  setRequestSupplies: Function;
}

const Supplies = ({ onSubmit, previousBack, dropSupplies, setDropSupplies, requestSupplies, setRequestSupplies }: SuppliesProps) => {
  const [supplies, setSupplies] = useState<any[]>([]);
  const [supplyItems, setSupplyItems] = useState<any[]>([]);
  useEffect(() => {
    const fetchData = async () => {
      const res = await suppliesService.list();
      const data = await supplyItemsService.list();
      let items = data.items.map((i: any) => ({ _id: i.supplyId._id, name: i.supplyId.name, qty: i.qty}));
      setSupplyItems(items);
      setSupplies(res.items);
    };
    fetchData();
  }, [])

  const [tab, setTab] = useState('dropSupplies')

  const add = (id: string, quantity: number, name: string) => {
    if(tab === 'requestSupplies') {
      setRequestSupplies([...requestSupplies, { supplyId: id, supplyName: name, qty: quantity }])
    } else {
      setDropSupplies([...dropSupplies, { supplyId: id, supplyName: name, qty: quantity }])
    }
  }

  const remove = (id: string) => {
    if(tab === 'requestSupplies') {
      const new_list = requestSupplies.filter((obj: any) => obj.id !== id);
      setRequestSupplies([...new_list])
    } else {
      const new_list = dropSupplies.filter((obj: any) => obj.id !== id);
      setDropSupplies([...new_list])
    }
  }

  const current_tab = (value: string) => {
    setTab(value)
  }

  const updateQty = (qty: number, id: string) => {
    if(tab === 'requestSupplies') {
      let _requestSupplies = [...requestSupplies];
      let objIndex = _requestSupplies.findIndex((obj => obj.supplyId == id));
      _requestSupplies[objIndex].qty = qty
      setRequestSupplies([..._requestSupplies])
    } else {
      let _dropSupplies = [...dropSupplies];
      let objIndex = _dropSupplies.findIndex((obj => obj.supplyId == id));
      _dropSupplies[objIndex].qty = qty
      setDropSupplies([..._dropSupplies])
    }
  }

  return (
    <main className={styles.mainTop} style={{ position: 'relative', height: '100%', }}>
      <Header title='Drop/Request supplies' onClick={() => previousBack(3)}/>
      <Container maxWidth="sm">
        <div className={styles.grid}>
          <BasicTabs current_tab={current_tab} updateQty={updateQty} dropSupplies={dropSupplies} requestSupplies={requestSupplies} add={add} remove={remove} supplyItems={supplyItems} supplies={supplies}/>
          <Button text="Submit" onClick={() => onSubmit()}/>
        </div>
      </Container>
    </main>
  )
}

export default Supplies;
