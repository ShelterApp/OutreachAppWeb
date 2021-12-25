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
import { alertService, suppliesService, supplyItemsService,requestService } from 'services';
import Grid from '@mui/material/Grid';
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import { useRouter } from "next/router";

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

interface BasicTabsProps {
  supplies: any[];
  supplyItems: any[];
  add: Function;
  remove: Function;
  requestSupplies: any[];
  updateQty: Function;
}

const BasicTabs = ({ supplyItems, supplies, add, remove, requestSupplies, updateQty }: BasicTabsProps) => {
  const [value, setValue] = useState(0);

  


  const findSupply = (id: string) => {
      return requestSupplies?.find((obj: any) => obj.supplyId === id)
  }
  return (
    <Box sx={{ width: '100%' }}>
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
            <SupplyItem  updateQty={updateQty} supply={findSupply(sup._id)} key={index} obj={sup} add={add} remove={remove}/>
          ))
        }
    </Box>
  );
}

const SupplyItem = ({ obj, add, remove, supply, updateQty}: any) => {
  const [quantity, setQuantity] = useState<any>(supply ? supply.qty : 0)
  const handlePlus = () => {
    if (quantity >= 0) {
     
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
        <RemoveIcon className="cursor-pointer" fontSize="small" onClick={() => handleRemove()}/>
        <div style={{ marginLeft: 10, marginRight: 10 }}>
          { quantity }
        </div>
        <AddIcon className="cursor-pointer" fontSize="small" onClick={() => handlePlus()}/>
      </Grid>
    </Grid>
  )
}

const Supplies = () => {
  const router = useRouter();
  const { id } = router.query;
  const [supplies, setSupplies] = useState<any[]>([]);
  const [supplyItems, setSupplyItems] = useState<any[]>([]);
  const [requestSupplies, setRequestSupplies] = useState<any[]>([]);
  useEffect(() => {
    fetchData();
  }, [])
  const fetchData = async () => {
    const res = await suppliesService.list();
    const data = await supplyItemsService.list();
    const items = data.items.map((i: any) => ({ _id: i.supplyId._id, name: i.supplyId.name, qty: i.qty}));
    setSupplyItems(items);
    setSupplies(res.items);
  };
  const add = (id: string, quantity: number, name: string) => {
      setRequestSupplies([...requestSupplies, { supplyId: id, supplyName: name, qty: quantity }])
  }
  const onSubmit=async()=>{
    const res=await  requestService.createCamp({campId:id, supplies:requestSupplies});
    if(res._id){
      alertService.success('Request Supplies successful!');
      fetchData();
      setRequestSupplies([]);
    }
  }

  const remove = (id: string) => {
      const new_list = requestSupplies.filter((obj: any) => obj.id !== id);
      setRequestSupplies([...new_list])
  }

  const updateQty = (qty: number, id: string) => {
      const _requestSupplies = [...requestSupplies];
      const objIndex = _requestSupplies.findIndex((obj => obj.supplyId == id));
      _requestSupplies[objIndex].qty = qty
      setRequestSupplies([..._requestSupplies])
  }

  return (
    <main className={styles.mainTop} style={{ position: 'relative', height: '100%', }}>
      <Header title='Request supplies' back='/'/>
      <Container maxWidth="sm">
        <div className={styles.grid}>
          <BasicTabs  updateQty={updateQty} requestSupplies={requestSupplies} add={add} remove={remove} supplyItems={supplyItems} supplies={supplies}/>
          <Button text="Done" onClick={() => onSubmit()}/>
        </div>
      </Container>
    </main>
  )
}

export default Supplies;
