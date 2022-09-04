import React ,{useEffect,useRef} from "react";
import Link from "next/link";
import style from "./Component.module.scss";
import MenuIcon from "@mui/icons-material/Menu";
// import {  faCampground,fama } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import Search from '@mui/icons-material/Search';
import Drawer from "@mui/material/Drawer";
import Box from "@mui/material/Box";
import List from "@mui/material/List";
import Divider from "@mui/material/Divider";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import { userService } from "services";
import InputBase from '@mui/material/InputBase';
import { useDebounce } from 'use-debounce';

export interface ButtonProps {
  title?: string;
  search?: boolean;
  displaySearch?:boolean;
  onClick?: Function;
  user?: any;
  back?: string;
  onChangeSearch?:Function; 

}
interface Role<String> {
  Admin: object[];
  orgnLead: object[];
  volunteer: object[];
}

const Header = ({ title,displaySearch, user, back, onClick, onChangeSearch }: ButtonProps) => {
  const [state, setState] = React.useState(false);
  const [isSearch,setIsSearch]= React.useState(false);
  const [valueSearch, setValueSearch]= React.useState('');
  const [textSearch]= useDebounce(valueSearch, 1000);
  const isMounted = useRef(false)

  useEffect(()=>{
    if(isMounted.current){
      onChangeSearch && onChangeSearch(textSearch);
    } else {
     isMounted.current = true;
    }

  },[textSearch])
  const logout = () => {
    userService.logout();
  };

  const list = () => (
    <Box
      sx={{ width: 250 }}
      role="presentation"
      onClick={() => setState(false)}
      onKeyDown={() => setState(false)}
    >
      <List>
        <div style={{ textAlign: "center" }}>{user?.email}</div>
      </List>
      <Divider />
      <List>
        {routeSideMenu[user.userType].map(({ text, link }: any, index: number) => (
          text=='Donate'?
          <a href={link} target='_blank' rel="noreferrer">
            <ListItem button>
              <ListItemText primary={text} />
            </ListItem>
          </a>:
          <Link href={link ? link : '#'} passHref key={index}>
            <ListItem button onClick={() => text == 'Logout' ? logout() : null}>
              <ListItemText primary={text} />
            </ListItem>
          </Link>
        ))}
      </List>
    </Box>
  );

  return (
    <div className={style.containerHeader}>
      <div
        className={style.center}
        style={{ paddingLeft: 10,minWidth:70  }}>
        {
          onClick && typeof onClick === 'function' && (
            <button
              style={{
                backgroundColor: 'transparent',
                border: 'none',
                color: 'white',
                padding: 0
              }}
              onClick={() => onClick()
            }>
              <ArrowBackIosNewIcon
                className="cursor-pointer"
                fontSize="large"
              />
            </button>
          )
        }
        {
          !onClick && (
            <>
              {
                back ?
                <Link href={back} passHref>
                  <ArrowBackIosNewIcon
                    className="cursor-pointer"
                    fontSize="large"
                  />
                </Link>
                : <MenuIcon
                  className="cursor-pointer"
                  fontSize="large"
                  onClick={() => setState(true)} />
              }
            </>
          )
        }
      </div>
      <div
        className={style.titleHeader}
        style={{ width: "70%", textAlign: "center", color: "white",  }} >
        {!isSearch?<div style={{paddingTop:4,fontWeight:500}}>{title} </div> :
          <InputBase 
          autoFocus={true}
          id="search-input-e"
          value={valueSearch}
          onChange={(e)=>setValueSearch(e.target.value)}
          style={{backgroundColor:'white',width:'100%',marginTop:-4,paddingLeft:10, borderRadius:4}}
          placeholder='Search'
          /> }
      
      </div>
      <div className={style.center} style={{textAlign:'center',paddingTop:2,minWidth:70  }}>
       {
         displaySearch && !isSearch ?<Search className="cursor-pointer" fontSize="large" 
         onClick={()=>setIsSearch(true)  }
         style={{paddingTop:4}}/>:
         displaySearch?
          <div style={{paddingRight:10}} 
          onClick={()=>{
            setIsSearch(false);
            setValueSearch('');
          }}
          >Cancel</div>:null
       } 
        
      </div>
      <Drawer
        anchor="left"
        open={state}
        onClose={() => setState(false)} >
        {!!user && list()}
      </Drawer>
    </div>
  );
};
export default Header;
const routeSideMenu: any = {
  Admin: [
    { text: "Add Camp", link: "/add-camp" },
    { text: "Add Event", link: "/events/add" },
    { text: "Add New Supply", link: "/supplies/add/" },
    { text: "Add Volunteer", link: "/volunteers/add/" },
    { text: "Add Organization", link: "/organizations/add/" },
    { text: "Add New Supply Quantity", link: "/supply-items/add" },
    { text: "Manage Camps", link: "manage-camps" },
    { text: "Manage Events", link: "/events" },
    { text: "Manage Supplies", link: "/supplies" },
    { text: "Manage Volunteer", link: "/volunteers" },
    { text: "Manage Organization", link: "/organizations" },
    { text: "Manage Requests", link: "/manage-requests" },
    { text: "Manage Your Supply Quantity", link: "/supply-items" },
    { text: "My Inventory Dashboard", link: "/my-dashboard" },
    { text: "All Organizations Dashboard", link: "/all-inventory" },
    { text: "Update Profile", link: "/update-profile" },
    { text: "Update Password", link: "/update-password" },
    // { text: "Show Tutorial", link: "#" },
    { text: "Donate", link: "https://www.paypal.com/fundraiser/charity/3945196" },
    { text: "Terms of Use", link: "terms-of-use" },
    { text: "Privacy Policy", link: "/privacy-policy" },
    { text: "About Outreach App", link: "/about" },
    { text: "Logout", },
  ],
  OrgLead: [
    { text: "Add Camp", link: "/add-camp" },
    { text: "Add Event", link: "/events/add" },
    { text: "Add New Supply Quantity", link: "/supply-items/add" },
    { text: "Add Volunteer", link: "/volunteers/add/" },
    { text: "Manage Camps", link: "manage-camps" },
    { text: "Manage Events", link: "/events" },
    { text: "Manage Your Supply Quantity", link: "/supply-items" },
    { text: "Manage Volunteer", link: "/volunteers" },
    { text: "Manage Requests", link: "/manage-requests" },
    { text: "My Inventory Dashboard", link: "/my-dashboard" },
    { text: "My Events", link: "/my-events" },
    { text: "Update Profile", link: "/update-profile" },
    { text: "Update Password", link: "/update-password" },
    // { text: "Show Tutorial", link: "#" },
    { text: "Donate", link: "https://www.paypal.com/fundraiser/charity/3945196" },
    { text: "Terms of Use", link: "terms-of-use" },
    { text: "Privacy Policy", link: "/privacy-policy" },
    { text: "About Outreach App", link: "/about" },
    { text: "Logout", },
  ],
  Volunteer: [
    { text: "Add Camp", link: "/add-camp" },
    { text: "Add Event", link: "/events" },
    { text: "Add Claims", link: "/add-claims" },
    { text: "My Work", link: "/my-work" },
    { text: "My Events", link: "/my-events" },
    { text: "Update Profile", link: "/update-profile" },
    { text: "Update Password", link: "/update-password" },
    // { text: "Show Tutorial", link: "#" },
    { text: "Donate", link: "https://www.paypal.com/fundraiser/charity/3945196" },
    { text: "Terms of Use", link: "terms-of-use" },
    { text: "Privacy Policy", link: "/privacy-policy" },
    { text: "About Outreach App", link: "/about" },
    { text: "Logout", },
  ]
};
